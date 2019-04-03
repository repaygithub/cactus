# Cactus Framework and Design System

[![CircleCI](https://circleci.com/gh/repaygithub/cactus.svg?style=svg)](https://circleci.com/gh/repaygithub/cactus)

An application framework and design system built in React at [REPAY](https://github.com/repaygithub). View the WIP documentation on the published [Github pages](https://repaygithub.github.io/cactus/).

## Modules

- [`@repay/cactus-fwk`](./modules/cactus-fwk/) - Cactus Framework
- [`@repay/cactus-icons`](./modules/cactus-icons/) - Cactus Icons
- [`@repay/cactus-theme`](./modules/cactus-theme/) - Cactus UI Theme
- [`@repay/cactus-web`](./modules/cactus-web/) - Cactus Web UI Components

## Examples

- [Standard Example](./examples/standard/) - generic implementations of features

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
yarn w @repay/cactus-fwk tdd # will run tests in watch mode for Cactus Framework
```

We also added a shortcut for Cactus Framework directly:

```
yarn fwk tdd
```
