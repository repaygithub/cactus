# Component Library API Documentation

Each component discussed here should be a child of the `ThemeProvider` component provided by [styled-components](https://www.npmjs.com/package/styled-components). If you are not familiar with `ThemeProvider` or how it should be used, check out their documentation and our examples in [@repay/cactus-theme](../Theme/README.md).

## Table of Contents

- [Common Aspects](#Common-Aspects)
  - [Variants](#Variants)
  - [Inverse Components](#Inverse-Components)
- [Buttons](#Buttons)
  - [Standard Button](#Button)
  - [Text Button](#TextButton)
  - [Icon Button](#IconButton)
  - [Text+Icon Button](#Text+Icon-Button)

## Common Aspects

There are some common ideas that can be seen in several places throughout this documentation, so before we dive into each component and how they're used, we should go over those concepts.

### Variants

You will see that components in this library typically support multiple variants per one component. A variant is a variation of a component and it will fall into one of these two categories:

1. Standard - This variant is the basic version of a component and should be used in most places. These are referred to as "standard" variants through component props and will typically be the default, if no other variant is specified.
2. Call to Action - The CTA variant will use different, more notable colors and is designed to draw a user's attention for them to complete some action. These are generally referred to as "action" variants through the use of props.

### Inverse Components

Most of the time, a theme will make use of a lighter base color, and components placed on that background will be easily visible, however, if the base color is dark, it will be necessary to use the inverse colors for a component so that it is easy to see. The inverse components flip the colors used in their standard counterpart which will provide more contrast, making them easier to see.

## Buttons

There are several different buttons made available by the component library. Each has its own use case and intended usage. We'll discuss the buttons and how to use them in detail below.

### `Button`

This is the standard button. There's not much else to say here. It's a pretty basic button component.

#### Props

| Prop       | Type    | Required | Description                                                                                        | Default    |
| ---------- | ------- | -------- | -------------------------------------------------------------------------------------------------- | ---------- |
| `variant`  | String  | N        | The button variant that should be rendered. The available options include `standard` and `action`. | `standard` |
| `disabled` | Boolean | N        | Indicates whether the button should be disabled or not.                                            | `false`    |
| `inverse`  | Boolean | N        | Indicates whether the inverse styles should be used.                                               | `false`    |

#### Example Usage

```jsx
import { Button } from '@repay/cactus-web'
...
// Basic usage
<Button>
  Basic Button
</Button>

// Call to action variant
<Button variant="action">
  Take Some Action
</Button>

// Inverse
<Button inverse>
  Inversed
</Button>

// Disabled
<Button disabled>
  Disabled
</Button>
```

### `TextButton`

The `TextButton` is just what it sounds like; it's text, but it's a button!

#### Props

| Prop       | Type    | Required | Description                                                                                        | Default    |
| ---------- | ------- | -------- | -------------------------------------------------------------------------------------------------- | ---------- |
| `variant`  | String  | N        | The button variant that should be rendered. The available options include `standard` and `action`. | `standard` |
| `disabled` | Boolean | N        | Indicates whether the button should be disabled or not.                                            | `false`    |
| `inverse`  | Boolean | N        | Indicates whether the inverse styles should be used.                                               | `false`    |

#### Example Usage

```jsx
import { TextButton } from '@repay/cactus-web'
...
// Basic usage
<TextButton>
  Basic Text Button
</TextButton>

// Call to action variant
<TextButton variant="action">
  Take Some Action
</TextButton>

// Inverse
<TextButton inverse>
  Inversed Text Button
</TextButton>

// Disabled
<TextButton disabled>
  Disabled Text Button
</TextButton>
```

### `IconButton`

The `IconButton` is designed to turn a simple icon into a button. The way it's designed, it can be used with icons defined in [@repay/cactus-icons](../../modules/cactus-icons/README.md) or with icons taken from another library.

#### Props

| Prop       | Type    | Required | Description                                                                                        | Default       |
| ---------- | ------- | -------- | -------------------------------------------------------------------------------------------------- | ------------- |
| `iconSize` | String  | N        | The size of the icon. The available options include `tiny`, `small`, `medium`, and `large`.        | `medium`      |
| `variant`  | String  | N        | The button variant that should be rendered. The available options include `standard` and `action`. | `standard`    |
| `disabled` | Boolean | N        | Indicates whether the button should be disabled or not.                                            | `false`       |
| `label`    | String  | N        | A prop used for setting the `aria-label` attribute.                                                | None          |
| `display`  | String  | N        | A prop used to set the `display` attribute. Options include `flex` or `inline-flex`.               | `inline-flex` |
| `inverse`  | Boolean | N        | Indicates whether the inverse styles should be used.                                               | `false`       |

#### Example Usage

```jsx
import { IconButton } from '@repay/cactus-web'
import NavLeft from '@repay/cactus-icons/i/navigation-chevron-left'
...
// Basic usage
<IconButton>
  <NavLeft />
</IconButton>

// Call to action variant
<IconButton variant="action">
  <NavLeft />
</IconButton>

// Inverse
<IconButton inverse>
  <NavLeft />
</IconButton>

// Disabled
<IconButton disabled>
  <NavLeft />
</IconButton>
```

### Text+Icon Button

The Text+Icon buttons are essentially just a mixture of `TextButton` and an icon. Again, you can use an icon defined in [@repay/cactus-icons](../../modules/cactus-icons/README.md) or one taken from another icon library.

#### Props

Because this button just uses the [TextButton](#TextButton) component, the same props that are made available for that component are available here and function in the same way.

#### Example Usage

```jsx
import { TextButton } from '@repay/cactus-web'
import Add from '@repay/cactus-icons/i/actions-add'
...
// Basic usage
<TextButton>
  <NavLeft />
  Basic
</TextButton>

// Call to action variant
<TextButton variant="action">
  <NavLeft />
  Take Some Action
</TextButton>

// Inverse
<TextButton inverse>
  <NavLeft />
  Inverse
</TextButton>

// Disabled
<TextButton disabled>
  <NavLeft />
  Disabled
</TextButton>
```

## Next Steps

For a detailed and working example using both `@repay/cactus-web` components and `@repay/cactus-theme`, go [here](../../examples/theme-components).
