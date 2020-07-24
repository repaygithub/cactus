import { cleanup, render } from '@testing-library/react'
import React from 'react'

import AppRoot, { ErrorBoundary, withErrorBoundary } from '../src/index'

afterEach(cleanup)

const ProblemChild = () => {
  throw new Error('I am throwing this error just because I can')
}

const TestComponent = () => <h2>I won't throw any errors</h2>

interface TestErrorViewProps {
  error: Error
  info: React.ErrorInfo
}

const TestErrorView = (props: TestErrorViewProps) => (
  <div>
    <h2>There was an error</h2>
    <span>{props.error.message}</span>
    <span>{props.info.componentStack}</span>
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

    describe('regular component', () => {
      test('should catch errors and call onError', () => {
        const { container } = render(
          <ErrorBoundary onError={onError} errorView={TestErrorView}>
            <ProblemChild />
          </ErrorBoundary>
        )

        expect(ProblemChild).toThrowError('I am throwing this error just because I can')
        expect(container).toHaveTextContent('There was an error')
        expect(onError).toHaveBeenCalled()
        expect(console.error).toHaveBeenCalled()
      })
    })

    describe('higher order component', () => {
      test('should catch errors and call onError', () => {
        const GoldenChild = withErrorBoundary(ProblemChild, onError, TestErrorView)
        const { container } = render(<GoldenChild />)
        expect(ProblemChild).toThrowError('I am throwing this error just because I can')
        expect(container).toHaveTextContent('There was an error')
        expect(onError).toHaveBeenCalled()
        expect(console.error).toHaveBeenCalled()
      })
    })

    describe('AppRoot', () => {
      test('should allow error display to be passed to AppRoot', () => {
        const { container } = render(
          <AppRoot onError={onError} globalErrorView={TestErrorView}>
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
  })

  describe('regular component', () => {
    test('should render children when no errors occur', () => {
      const onError = jest.fn()
      const { container } = render(
        <ErrorBoundary onError={onError} errorView={TestErrorView}>
          <h2>No errors thrown!</h2>
          <span>Hooray!</span>
        </ErrorBoundary>
      )

      expect(container).toHaveTextContent('No errors thrown!')
      expect(container).toHaveTextContent('Hooray!')
      expect(onError).not.toHaveBeenCalled()
    })
  })

  describe('higher order component', () => {
    test('should render children when no errors occur', () => {
      const onError = jest.fn()
      const GoldenChild = withErrorBoundary(TestComponent, onError)
      const { container } = render(<GoldenChild />)

      expect(container).toHaveTextContent("I won't throw any errors")
      expect(onError).not.toHaveBeenCalled()
    })
  })
})
