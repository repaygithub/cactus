import PropTypes from 'prop-types'
import React, { ComponentType, createContext, FC, ReactElement, useContext } from 'react'

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

const withFeatureFlags = <FeatureFlags extends string[], Props extends Record<string, any>>(
  features: FeatureFlags,
  Component: ComponentType<Props>
): ((props: Props) => ReactElement) => {
  return (props: Props): ReactElement => (
    <FeatureFlagContext.Consumer>
      {(featureFlags): ReactElement => {
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
        const propsWithFlags: Props = { ...props, ...flags }
        return <Component {...propsWithFlags} />
      }}
    </FeatureFlagContext.Consumer>
  )
}

interface FeatureFlagProps {
  feature: string
  children: (enabled: boolean) => ReactElement
}

const FeatureFlag: FC<FeatureFlagProps> = ({ feature, children }): ReactElement => {
  const [enabled] = useFeatureFlags(feature)
  return children(enabled)
}

FeatureFlag.propTypes = {
  feature: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
}

export { FeatureFlagContext, useFeatureFlags, withFeatureFlags, FeatureFlag }
