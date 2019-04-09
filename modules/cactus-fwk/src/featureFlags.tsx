import React, { createContext, useContext, ComponentType, FC } from 'react'
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

const withFeatureFlags = <FeatureFlags extends string[], P extends object>(
  features: FeatureFlags,
  Component: ComponentType<P>
) => {
  return (props: P) => (
    <FeatureFlagContext.Consumer>
      {featureFlags => {
        const flags: FeatureFlagsObject = {}
        if (featureFlags === null) {
          for (const key of features) {
            flags[key] = false
          }
          return <Component {...props} {...flags} />
        }
        for (const key of features) {
          flags[key] = featureFlags[key]
        }
        return <Component {...props} {...flags} />
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

export { FeatureFlagContext, useFeatureFlags, withFeatureFlags, FeatureFlag }
