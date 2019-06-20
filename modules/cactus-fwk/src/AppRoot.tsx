import React, { WeakValidationMap } from 'react'

import { ErrorBoundary, ErrorView, OnError } from './ErrorBoundary'
import { FeatureFlagContext } from './featureFlags'
import { FeatureFlagsObject } from './types'
import PropTypes from 'prop-types'

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

AppRoot.propTypes = {
  featureFlags: PropTypes.objectOf(PropTypes.bool.isRequired),
  onError: PropTypes.func,
  globalErrorView: PropTypes.element,
} as WeakValidationMap<AppRootProps>

export default AppRoot
