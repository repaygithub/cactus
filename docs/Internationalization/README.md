---
title: Cactus i18n
order: 8
---

# Internationalization

The Cactus I18n library implements i18n using the core technologies developed by Mozilla and [Project Fluent](https://projectfluent.org/). We chose Fluent because of it's design principles, features, and extensibility. We use these tools to provide our own API that can be used to implement internationalization easily.

## Quick Links

- [Fluent Syntax](/internationalization/fluent-syntax/)
- [Getting Started](/internationalization/getting-started/)
- [API Documentation](/internationalization/api-documentation/)
- [Why Project Fluent?](/internationalization/project-fluent/)
- [Source Code](../../modules/cactus-i18n/)

## Fluent Syntax

Because we make use of Fluent's tools to make internationalization possible, our API uses translations written using the Fluent ftl syntax. You can find a small example of some features of Fluent's syntax [here](./Fluent%20Syntax.md).

## Getting Started

Getting started with the internationalization tools that are available with the Cactus Framework is easy, and we have a quick guide for setting up a project to achieve internationalization, along with a working example to check out. To find out more about what you need to do to get started, go [here](./Getting%20Started.md).

1. Install this library

```bash
yarn add @repay/cactus-i18n
```

2. Add transpiling to the Fluent packages for cross-browser support

```js
// webpack.config.js
module.exports = {
  // ... other config definitions
  module: {
    rules: [
      // add this rule
      {
        test: /@fluent.*\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            // babel config / presets
          },
        },
      },
    ],
  },
}
```

## API Documentation

We have detailed documentation on each of the classes, functions and components you'll need to integrate internationalization into your application [here](./API%20Documentation.md).

## Why Project Fluent?

If you are interested in learning more about why we chose to use Project Fluent over other similar i18n tools, check [this](./Project%20Fluent.md) out.
