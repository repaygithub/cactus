---
title: Cactus i18n
order: 9
---

# Internationalization

The Cactus I18n library implements i18n using the core technologies developed by Mozilla and [Project Fluent](https://projectfluent.org/). We chose Fluent because of it's design principles, features, and extensibility. We use these tools to provide our own API that can be used to implement internationalization easily.

## Quick Links

- <a to='./fluent-syntax'>Fluent Syntax</a>
- <a to='./getting-started'>Getting Started</a>
- <a to='./api-documentation'>API Documentation</a>
- <a to='./project-fluent'>Why Project Fluent?</a>
- [Source Code](../../modules/cactus-i18n/)

## Fluent Syntax

Because we make use of Fluent's tools to make internationalization possible, our API uses translations written using the Fluent ftl syntax. You can find a small example of some features of Fluent's syntax <a to='./fluent-syntax'>here</a>.

## Getting Started

Getting started with the internationalization tools that are available with the Cactus Framework is easy, and we have a quick guide for setting up a project to achieve internationalization, along with a working example to check out. To find out more about what you need to do to get started, go <a to='./getting-started'>here</a>.

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

We have detailed documentation on each of the classes, functions and components you'll need to integrate internationalization into your application <a to='./api-documentation'>here</a>.

## Why Project Fluent?

If you are interested in learning more about why we chose to use Project Fluent over other similar i18n tools, check <a to='./project-fluent'>this</a> out.
