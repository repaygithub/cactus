import React from 'react'

import { cleanup, render } from 'react-testing-library'
import AppRoot, { ErrorBoundary } from '../src/index'

afterEach(cleanup)

const ProblemChild = () => {
  throw new Error('I am throwing this error just because I can')
}

const testErrorView = (error: Error, info: React.ErrorInfo) => (
  <div>
    <h2>There was an error</h2>
    <span>{error.message}</span>
    <span>{info.componentStack}</span>
  </div>
)

describe('error boundary', () => {
  describe('with mocked console errors', () => {
    let error: any
    let onError: any
    beforeEach(() => {
      error = console.error
      console.error = jest.fn()
      onError = jest.fn()
    })
    afterEach(() => {
      console.error = error
    })

    test('should catch errors and call onError', () => {
      const { container } = render(
        <ErrorBoundary onError={onError} errorView={testErrorView}>
          <ProblemChild />
        </ErrorBoundary>
      )

      expect(ProblemChild).toThrowError('I am throwing this error just because I can')
      expect(container).toHaveTextContent('There was an error')
      expect(onError).toHaveBeenCalled()
      expect(console.error).toHaveBeenCalled()
    })

    test('should allow error display to be passed to AppRoot', () => {
      const { container } = render(
        <AppRoot onError={onError} globalErrorView={testErrorView}>
          <ProblemChild />
        </AppRoot>
      )

      expect(ProblemChild).toThrowError('I am throwing this error just because I can')
      expect(container).toHaveTextContent('There was an error')
      expect(onError).toHaveBeenCalled()
      expect(console.error).toHaveBeenCalled()
    })

    test('should return null when no errorDisplay is provided', () => {
      const { container } = render(
        <AppRoot onError={onError}>
          <ProblemChild />
        </AppRoot>
      )

      expect(ProblemChild).toThrowError('I am throwing this error just because I can')
      expect(container.childElementCount).toBe(0)
      expect(onError).toHaveBeenCalled()
      expect(console.error).toHaveBeenCalled()
    })

    test('should display errors in the console', () => {
      render(
        <AppRoot onError={onError}>
          <ProblemChild />
        </AppRoot>
      )

      expect(console.error).toHaveBeenCalled()
    })
  })

  test('should render children when no errors occur', () => {
    const onError = jest.fn()
    const { container } = render(
      <ErrorBoundary onError={onError} errorView={testErrorView}>
        <h2>No errors thrown!</h2>
        <span>Hooray!</span>
      </ErrorBoundary>
    )

    expect(container).toHaveTextContent('No errors thrown!')
    expect(container).toHaveTextContent('Hooray!')
    expect(onError).not.toHaveBeenCalled()
  })
})
