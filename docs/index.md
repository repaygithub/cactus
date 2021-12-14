# UI Design System, Tooling and Framework

An application framework and design system built in React at [REPAY](https://github.com/repaygithub).

## Design System

The Cactus Design System is built to aid designers and developers to make decisions in layout and component usage in applications. The goal is to create better applications by making clear, consistent, intuitive, and reusable patterns. These patterns are then turned into distributable modules for developers to use directly.

## Repositories and Packages

The UI Team manages several different mono-repos to assist developers in creating and managing clean, unified user interfaces:

- [`cactus`](https://github.com/repaygithub/cactus)

    The Cactus repository houses React packages for our framework, theming, internationalization and component libraries. All of the packages in this repo are public and open-source. We also publish our own [documentation site](https://repaygithub.github.io/cactus/) for developer-specific documentation on each of the packages listed below:

    - [`@repay/cactus-fwk`](https://repaygithub.github.io/cactus/framework/) - Cactus Framework
    - [`@repay/cactus-theme`](https://repaygithub.github.io/cactus/theme/) - Cactus UI Theme Generator & Theme Helpers
    - [`@repay/cactus-web`](https://repaygithub.github.io/cactus/components/) - Cactus Web UI Components
    - [`@repay/cactus-icons`](https://repaygithub.github.io/cactus/icons/) - Cactus Icons
    - [`@repay/cactus-i18n`](https://repaygithub.github.io/cactus/internationalization/) - Cactus Internationalization Library

    The Cactus repo also includes a few example applications that showcase some usage for the packages above:

    - [Standard Example](https://github.com/repaygithub/cactus/tree/master/examples/standard) - Generic implementation of some use-cases, including internationalization
    - [Theme Components](https://github.com/repaygithub/cactus/tree/master/examples/theme-components) - Example usage of the `@repay/cactus-web` module with a theme
    - [Mock Web Application](https://github.com/repaygithub/cactus/tree/master/examples/mock-ebpp) - A mock web application containing functionality which are common in Repay products

- [`ui-tools`](https://github.com/repaygithub/ui-tools)

    The UI Tools repository contains packages that help with configuring, building/running, and testing front end applications:

    - [@repay/babel-preset](https://github.com/repaygithub/ui-tools/tree/master/modules/babel-preset) - A plug-and-play Babel preset you can add to your Babel config
    - [@repay/eslint-config](https://github.com/repaygithub/ui-tools/tree/master/modules/eslint-config) - An eslint configuration you can easily extend from to enable either JavaScript or TypeScript linting
    - [@repay/scripts](https://github.com/repaygithub/ui-tools/tree/master/modules/repay-scripts) - A CLI tool used for building and running front end apps & libraries
    - [@repay/testing-tools](https://github.com/repaygithub/ui-tools/tree/master/modules/testing-tools) - CLI and helper functions for running and timing tests

- [`ui-private`](https://github.com/repaygithub/ui-private)

    As the name implies, this is a private collection of packages that involve business logic, authentication, or things that should generally be kept under wraps. Access to this repository is somewhat restricted, so you may need to ask a member of the UI team to grant you access if you need it. These packages are published to the REPAY CodeArtifact registry as opposed to npm:

    - [`@repay/internal-create-ui`](https://github.com/repaygithub/ui-private/tree/master/modules/create-repay-ui) - A CLI tool to generate a new React application in either JavaScript or TypeScript, pre-configured with the tools in the cactus ecosystem
    - [`@repay/internal-components`](https://github.com/repaygithub/ui-private/tree/master/modules/internal-components) - A collection of components that we want to avoid exposing publicly in `cactus-web`
    - [`@repay/internal-auth-js`](https://github.com/repaygithub/ui-private/tree/master/modules/repay-auth-js) - A JavaScript package containing authentication and authorization helpers to easily integrate SSO into your app
    - [`@repay/internal-auth-react`](https://github.com/repaygithub/ui-private/tree/master/modules/repay-auth-react) - A package with some React components and hooks that utilizes the helpers from `repay-auth-js` to help integrate SSO into a React application
    - [`@repay/internal-release`](https://github.com/repaygithub/ui-private/tree/master/modules/repay-release) - A CLI tool to gather commits, update CHANGELOGs, and publish packages
