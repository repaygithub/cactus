---
title: Style Helpers
order: -99
---

# Style Helpers

Accessing theme properties from `styled-components` styles is not difficult, but can involve a lot of boilerplate; after the tenth time you write something like `${(p) => p.theme.space[3]}` you start to want to refactor. The helpers defined in `@repay/cactus-theme` can help reduce that boilerplate, as well as provide logical help around some of the less common properties (like `boxShadows`).

### Usage

All the helper functions (with the exception of `isResponsiveTouchDevice`) have two call modes. When called in "binding" mode you pass the normal arguments, and it returns a function that takes in theme props (an object with `theme` property) and returns the result. In the other call mode, you pass the theme props as the first argument, then the regular arguments, and it directly returns the results. These four are all the same:

```
const Sample = styled.div`
  margin: ${space(3)};
  margin: ${(p) => space(3)(p)};
  margin: ${(p) => space(p, 3)};
  margin: ${(p) => p.theme.space[3]}px;
`
```

Binding mode is the most common since it's concise and compatible with `styled-components`; the other mode mostly exists to make it possible to compose several helpers into a single function call.

## Space/Sizes

#### space
```
function space(index: number): '[number]px';
```

Indexes into the `theme.space` array, and returns the result as a pixel length (e.g '4px').

#### iconSize
```
function iconSize(size: keyof IconSizes): '[number]px;
```

Returns the value from the `theme.iconSizes` object as a pixel length.

#### fontSize
```
function fontSize(size: keyof FontSizes): 'font-size: [number]px;' | `
  font-size: [number]px;
  @media screen and (min-width: [medium breakpoint]) {
    font-size: [number]px;
  }
`;
```

Returns values from the `theme.fontSizes` & `theme.mobileFontSizes` objects. If the values are the same, returns a single property e.g. "font-size: 15px;". If the values are different, returns a CSS block with a media query.

#### textStyle
```
function textStyle(size: keyof TextStyles): {
  fontSize: '[number]px',
  lineHeight: [number],
} | `
  font-size: [number]px;
  line-height: [number];
  @media screen and (min-width: [medium breakpoint]) {
    font-size: [number]px;
    line-height: [number];
  }
`;
```

Returns values from the `theme.textStyles` & `theme.mobileTextStyles` objects. If the values are the same, returns the value (which is an object with keys `fontSize` & `lineHeight`). If the values are different, returns a CSS block with a media query.

## Colors

#### color
```
function color(colorName: keyof Colors): ColorValue;
```

Returns a value from the `theme.colors` object.

#### colorStyle
```
type ColorStyle = { color: ColorValue; backgroundColor: ColorValue }
function colorStyle(styleName: keyof ColorStyles): ColorStyle;
function colorStyle(foregroundColor: string, backgroundColor: string): ColorStyle;
```

This one can be used two ways. Called with a name from the `theme.colorStyles` object, it will return the value from the theme. Called with two arguments, it will return a custom style with the given colors: each color can either be a browser-recognized color value, or a name from the `theme.colors` object.

## Borders

#### borderSize
```
const BORDER_SIZE = { thin: '1px', thick: '2px' }
function borderSize(opts: { thin: unknown; thick: unknown } = BORDER_SIZE): unknown;
```

Returns a value from the opts argument depending on the `theme.border` setting. When called with no arguments, returns the default border thickness.

#### border
```
type Opts = { thin?: string; thick?: string }
function border(color: string, opts?: Opts): '[thickness] solid [color]';
```

Returns a CSS value appropriate for use with `border` or `outline` properties, e.g. "1px solid black". The _color_ can be any color string recognized by browsers, or the name of a color in `theme.colors`. Both keys in the _opts_ object are optional, so you can override just one of the border thicknesses if you want to use the default for the other.

#### radius
```
function radius(maxRadius: number, intermediateScaleFactor = 0.4): '[number]px';
```

Returns a radius scaled according to the `theme.shape` setting: for "square" the radius is always "0px" (scale factor 0), and for "round" it's the number you passed in (scale factor 1). In addition, the result of the scale operation is passed through `Math.ceil`, so calling `radius(8)` will do `Math.ceil(8*.4[=3.2])[=4]px`.

