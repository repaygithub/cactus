import React from 'react'

import { FeatureFlagContext } from './featureFlags'
import { FeatureFlagsObject } from './types'
import ErrorBoundary, { ErrorView, OnError } from './ErrorBoundary'

interface AppRootProps {
  /**
   * Receives an object for featureFlags
   */
  featureFlags?: FeatureFlagsObject
  /**
   * Receives an error handler function
   */
  onError?: OnError
  /**
   * Receives a view for global errors
   */
  globalErrorView?: ErrorView
}

const noop = (error: Error, info: React.ErrorInfo) => {}

const AppRoot: React.FC<AppRootProps> = props => {
  return (
    <ErrorBoundary onError={props.onError || noop} errorView={props.globalErrorView}>
      <FeatureFlagContext.Provider value={props.featureFlags || null}>
        <React.Fragment>{props.children}</React.Fragment>
      </FeatureFlagContext.Provider>
    </ErrorBoundary>
  )
}

export default AppRoot
