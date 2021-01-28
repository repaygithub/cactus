# Responsive Web Design

In this tutorial, we will begin by generating a new front end application using `@repay/create-ui`. Then, we will continue by implementing a new route, as well as a responsive page to display favorite foods & drinks using `Grid` from `@repay/cactus-web`.

## Install the CLI

Install the `@repay/create-ui` CLI by running `yarn global add @repay/create-ui` or `npm add -g @repay/create-ui` in your terminal.

## Generate an Application

Run the following command in your terminal to generate a new application called MyApp.

`create-repay-ui MyApp --javascript`

The CLI will ask you if you want to create a git repository. For the sake of this tutorial, you may select not to.

## Run the App

Navigate into the `MyApp` folder, and run `yarn start`.

This will start the project in watch mode. Now, open your browser and point it to `https://localhost:3435/`. You should see a basic web application.

## Add a Route

The first step to creating a new route is to create a new component to render at the route. Create a new file in the `components` folder called `Favorites.jsx` and paste the following snippet:

```jsx
// Favorites.jsx
import React from 'react'

const Favorites = () => (
  <div style={{ padding: '16px' }}>
    <h1>Favorites</h1>
  </div>
)

export default Favorites
```

At this time, we are simply rendering a `<div />` with some padding and a page header, but we'll add on to this later. For now, leave that as-is and open up the `src/App.jsx` file. This is where we will add our route.

Start by creating a lazy version of the component using React's `lazy` function:

`const LazyFavorites = lazy(() => import('./components/Favorites'))`

The `lazy` function helps improve performance in a React application by loading components _only_ when they're needed instead of all of the time. For more info on the `lazy` function, see the [React docs](https://reactjs.org/docs/code-splitting.html#reactlazy).

Now that we have our lazy component defined, we're ready to add a new route using React Router. Add the following snippet as a child of `<Switch />` in `App.jsx`, before the Home route:

```jsx
<Route path="/responsive-page">
  <LazyFavorites />
</Route>
```

The `App.jsx` file should look something like this when this step is complete:

```jsx
// App.jsx
import { Spinner, StyleProvider } from '@repay/cactus-web'
import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import AppLayout from './components/AppLayout'

const LazyHome = lazy(() => import('./components/Home'))
const LazyUsers = lazy(() => import('./components/Users'))
const LazyFavorites = lazy(() => import('./components/Favorites'))

const App = () => (
  <StyleProvider global>
    <Router>
      <AppLayout>
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Route path="/users">
              <LazyUsers />
            </Route>
            <Route path="/favorites">
              <LazyFavorites />
            </Route>
            <Route path="/">
              <LazyHome />
            </Route>
          </Switch>
        </Suspense>
      </AppLayout>
    </Router>
  </StyleProvider>
)

export default App
```

## Connect the Route to a Link

Now we have a new route configured, but we have no way to reach it without modifying the URL. To make the page easily accessible, let's add a new link to the `MenuBar`.

Open the `AppLayout.jsx` file in your text editor and add the following snippet as the last child of `<MenuBar />`:

```jsx
<MenuBar.Item as={Link} to="/favorites">
  Favorites
</MenuBar.Item>
```

Now, return to your browser. Notice that there's a new item called "Favorites" in the navigation menu. Click on that, and you should now see the header rendered in the `Favorites` component.

## Implement a Responsive Design

We've generated a new application and added a route to our favorites page. Now the only thing left to do is list our favorite foods and drinks using a responsive design. To do this, we'll use the `Grid` component from `@repay/cactus-web`. The Grid component is based on a 12 column system. The API allows you to specify how many of those 12 columns each Grid Item should occupy at different screen sizes. For a more detailed explanation of the `Grid` component, see the [docs](https://repaygithub.github.io/cactus/components/grid/).

Let's open back up the `Favorites.jsx` file and import a couple of components from cactus:

`import { Card, Grid } from '@repay/cactus-web'`

Now, we'll render a couple of cards listing favorite foods & drinks using the `Grid` layout. Paste the following snippet just below the `<h1 />` tag in `Favorites.jsx`:

```jsx
<Grid>
  <Grid.Item tiny={12} medium={6}>
    <Card>
      Favorite Foods:
      <ol>
        <li>Tacos</li>
        <li>Pizza</li>
        <li>Spaghetti</li>
      </ol>
    </Card>
  </Grid.Item>
  <Grid.Item tiny={12} medium={6}>
    <Card>
      Favorite Drinks:
      <ol>
        <li>Water</li>
        <li>Lemonade</li>
        <li>Soda</li>
      </ol>
    </Card>
  </Grid.Item>
</Grid>
```

Notice the props we're passing to `Grid.Item` here. This is telling each grid item to occupy all 12 available columns at tiny & small screen sizes, but only 6 of the 12 columns for medium & larger screens. Open up your browser to see how it looks. You should see two cards rendered below the header, each taking up half of the page. Experiment with shrinking your browser window. If you shrink the browser's width, the cards should rearrange themselves so that they now render one on top of the other. What you're seeing is the `Grid` in action; when the screen's width shrinks below the small/tiny threshold, the grid items switch so that they occupy all 12 columns instead of 6, resulting in the stacked card view.

## Wrap Up

This concludes the responsive web design tutorial.

In this tutorial, we've learned how to:
- generate a new UI application using `@repay/create-ui`
- add a new route using React Router and hook it up to a link in the `MenuBar`.
- use the `Grid` component to implement a responsive page design

It's important to consider website responsiveness as more and more users are turning to their smartphones and tablets to browse the web. A user's experience should be no more difficult when using a mobile device than it is using a desktop. Elements within a given page should be laid out differently on mobile to account for the limited screen space in order to give your users the best possible experience.

After this tutorial, you should be better equipped to tackle the web responsiveness problem by using `Grid`, but this is just the start. There are more tools that `@repay/cactus-web` offers to help with responsive web design, including things like the [ScreenSizeProvider](https://repaygithub.github.io/cactus/components/screensizeprovider/) as well as a variety of reusable components designed to be responsive. Please consider looking through our [documentation site](https://repaygithub.github.io/cactus/) for more information on the Cactus design system and all of the tools we offer.