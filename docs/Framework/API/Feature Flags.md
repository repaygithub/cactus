# Feature Flags

## Set up the context

Import the `AppRoot` component and use it near the top level of your application. Then provide your feature flag object as the `featureFlags` prop.

```tsx
// entry.tsx
import React, { useEffect, useState } from 'react'
import { Router } from '@reach/router'
import AppRoot, { FeatureFlagsObject } from '@repay/cactus-fwk'
import HomePage from './pages/Home'
import PageOne from './pages/PageOne'
import PageTwo from './pages/PageTwo'
import fetchFeatureFlags from './api/featureFlags'

/**
 * FeatureFlagsObject = { [key: string]: boolean }
 */

export default () => {
  const [features, setFeatures] = useState<FeatureFlagsObject>(undefined)
  useEffect(() => {
    /** fetchFeatureFlags returns a Promise<FeatureFlagsObject>
     */
    fetchFeatureFlags().then(featuresData => setFeatures(featuresData))
    // You should catch errors here but the example is not going to address that
  }, [setFeatures])

  return (
    <AppRoot featureFlags={features}>
      <Router>
        <HomePage path="/" />
        <PageOne path="/page-one" />
        <PageTwo path="/page-two" />
      </Router>
    </AppRoot>
  )
}
```

### Access using the hook

```ts
// type definition
const useFeatureFlags: (...features: string[]) => boolean[]
```

In the component which needs the feature flag, import the `useFeatureFlag` hook.

```tsx
// ./pages/Home.tsx
import * as React from 'react'
import { useFeatureFlags } from '@repay/cactus-fwk'

interface Props {
  customWelcomeMessage?: string
}

const Home: React.FC<Props> = props => {
  const [customWelcomeEnabled, otherFeatureEnabled] = useFeatureFlags(
    // any number of flags can be provided as arguments
    'custom_welcome_message',
    'other_feature_flag'
  )

  return (
    <div>
      <h1>Home Page</h1>
      <p>The normal welcome message</p>
      {customWelcomeEnabled && props.customWelcomeMessage && <p>{props.customWelcomeMessage}</p>}
    </div>
  )
}

export default Home
```

## Using a higher order component

If you are using a class component or don't want to use the hook, you can use the higher order component function to add the feature flags as a prop.

```tsx
// ./pages/Home.tsx
import * as React from 'react'
import { withFeatureFlags } from '@repay/cactus-fwk'

interface Props {
  /**
   * Be careful when naming props as you can see here the feature flags
   * are applied as the key provided so it would probably be better to
   * rename the customWelcomMessage prop
   */
  custom_welcome_message?: boolean
  customWelcomeMessage?: string
}

const Home: React.FC<Props> = props => {
  const customWelcomeEnabled = props.custom_welcome_message
  return (
    <div>
      <h1>Home Page</h1>
      <p>The normal welcome message</p>
      {customWelcomeEnabled && props.customWelcomeMessage && <p>{props.customWelcomeMessage}</p>}
    </div>
  )
}

export default withFeatureFlags(['custom_welcome_message'], Home)
```

## Using render props

Another alternative is to use the `FeatureFlag` component which accepts two required props:

| Prop Name  | Required | Type                                 | Description     |
| ---------- | -------- | ------------------------------------ | --------------- |
| `feature`  | Y        | string                               | key of feature  |
| `children` | Y        | function(boolean) => React.Component | render function |

```tsx
// ./pages/Home.tsx
import * as React from 'react'
import { FeatureFlag } from '@repay/cactus-fwk'

interface Props {
  customWelcomeMessage?: string
}

const Home: React.FC<Props> = props => (
  <div>
    <h1>Home Page</h1>
    <p>The normal welcome message</p>
    <FeatureFlag feature="custom_welcome_message">
      {featureEnabled =>
        featureEnabled && props.customWelcomeMessage ? <p>{props.customWelcomeMessage}</p> : null
      }
    </FeatureFlag>
  </div>
)

export default Home
```

An advatage of this method is that you get to customize the name of the enabled flag so you avoid prop name collisions like in the higher order component, and you can also avoid re-rendering the entire component which would happen when using the hook. However, many people find this less readable so we provide all the options.
