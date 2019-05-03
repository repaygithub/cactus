---
title: API Docs
---

# Cactus Web API Documentation

Each component discussed here should be a child of the `ThemeProvider` component provided by [styled-components](https://www.npmjs.com/package/styled-components). If you are not familiar with `ThemeProvider` or how it should be used, check out their documentation and our examples in [@repay/cactus-theme](../Theme/README.md).

## Table of Contents

- [Common Aspects](#Common-Aspects)
  - [Variants](#Variants)
  - [Inverse Components](#Inverse-Components)

## Common Aspects

There are some common ideas that can be seen in several places throughout this documentation, so before we dive into each component and how they're used, we should go over those concepts.

### Variants

You will see that components in this library typically support multiple variants per one component. A variant is a variation of a component and it will fall into one of these two categories:

1. Standard - This variant is the basic version of a component and should be used in most places. These are referred to as "standard" variants through component props and will typically be the default, if no other variant is specified.
2. Call to Action - The CTA variant will use different, more notable colors and is designed to draw a user's attention for them to complete some action. These are generally referred to as "action" variants through the use of props.

### Inverse Components

Most of the time, a theme will make use of a lighter base color, and components placed on that background will be easily visible, however, if the base color is dark, it will be necessary to use the inverse colors for a component so that it is easy to see. The inverse components flip the colors used in their standard counterpart which will provide more contrast, making them easier to see.

## Next Steps

For a detailed and working example using both `@repay/cactus-web` components and `@repay/cactus-theme`, go [here](../../examples/theme-components).
