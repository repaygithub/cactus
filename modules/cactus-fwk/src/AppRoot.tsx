import PropTypes from 'prop-types'
import React from 'react'

import { ErrorBoundary, ErrorView, OnError } from './ErrorBoundary'
import { FeatureFlagContext } from './featureFlags'
import { FeatureFlagsObject } from './types'

interface AppRootProps {
  children?: React.ReactNode
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

const noop = (): void => {
  return
}

const AppRoot: React.FC<AppRootProps> = (props) => (
  <ErrorBoundary onError={props.onError || noop} errorView={props.globalErrorView}>
    <FeatureFlagContext.Provider value={props.featureFlags || null}>
      {props.children}
    </FeatureFlagContext.Provider>
  </ErrorBoundary>
)

AppRoot.propTypes = {
  featureFlags: PropTypes.objectOf(PropTypes.bool.isRequired),
  onError: PropTypes.func,
  // Technically shouldn't allow strings, but I don't think it's worth a custom function.
  globalErrorView: PropTypes.elementType as any,
}

export default AppRoot