#### insetBorder
```
type Direction = 'top' | 'bottom' | 'left' | 'right'
type Opts = { thin?: string; thick?: string }
function insetBorder(color: string, dir?: Direction, opts?: Opts): 'box-shadow: inset [size] [color]';
```

Returns a `box-shadow` CSS property for a solid inset border. The _color_ and _opts_ arguments behave the same way they do in the regular `border` function. If a _direction_ is specified, the border will only appear on the specified side, otherwise it will be on all four sides.

Obviously this can't be used alongside a regular box shadow property, but inset borders are useful in situations where you want to add a visual border without affecting the layout (since a normal border takes up space between the margins and padding).

## Shadows

The REPAY style guide defines several box shadow "types", which are numbered 0-5. Though these are technically unrelated to either the theme or `styled-component`, they are often used in conjunction with other properties so it's well worth adding helpers for them.

#### boxShadow
```
function boxShadow(shadowType: number, color: string = 'lightCallToAction'): 'box-shadow: [size] [color]';
```

Returns a `box-shadow` CSS property with the given type. The _color_ can be a browser-recognized color value, or a name from `theme.colors`; it defaults to `theme.colors.lightCallToAction`.

#### shadow
```
type Shadow = string | CSSObject | undefined
function shadow(shadowTypeOrSize: number | string, fallback?: Shadow | (props) => Shadow): Shadow;
```

Similar to `boxShadow`, except it only returns the `box-shadow` property if `theme.boxShadows` is true and the color can't be customized. You can also pass a custom shadow size if needed, rather than being restricted to the predefined types from the style guide.

If `theme.boxShadows` is false, the fallback is returned instead:
- If _fallback_ is a function, it is called with the theme props as the only argument.
- If _fallback_ is a string with no ":", it is passed to the `border` helper as a color.
- If _fallback_ or the result of previous steps is a string with no ":", it is returned as a `border` CSS property.
- Else it's returned as-is.

```
shadow(0, 'lightContrast') // = 'border: 1px solid [theme.colors.lightContrast]'
shadow(0, border('red', { thin: '2px' })) // = 'border: 2px solid red'
shadow(0, 'outline: 1px solid green') // = 'outline: 1px solid green'
shadow(0, { margin: '2px' }) // = { margin: '2px' }
```

## Breakpoints

#### mediaGTE
```
function mediaGTE(breakpoint: keyof Breakpoints): '@media (min-width: [breakpoint])';
```

Returns a min-width media query for the given breakpoint, similar to the kind used by `styled-system`. (The GTE indicates "greater than or equal to", e.g. `mediaGTE('small')` matches all widths greater than or equal to the small breakpoint.)

#### mediaLT
```
function mediaLT(breakpoint: keyof Breakpoints): '@media (max-width: [breakpoint])';
```

Returns a max-width media query for the given breakpoint (technically it's a "not (min-width: ...)" query, which is why the function is called "less than" and not "less than or equal to").

#### breakpoint
```
function breakpoint(breakpoint: number | keyof Breakpoints): '[breakpoint]'
```

Returns the given value from `theme.breakpoints`. Since that's an array rather than an object you can pass an array index, e.g. `breakpoint(0)` for the first breakpoint, but you can also use the names from the media queries, e.g. `breakpoint('small').

## Special

#### isResponsiveTouchDevice

Returns true if the code is running on a touch-enabled device with a "tiny" screen size (width < "small" breakpoint), and whose screen is the same width as the window; e.g. a smart phone or small tablet.

This one is special in that it's only incidentally related to the theme (it uses the first breakpoint), and it doesn't do the argument currying that the others do: because it returns a boolean it must always be used in a block with other statements, so there would be no value in being able to throw `${isResponsiveTouchDevice()}` in your styles.

```
const StyledDifferentlyOnMobile = styled.div`
  ${(p) => isResponsiveTouchDevice(p) ? mobileStyles : regularStyles};
`
```
