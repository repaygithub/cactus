# Cactus Design System and Framework

![](https://github.com/repaygithub/cactus/workflows/CI%20Pipeline/badge.svg)

An application framework and design system built in React at [REPAY](https://github.com/repaygithub).

### [View the published documentation](https://repaygithub.github.io/cactus/).

## Modules

- [`@repay/cactus-fwk`](./modules/cactus-fwk/) - Cactus Framework
- [`@repay/cactus-i18n`](./modules/cactus-i18n/) - Cactus I18n library
- [`@repay/cactus-icons`](./modules/cactus-icons/) - Cactus Icons
- [`@repay/cactus-theme`](./modules/cactus-theme/) - Cactus UI Theme
- [`@repay/cactus-web`](./modules/cactus-web/) - Cactus Web UI Components

## Example Apps

- [Standard Example](./examples/standard/) - Generic implementations of features as a basic web app.
- [Theme Components](./examples/theme-components) - Exploration of using the components more in depth than the standard.
- [Mock EBPP](./examples/mock-ebpp) - A more fully-featured web app mocking out some features from EBPP.

### Running Example Apps

Each of the example apps listed above can be run locally to play around with yourself. To run any example app, follow these steps:

1. Make sure all necessary dependencies are installed by running `yarn install` at the root of this repository.
2. Make sure each module is built by running `yarn build` at the root of this repository.
3. Navigate to any example app you wish to run. Ex: `cd examples/mock-ebpp`
4. Run `yarn start`
5. After the application builds, you can copy/paste the url from your terminal into your browser to view it.

## Installation

You can install the packages from this repository using any node based package manager that pulls from the [NPM](https://www.npmjs.com/) repository.

```
yarn add --dev @repay/cactus-fwk
# OR
npm install --save-dev @repay/cactus-fwk
```

## Contributing

**Before contributing, please read our [guidelines for contributing](./CONTRIBUTING.md)**

You will need to install [Node.js](https://nodejs.org/en/) runtime and [Yarn](https://yarnpkg.com/en/docs/install) for package management. Next clone the repository and install the dependencies. **Be sure to do this from the repository root.**

```
yarn install
```

Next we should build all the modules locally by running the following command in the terminal:

```
yarn build
```

Now you are ready to start developing on the modules, examples, or documentation website.

We use [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) to help manage the dependencies for the monorepository; however, this also means you should initiate commands on individual modules from the root directory. We've added some aliases in the base package.json to ease the typing burden. `yarn w` is equivalent to `yarn workspace` and `yarn ws` is equivalent to `yarn workspaces`

```
yarn w @repay/cactus-i18n tdd # will run tests in watch mode for Cactus I18n
```

We also added a shortcut for Cactus I18n directly:

```
yarn i18n tdd
```

Similar shortcuts are available for all published modules:

- `yarn i18n` => `yarn workspace @repay/cactus-i18n`
- `yarn icons` => `yarn workspace @repay/cactus-icons`
- `yarn fwk` => `yarn workspace @repay/cactus-fwk`
- `yarn theme` => `yarn workspace @repay/cactus-theme`
- `yarn web` => `yarn workspace @repay/cactus-web`

### Commands

> replace \<lib> in the following examples with the shortcut codes listed above.

#### start

The start command will run a website such as in the examples or Storybook for UI based libraries. Not all repositories have an interactive implementation so they do not all have a start command. In cases of no `start` command, use the example applications for implementation practice and testing; the modules are automatically linked from Yarn Workspaces.

#### dev

Builds the specified library in watch mode and will rebuild on changes.

```
yarn <lib> dev
```

```
yarn <lib> start
```

#### tdd

Runs the given library's Jest based tests in watch mode to help with writing tests and test driven development as desired.

```
yarn <lib> tdd
```

#### test

Runs the given library's tests and checks the TypeScript types.

```
yarn <lib> test
```

#### test:ci

Runs the given libraries tests with coverage and checks the TypeScript types.

_\*Required in all libraries and examples, even if there are no Jest tests (though there should at least be TypeScript validations)_

```
yarn <lib> test:ci
```

#### test:types

Only validates the TypeScript types for the given library.

```
yarn <lib> test:types
```

#### cleanup

Removes built files and folders from previous builds.

```
yarn <lib> cleanup
```

#### build

Creates a production build of the given library and builds the TS definition files.

_\*Required in all libraries, but not examples._

```
yarn <lib> build
```

#### build:types

Only builds the TypeScript definition files.

```
yarn <lib> build:types
```

### Publishing a release

To publish a release, open Terminal or command prompt and call:

```bash
yarn release
```

This command will install all dependencies, build packages, and then call [Lerna](https://lerna.js.org/) to handle the release process. Lerna will automatically determine which packages have changed and will prompt you for the type of version bump (major/minor/patch). It will then publish the updated packages, create commits with `package.json` changes, and create git tags.

We also have a `yarn release:beta` command that will do roughly the same thing, but will pass additional options to Lerna that are needed for beta versions/pre-releases.

### Integration Testing

We have developed three [example apps](/examples/) that double as vehicles to run integrations tests.
We use [TestCafe](https://devexpress.github.io/testcafe/) along with the
[TestCafe BrowserStack Plugin](https://www.npmjs.com/package/testcafe-browser-provider-browserstack)
to run integration tests against these applications on both Chrome and IE11. While not everything
needs an integration test, we should try to keep the coverage relatively high so that we can automatically
catch cross-browser issues.

To run integration tests locally, first create a `local.env` file in the folder of the app for which
you want to run tests (i.e. `standard` or `mock-ebpp`). In that file, you'll need to add:

```
BROWSERSTACK_USERNAME=<SOMETHING>
BROWSERSTACK_ACCESS_KEY=<SOMETHING ELSE>
```

To obtain the actual value of those secrets, you can get in touch with a member of the UI team, who
will send them to you via onetimesecret.

```bash
yarn w <app-name...i.e. mock-ebpp> test -b "Chrome -incognito"
```

## StoryBook

Storybook is an open-source tool that helps with the development of isolated UI components. With Storybook you will browse a library component, run each of those components in a private environment and explore them in different states. We implemented Storybook for two of our libraries [repay/cactus-icons](https://repaygithub.github.io/cactus/stories/cactus-icons/?path=/story/icons--all) and [@repay/cactus-web](https://repaygithub.github.io/cactus/stories/cactus-web/).

In a Storybook application, all the content is being organized on two basic levels, the components, and their child stories; each story is a kind of a permutation of their parent component and each component could have as many stories as needed. The main story that every component should have along our libraries is the `Basic usage` and have to show a simple implementation of the selected component, next to `basic usage` you can include the rest of the variations of the component, those variations could be related with a ton of different aspects, like the content, the size, the children that the component supports, or any other prop defined that modifies the component’s performance.

In addition to the creation of stories from specific components, we keep a track of the snapshots of every component for testing purposes, this helps us catch bugs in UI appearance. Every time that a component or a component's story is modified or created, a screenshot of the story will be created or updated and compared with the last commit to identify any possible changes.

### `Cactus-web` Stories

Every story has the `canvas` and the `docs` sections. On `canvas` section you’ll find the component running with the main props that you set for this specific permutation. Below the frame where the component is running, there are three addons: `Knobs`, `Cactus Theme`, and `Actions`.

#### Cactus Theme 
The **Cactus Theme** add-on allows you to play with a set of global parameters that modify the component appearance, such as the theme colors, the border width, component shape, the text’s font, and others. It allows us to make our components more customizable by the users. 

#### Actions
The Actions add-on logs the events triggered by the user, such as onClick, onFocus, or onBlur.

#### Knobs

The [knobs](https://www.npmjs.com/package/@storybook/addon-knobs) are controls that allow the user to control and edit the component’s props dynamically, exploring the component behavior. These are the knobs that are available: 

- **`Text`:** To get a text from the user.
- **`Boolean`:** To get a boolean value from the user.
- **`Number`:** To get a number from the user.
- **`Select`:** To get a value from a list of options. 
- **`Radios`:** To get a value from a list of radio buttons.

[More info here.](https://github.com/storybookjs/storybook/tree/master/addons/knobs#available-knobs)

The knobs must have been created to give the user access to the different props of a component. For example, a button component that includes a `variant` prop with a list of variants like *standard*, *action*, *danger*, *warning* and *success*, those variants must be accessible and controllable from the Knobs section of the button's story.

These are other use-cases where you must set up a knob for a prop from the parent component:
- To Modify text from labels, inputs, textareas, headers and/or other contents.
- To enable or disable user's actions like clicks. 
- To change a specific CSS property like `justify-content`, `align-items`, `flex-direction`, `width`, `height`
- To hide or show a specific component from the story. 

Knobs are a powerful way to explore the component behavior through their properties. However, there are specific cases where is more convenient to show those behaviors by splitting them into different stories. The main story that you must include is the components `Basic usage`, it is not necessary to include all the knobs per prop into that main story, is there when you can decide when to make a knob for a prop or when to make a new different story to show a specific behavior, there are some cases that you would consider at the moment of being choosing between a knob or a new story; if the component has different variants, (such standard, warning, success), a better choice could be to create a new story showing all the variants on the same canvas, so the user could compare them. Another case where you must consider creating a new story is if the props modifies the component by making significant changes to its appearance, or if the component has specific optional functionalities or integrations with other small components like buttons or icons. 

##### Usage
Every story’s file must be created on the root of their main component with the extension `.story.tsx`. All of the components exported from that story file will be rendered as individual stories from the same component in the Storybook application. Here is a simple demonstration of how it works

First you need to import the `Meta` type that configures the stories for a component, the `React` library and the main component
```javascript
    //FooComponent.story.tsx
    import { Meta } from '@storybook/react/types-6-0'
    import React from 'react'

    import FooComponent from './FooComponent'
```

Then, export by default the name of the story an the component it belongs to.
```javascript
    export default {
        name: 'FooComponent',
        component: FooComponent,
    } as Meta
``` 

Alright, let's create the first default story for the `FooComponent`.
```javascript
    export const FooStory = () => {
        return <FooComponent label='Label title' disabled={false} /> 
    }
```
That function is rendering the `FooComponent` with two props, a label text and a boolean value that enables or disables a specific functionality of the `FooComponent`. Those values must be been controlled by the Storybook user, so we can create a knob to manipulate those props from the Storybook application. 

```javascript
    //...
    import { boolean, text } from '@storybook/addon-knobs'

    export const FooStory = () => {
        return <FooComponent 
            label={text('label', 'This is a knob')} 
            disabled={boolean('disabled', false)} 
        /> 
    }
```
First, we need to import the required Knobs from the library `'@storybook/addon-knobs'`. That's how we export a story called `FooStory` that is rendering a component and controlling the `label` and `disabled` props with text and boolean knobs respectively. 

```javascript 
    //FooComponent.story.tsx
    import { Meta } from '@storybook/react/types-6-0'
    import React from 'react'

    import FooComponent from './FooComponent'

    import { boolean, text } from '@storybook/addon-knobs'

    export default {
        name: 'FooComponent',
        component: FooComponent,
    } as Meta

    export const FooStory = () => {
        return <FooComponent 
            label={text('label', 'This is a knob')} 
            disabled={boolean('disabled', false)} 
        /> 
    }
```
