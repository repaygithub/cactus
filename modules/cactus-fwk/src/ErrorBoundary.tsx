import React, { ErrorInfo, Fragment, ReactElement } from 'react'

export type ErrorView = (error: Error, info: ErrorInfo) => ReactElement
export type OnError = (error: Error, info: ErrorInfo) => void

interface ErrorBoundaryProps {
  onError: OnError
  errorView?: ErrorView
}

interface ErrorBoundaryState {
  error: Error | undefined
  errorInfo: ErrorInfo | undefined
}

const initialState: ErrorBoundaryState = { error: undefined, errorInfo: undefined }

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  readonly state: ErrorBoundaryState = initialState

  componentDidCatch(error: Error | null, info: ErrorInfo | null) {
    if (error === null) {
      error = new Error('Error was lost during propagation')
    }
    if (info === null) {
      info = { componentStack: 'Stack trace unavailable.' }
    }
    this.props.onError(error, info)
    this.setState({ error: error, errorInfo: info })
  }

  render() {
    const { error, errorInfo } = this.state
    const { children, errorView: errorDisplay } = this.props

    if (error && errorInfo) {
      return errorDisplay ? errorDisplay(error, errorInfo) : null
    } else {
      return <Fragment>{children}</Fragment>
    }
  }
}

export default ErrorBoundary
