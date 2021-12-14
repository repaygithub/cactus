---
order: 3
---

# Cactus Theme

The `@repay/cactus-theme` library exports a theme generator which will create a theme that can be used with the `ThemeProvider` component to share that theme with each child component within it.

## Quick Links

- [Source Code](../../modules/cactus-theme/)

## ThemeProvider

The [styled-components](https://www.npmjs.com/package/styled-components) package created the `ThemeProvider` component, and we recommend that you check their documentation out for even more clarity.

### Style Helpers

We also provide a number of useful functions for reducing boilerplate in `styled-components`: see <a href="./style-helpers/#">the style helpers documentation</a> for a full list.

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

The `generateTheme()` function accepts an options object containing either a primary hue or a primary color, which is then used to generate the rest of the theme and the color scheme. If you don't provide an options object, the function will default to the REPAY theme. The options object should be structured as one of the following:

| Attr         | Type    | Required | Description                                                                                     |
| ------------ | ------- | -------- | ----------------------------------------------------------------------------------------------- |
| `primaryHue` | Integer | Y        | A value for the hue of the color scheme. This will determine the colors available in the theme. |

| Attr        | Type           | Required | Description                                                                                             |
| ----------- | -------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `primary`   | hexcode string | Y        | A hexcode color to define the main "base" color. This will determine the colors available in the theme. |
| `secondary` | hexcode string | N        | A hexcode color to define the "action" color.                                                           |

If only a `primary` color is provided or the secondary color is white, the theme will be entirely based on the one color. If the primary color is black, there is a special "black" theme which provides a blue "action" color.

Whether you generate a theme using a primary hue or with primary and secondary hex values, there are several other optional keys you can set in the options object:

| Attr                | Type                                       | Required | Description                                                                        |
| ------------------- | ------------------------------------------ | -------- | ---------------------------------------------------------------------------------- |
| `border`            | `thin` \| `thick`                          | N        | Specifies theme border thickness. Thin is 1px and thick is 2px. Default is thin.   |
| `shape`             | `round` \| `intermediate` \| `square`      | N        | Specifies general component shape. Default is intermediate.                        |
| `font`              | `Helvetica Neue` \| `Helvetica` \| `Arial` | N        | Defines application font. Default is Helvetica.                                    |
| `boxShadows`        | Boolean                                    | N        | Enabled/disables box shadows on cactus-web components. Enabled by default.         |
| `grayscaleContrast` | Boolean                                    | N        | Enables/disables usage of grayscale colors for lightContrast. Disabled by default. |
| `breakpoints`       | Object shape defined below                 | N        | Define custom breakpoints for your application.                                    |

The `breakpoints` option should have the following form:

| Attr        | Type         | Required | Description                                                                  |
| ----------- | ------------ | -------- | ---------------------------------------------------------------------------- |
| `small`     | Pixel string | Y        | The breakpoint between tiny and small screen sizes. Default is 768px.        |
| `medium`    | Pixel string | Y        | The breakpoint between small and medium screen sizes. Default is 1024px.     |
| `large`     | Pixel string | Y        | The breakpoint between medium and large screen sizes. Default is 1200px.     |
| `extraLarge`| Pixel string | Y        | The breakpoint between large and extraLarge screen sizes. Default is 1440px. |

#### Example using primary hue

```jsx
import { generateTheme } from '@repay/cactus-theme'
import { StyleProvider } from '@repay/cactus-web'
const myTheme = generateTheme({ primaryHue: 150 })

export default () => (
  <StyleProvider theme={myTheme}>
    {*/ elements rendered here /*}
  </StyleProvider>
)
```

#### Example using hexcode colors

```jsx
import { generateTheme } from '@repay/cactus-theme'
import { StyleProvider } from '@repay/cactus-web'
const myTheme = generateTheme({ primary: '#133337', secondary: '#cca398' })

export default () => (
  <StyleProvider theme={myTheme}>
    {*/ elements rendered here /*}
  </StyleProvider>
)
```

## Next Steps

Seems pretty easy, right? Well, we can't stop here. To see how you can use the components available in `@repay/cactus-web` in conjunction with the theming principles we just went over in order to create a consistent and great looking front end application, click <a to='/components'>here</a>
