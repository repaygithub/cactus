---
title: API Docs
order: -100
---

# Cactus Web API Documentation

Each component discussed here should be a child of the `ThemeProvider` component provided by [styled-components](https://www.npmjs.com/package/styled-components). If you are not familiar with `ThemeProvider` or how it should be used, check out their documentation and our examples in [@repay/cactus-theme](../Theme/README.md).

## Common Aspects

There are some common ideas that can be seen in several places throughout this documentation, so before we dive into each component and how they're used, we should go over those concepts.

### Spacing

Almost all components will accept the [Styled System](https://styled-system.com/api#space) based margin props and the theme adheres to the `theme.space` specification allowing the values to be referened by indicies. e.g. `<Box my={4} />` would apply vertical margins equal to the 4 index in the space array.

The spaces are defined as `[0, 2, 4, 8, 16, 24, 32, 40]`, this may change, but it will not change the index values you use.

- `0` (`=0px`) can reset default values as needed
- `1` (`=2px`) is only used in special cases
- `2` (`=4px`) defines horizonal spacing between elements such as inline buttons
- `3` (`=8px`) vertical spacing between content of the same hierarchy (e.g. form elements and paragraphs)
- `4` (`=16px`) vertical spacing for a single hierarchy change such as between title and content to different form groups
- `5`, `6`, `7` are used to further indicate hierarchy or context changes

Additional information about how to use space can be found in the [Shared Styles](https://repaygithub.github.io/cactus/design-system/shared-styles/) section of the Cactus Design System.

### Variants

You will see that components in this library typically support multiple variants per one component. A variant is a variation of a component and it will fall into one of these two categories:

1. Standard - This variant is the basic version of a component and should be used in most places. These are referred to as "standard" variants through component props and will typically be the default, if no other variant is specified.
2. Call to Action - The CTA variant will use different, more notable colors and is designed to draw a user's attention for them to complete some action. These are generally referred to as "action" variants through the use of props.

### Inverse Components

Inverse props are a _work in progress_ and should not be used in production currently as they may break unexpectedly.

Most of the time, a theme will make use of a lighter base color, and components placed on that background will be easily visible, however, if the base color is dark, it will be necessary to use the inverse colors for a component so that it is easy to see. The inverse components flip the colors used in their standard counterpart which will provide more contrast, making them easier to see.

## Next Steps

You can find individual component documentation in the side navigation.

For a detailed and working example using both `@repay/cactus-web` components and `@repay/cactus-theme`, see the [theme-components example](../../examples/theme-components).
