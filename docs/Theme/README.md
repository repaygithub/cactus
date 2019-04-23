---
order: 2
---

# Cactus Theme

The `@repay/cactus-theme` library exports a theme generator which will create a theme that can be used with the `ThemeProvider` component to share that theme with each child component within it.

## Quick Links

- [Source Code](../../modules/cactus-theme/)

## ThemeProvider

The [styled-components](https://www.npmjs.com/package/styled-components) package created the `ThemeProvider` component, and we recommend that you check their documentation out for even more clarity.

## Usage

The `@repay/cactus-theme` library exports a theme generator function, and a default theme.

### Default Theme

The default theme that is exported is REPAY's theme and can be used out of the box.

#### Example

```jsx
import cactusTheme from '@repay/cactus-theme'
...
<ThemeProvider theme={cactusTheme}>
  ...
</ThemeProvider>
```

### generateTheme

The `generateTheme()` function accepts an options object containing a primary hue, which is used to generate the rest of the theme and the color scheme. If you don't provide an options object, the function will default to the REPAY theme. The options object should be structured as follows:

| Attr         | Type    | Required | Description                                                                                     |
| ------------ | ------- | -------- | ----------------------------------------------------------------------------------------------- |
| `primaryHue` | Integer | Y        | A value for the hue of the color scheme. This will determine the colors available in the theme. |

#### Example

```jsx
import { generateTheme } from '@repay/cactus-theme'
const myTheme = generateTheme({ primaryHue: 150 })
<ThemeProvider theme={myTheme}>
  ...
</ThemeProvider>
```

## Next Steps

Seems pretty easy, right? Well, we can't stop here. To see how you can use the components available in `@repay/cactus-web` in conjunction with the theming principles we just went over in order to create a consistent and great looking front end application, click [here](../Components/README.md)
