# Error Boundary

The `ErrorBoundary` component will catch and handle uncaught errors in its children.

## Using the Error Boundary Component

### Props

| Prop        | Required | Type                                                  | Default Value |
| ----------- | -------- | ----------------------------------------------------- | ------------- |
| `onError`   | Y        | Function of the form `(error, info) => void`          | N/A           |
| `errorView` | N        | Function of the form `({ error, info }) => React.Element` | `undefined`   |

### Example

```jsx
import React from 'react'
import { ErrorBoundary } from '@repay/cactus-fwk'
import { PossiblyErrorProneComponent } from 'somewhere/in/your/app'

export default function Container() {
  const handleError = (error, info) => {
    // Send error to Sentry/another API to record it
  }

  const errorView = ({ error, info }) => (
    <div>
      <h2>Whoops! Something went wrong on this page.</h2>
      <span>{error.message}</span>
    </div>
  )

  return (
    <ErrorBoundary onError={handleError} errorView={errorView}>
      <PossiblyErrorProneComponent />
    </ErrorBoundary>
  )
}
```

## Global Error Handling

The `AppRoot` component uses `ErrorBoundary` to accomplish global error handling.

### Props for Global Error Handling

These props can be passed to `AppRoot` to get the most out of the global error handling capabilities:

| Prop              | Required | Type                                                  | Default Value |
| ----------------- | -------- | ----------------------------------------------------- | ------------- |
| `onError`         | N        | Function of the form `(error, info) => void`          | noop function |
| `globalErrorView` | N        | Function of the form `({ error, info }) => React.Element` | `undefined`   |

### Global Example

```jsx
import React from 'react'
import AppRoot from '@repay/cactus-fwk'

export default function MainContainer() {
  const handleError = (error, info) => {
    // Send error to Sentry/another API to record it
  }

  const errorView = ({ error, info }) => (
    <div>
      <h2>Whoops! Something went wrong with our app.</h2>
      <span>{error.message}</span>
    </div>
  )

  return (
    <AppRoot onError={handleError} globalErrorView={errorView}>
      {/* Rest of application */}
    </AppRoot>
  )
}
```
