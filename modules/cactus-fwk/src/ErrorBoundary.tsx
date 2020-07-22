import PropTypes from 'prop-types'
import React, { ComponentType, ErrorInfo, Fragment } from 'react'

export type ErrorView = ComponentType<ErrorViewProps>
export type OnError = (error: Error, info: ErrorInfo) => void

interface ErrorViewProps {
  error: Error
  info: ErrorInfo
}

interface ErrorBoundaryProps {
  onError: OnError
  errorView?: ErrorView
}

interface ErrorBoundaryState {
  error: Error | undefined
  errorInfo: ErrorInfo | undefined
}

const initialState: ErrorBoundaryState = { error: undefined, errorInfo: undefined }

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  readonly state: ErrorBoundaryState = initialState

  static propTypes = {
    onError: PropTypes.func.isRequired,
    errorView: (props: any, propName: any, componentName: any) => {
      const prop = props[propName]
      if (prop !== undefined && typeof prop !== 'string' && typeof prop !== 'function') {
        return new Error(
          `The prop \`${propName}\` is marked as a component type in \`${componentName}\` but its type is \`${typeof prop}\`.`
        )
      }
      return null
    },
  }

  componentDidCatch(error: Error | null, info: ErrorInfo | null) {
    const { onError } = this.props
    if (error === null) {
      error = new Error('Error was lost during propagation')
    }
    if (info === null) {
      info = { componentStack: 'Stack trace unavailable.' }
    }
    if (typeof onError === 'function') {
      onError(error, info)
    }
    this.setState({ error: error, errorInfo: info })
  }

  render() {
    const { error, errorInfo } = this.state
    const { children, errorView: ErrorView } = this.props

    if (error && errorInfo) {
      return ErrorView ? <ErrorView error={error} info={errorInfo} /> : null
    } else {
      return <Fragment>{children}</Fragment>
    }
  }
}

const withErrorBoundary = <BaseProps extends any>(
  BaseComponent: ComponentType<BaseProps>,
  onError: OnError,
  errorView?: ErrorView
) => {
  if (onError === undefined) {
    throw new Error('You must pass the `onError` prop when using `withErrorBoundary`!')
  }

  const Wrapped = (props: BaseProps) => (
    <ErrorBoundary onError={onError} errorView={errorView}>
      <BaseComponent {...props} />
    </ErrorBoundary>
  )

  return Wrapped
}

export default withErrorBoundary
