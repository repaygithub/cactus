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

## Examples

- [Standard Example](./examples/standard/) - generic implementations of features as a basic web app.
- [Theme Components](./examples/theme-components) - exploration of using the components more in depth than the standard.

## Installation

You can install the packages from this repository using any node based package manager that pulls from the [NPM](https://www.npmjs.com/) repository.

```
yarn add --dev @repay/cactus-fwk
# OR
npm install --save-dev @repay/cactus-fwk
```

## Contributing

You will need to install [Node.js](https://nodejs.org/en/) runtime and [Yarn](https://yarnpkg.com/en/docs/install) for package management. Next clone the repository and install the dependencies.

```
yarn install
```

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
yarn release [module] [new version]
```

Where you can optionally provide the module `[module]` and the version `[new version]` to publish. If you don't provide these values you will be prompted for them instead. The `module` parameter accepts the package name, folder, or short codes listed above. The `new version` parameter accepts any semver value execpt pre-releases since pre-releases are expected to be used rarely and without a changelog at this point.
