import PropTypes from 'prop-types'
import React, { ComponentType, createContext, FC, useContext } from 'react'

import { FeatureFlagsObject } from './types'

const FeatureFlagContext = createContext<FeatureFlagsObject | null>(null)

const useFeatureFlags = <FeatureFlags extends string[]>(...features: FeatureFlags): boolean[] => {
  const featureFlags = useContext(FeatureFlagContext)
  if (featureFlags === null) {
    return Array(features.length).fill(false)
  }
  const result: boolean[] = []
  for (const key of features) {
    result.push(Boolean(featureFlags[key]))
  }
  return result
}

const withFeatureFlags = <FeatureFlags extends string[], Props extends object>(
  features: FeatureFlags,
  Component: ComponentType<Props>
) => {
  return (props: Props) => (
    <FeatureFlagContext.Consumer>
      {(featureFlags) => {
        const flags: FeatureFlagsObject = {}
        if (featureFlags === null) {
          for (const key of features) {
            flags[key] = false
          }
        } else {
          for (const key of features) {
            flags[key] = Boolean(featureFlags[key])
          }
        }
        let propsWithFlags = { ...props, ...flags } as React.PropsWithChildren<Props>
        return <Component {...propsWithFlags} />
      }}
    </FeatureFlagContext.Consumer>
  )
}

interface FeatureFlagProps {
  feature: string
  children: (enabled: boolean) => React.ReactElement
}

const FeatureFlag: FC<FeatureFlagProps> = ({ feature, children }) => {
  const [enabled] = useFeatureFlags(feature)
  return children(enabled)
}

FeatureFlag.propTypes = {
  feature: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
}

export { FeatureFlagContext, useFeatureFlags, withFeatureFlags, FeatureFlag }
