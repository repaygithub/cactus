import PropTypes from 'prop-types'
import React, { ComponentType, ErrorInfo, Fragment, ReactElement } from 'react'

export type ErrorView = ComponentType<ErrorViewProps>
export type OnError = (error: Error, info: ErrorInfo) => void

interface ErrorViewProps {
  error: Error
  info: ErrorInfo
}

interface ErrorBoundaryProps {
  children?: React.ReactNode
  onError: OnError
  errorView?: ErrorView
}

interface ErrorBoundaryState {
  error: Error | undefined
  errorInfo: ErrorInfo | undefined
}

const initialState: ErrorBoundaryState = { error: undefined, errorInfo: undefined }

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public readonly state: ErrorBoundaryState = initialState

  public static propTypes = {
    onError: PropTypes.func.isRequired,
    errorView: PropTypes.elementType,
  }

  public componentDidCatch(error: Error | null, info: ErrorInfo | null): void {
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

  public render(): ReactElement | null {
    const { error, errorInfo } = this.state
    const { children, errorView: ErrorView } = this.props

    if (error && errorInfo) {
      return ErrorView ? <ErrorView error={error} info={errorInfo} /> : null
    } else {
      return <Fragment>{children}</Fragment>
    }
  }
}

const withErrorBoundary = <BaseProps extends Record<string, any>>(
  BaseComponent: ComponentType<BaseProps>,
  onError: OnError,
  errorView?: ErrorView
): ((props: BaseProps) => ReactElement) => {
  if (onError === undefined) {
    throw new Error('You must pass the `onError` prop when using `withErrorBoundary`!')
  }

  return (props: BaseProps): ReactElement => (
    <ErrorBoundary onError={onError} errorView={errorView}>
      <BaseComponent {...props} />
    </ErrorBoundary>
  )
}

export default withErrorBoundary
