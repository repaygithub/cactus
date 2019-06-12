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

const noop = (error: Error, info: React.ErrorInfo) => {}

const withErrorBoundary = <BaseProps extends any>(
  BaseComponent: ComponentType<BaseProps>,
  onError?: OnError,
  errorView?: ErrorView
) => {
  const Wrapped = (props: BaseProps) => (
    <ErrorBoundary onError={onError ? onError : noop} errorView={errorView}>
      <BaseComponent {...props} />
    </ErrorBoundary>
  )

  return Wrapped
}

export default withErrorBoundary
