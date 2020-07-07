---
order: 1
---

# Cactus Framework

The Cactus Framework implements a set of common front-end necessities at a top level provided via React context. The framework attempts to have fewer top level provider components and implements hooks and higher-order components to access these data stores as needed.

## Quick Links

- [API Documentation](./API/README.md)
  - [Error Boundary](./API/Error%20Boundary.md)
  - [Feature Flags](./API/Feature%20Flags.md)
- [Source Code](../../modules/cactus-fwk/)

## Getting Started

Install via node based package manager

```
yarn add --dev @repay/cactus-fwk
```

Import the `AppRoot` component and use it near the top level of your application. Then provide your feature flag object

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
    fetchFeatureFlags().then((featuresData) => setFeatures(featuresData))
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

Use the provided context by importing the respective hooks or other utilities in the component which needs the data. In this case we import the `useFeatureFlag` hook.

```tsx
// ./pages/Home.tsx
import * as React from 'react'
import { useFeatureFlags } from '@repay/cactus-fwk'

interface Props {
  customWelcomeMessage?: string
}

const Home: React.FC<Props> = (props) => {
  const [customWelcomeEnabled] = useFeatureFlags('custom_welcome_message')

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

Next read the rest of the [API documentation](./API/README.md) or checkout out the [examples folder](../../examples/)
