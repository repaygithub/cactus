import React from 'react'

import { FeatureFlagContext } from './featureFlags'
import { FeatureFlagsObject } from './types'

interface AppRootProps {
  /**
   * Recieves an object for featureFlags
   */
  featureFlags?: FeatureFlagsObject
}

const AppRoot: React.FC<AppRootProps> = props => {
  return (
    <FeatureFlagContext.Provider value={props.featureFlags || null}>
      <React.Fragment>{props.children}</React.Fragment>
    </FeatureFlagContext.Provider>
  )
}

export default AppRoot
