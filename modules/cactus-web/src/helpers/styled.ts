import { CactusTheme } from '@repay/cactus-theme'
import { Property } from 'csstype'
import { omit, pick } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { StyledComponent, ThemedStyledFunction } from 'styled-components'
import * as SS from 'styled-system'

import { isIE } from './constants'

// This file exists, in part, because styled-components types are a PAIN.
export type Styled<P> = StyledComponent<React.FC<P>, CactusTheme>

// Using `{}` so it won't change the component types.
// TODO Does this actually work?
type AttrFunc = (props: {}) => {}

// This makes two assumptions about the style processors:
// 1. Must return simple style object, i.e. all the keys must be CSS properties;
//    can't return something like `{ '& > *': { margin: 5 } }` to set child styles.
// 2. Must return all styles for a given input; can't rely on screen size cascading.
// (I'm actually not even sure if it's possible to violate #2, but maybe in theory...)
// As far as I know, all the built-in `styled-system` processors meet these assumptions.
export const makeStyleParser = (...parsers: SS.styleFn[]): AttrFunc => {
  const config: Record<string, SS.ConfigFunction> = {}
  for (const parser of parsers) {
    Object.assign(config, parser.config)
  }

  return (props: any) => {
    const { style: styleProp, theme } = props
    let style = styleProp
    let sizeKeys: string[] = false as any
    for (const key in props) {
      const processor = config[key]
      if (!processor) continue
      const scale: SS.Scale | undefined = theme[processor.scale] || processor.defaults
      const rawStyle = props[key]

      const merge = (value) => {
        if (value !== null && value !== undefined) {
          const processed = processor(value, scale, props)
          if (processed) {
            if (style === styleProp) {
              style = Object.assign({}, style, processed)
            } else {
              Object.assign(style, processed)
            }
            return true
          }
        }
      }
      if (typeof rawStyle === 'object' && rawStyle !== null) {
        // Returns an array of matching sizes, e.g if current screen size
        // is medium, returns `['tiny', 'small', 'medium']` (ascending order).
        // If you get this data using a hook, move up to the declaration,
        // instead of having this lazy initialize.
        if (!sizeKeys) sizeKeys = getMatchingScreenSizes(theme)

        if (Array.isArray(rawStyle)) {
          for (let i = Math.min(sizeKeys.length, rawStyle.length) - 1; i >= 0; i--) {
            if (merge(rawStyle[i])) break
          }
        } else {
          for (const key of keys) {
            if (merge(rawStyle[key])) break
          }
        }
      } else {
        merge(rawStyle)
      }
    }
    return style ? { style } : undefined
  }
}

const SampleComponent = styled.div.attrs(makeStyleParser(SS.margin, SS.padding))`
  extra: static-style;
`

// This works around the `babel-plugin-styled-components` `displayName` setting,
// so we can specify the CSS class of the resulting component.
export const styledWithClass = <C extends React.ElementType>(
  component: C,
  className: string
): ThemedStyledFunction<C, CactusTheme> => {
  const tag: any = styled(component)
  return tag.withConfig({ componentId: className })
}

// This gives us a styled component without the polymorphic behavior: the `as`
// attr overrides any `as` prop passed in. Unfortunately I can't think of a way
// to make Typescript consider it an invalid prop as well.
export const styledUnpoly = <C extends React.ElementType, F extends React.ElementType = C>(
  component: C,
  fixed: F = component as any
): ThemedStyledFunction<F, CactusTheme> => {
  let tag: any = styled(component).attrs({ as: fixed } as any)
  if ('displayName' in fixed) {
    tag = tag.withConfig({ displayName: (fixed as any).displayName })
  }
  return tag
}

const cssVal = PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
export const styledProp = PropTypes.oneOfType([cssVal, PropTypes.arrayOf(cssVal)])

export const classes = (...args: (string | undefined)[]): string => args.filter(Boolean).join(' ')

export const pickStyles = (styles: SS.styleFn, ...keys: string[]): SS.styleFn => {
  if (!styles.config) return styles
  return SS.createParser(pick(styles.config, keys))
}

export const omitStyles = (styles: SS.styleFn, ...keys: string[]): SS.styleFn => {
  if (!styles.config) return styles
  return SS.createParser(omit(styles.config, keys))
}

// Keeping this separate from `flexContainer` styles because it applies
// to the element's children, not the element itself.
export const gapWorkaround: SS.styleFn | undefined = (function () {
  if (typeof CSS !== 'undefined' && CSS.supports?.('gap', '1px')) return
  const calcGap = (value: any, scale: SS.Scale | undefined) => {
    try {
      value = scale?.[value] ?? value
    } catch {}
    if (typeof value === 'number') {
      return value / 2
    } else if (typeof value === 'string' && !isNaN(parseFloat(value))) {
      return `calc(${value.trim()} / 2)`
    }
    return value
  }

  const makeGapParser = (...props: string[]) => {
    const parser: SS.ConfigFunction = (value, scale) => {
      const styles: any = {}
      const gap = calcGap(value, scale)
      for (const prop of props) {
        styles[prop] = gap
      }
      return { '&&&& > *': styles }
    }
    parser.scale = 'space'
    return parser
  }

  return SS.system({
    gap: makeGapParser('margin'),
    rowGap: makeGapParser('marginTop', 'marginBottom'),
    colGap: makeGapParser('marginLeft', 'marginRight'),
  })
})()

// IE doesn't support `space-evenly`, but you can fake it using pseudo-elements.
const spaceEvenlyFix: SS.Config | undefined = (function () {
  if (!isIE) return
  const justifyContent = (value: any) => {
    if (!value) return
    const placeholderBlock = { content: "''", display: 'none', flex: '0 0 0' }
    const styles = {
      justifyContent: value,
      '&::before': placeholderBlock,
      '&::after': placeholderBlock,
    }
    if (value === 'space-evenly') {
      placeholderBlock.display = 'block'
      styles.justifyContent = 'space-between'
    }
    return styles
  }
  return { justifyContent }
})()

const flexKeys = [
  'alignItems',
  'alignContent',
  'justifyContent',
  'flexWrap',
  'flexDirection',
] as const
const itemKeys = ['flex', 'flexGrow', 'flexShrink', 'flexBasis', 'alignSelf', 'order'] as const

export interface FlexProps extends Pick<SS.FlexboxProps, typeof flexKeys[number]> {
  flexFlow?: SS.ResponsiveValue<boolean | Property.FlexFlow>
  gap?: SS.ResponsiveValue<Property.Gap<string | number>>
  rowGap?: SS.ResponsiveValue<Property.RowGap<string | number>>
  colGap?: SS.ResponsiveValue<Property.ColumnGap<string | number>>
}
export type FlexItemProps = Pick<SS.FlexboxProps, typeof itemKeys[number]>

// Not exhaustive, but all possible values include at least one of these words.
const isFlexKey = RegExp.prototype.test.bind(/row|column|reverse|wrap/)

export const flexContainer = SS.system({
  ...pick(SS.flexbox.config, flexKeys),
  ...spaceEvenlyFix,
  gap: { property: 'gap', scale: 'space' },
  rowGap: { property: 'rowGap', scale: 'space' },
  colGap: { property: 'columnGap', scale: 'space' },
  // Gives a shortcut to common flex props, e.g. `<C flexFlow="row wrap">`
  // is equivalent to `<C display="flex" flexDirection="row" flexWrap="wrap">`.
  // Depending on where it's used, the `display` part could be redundant;
  // keep that in mind if you need a different `display` value (e.g. 'inline-flex').
  flexFlow: (value: any) => {
    if (typeof value === 'boolean') {
      return value ? { display: 'flex' } : undefined
    } else if (isFlexKey(value)) {
      return { display: 'flex', flexFlow: value }
    }
  },
})
export const flexItem = pickStyles(SS.flexbox, ...itemKeys)

export type AllWidthProps = SS.WidthProps & SS.MinWidthProps & SS.MaxWidthProps
export const allWidth = SS.compose(SS.width, SS.minWidth, SS.maxWidth)

export type AllHeightProps = SS.HeightProps & SS.MinHeightProps & SS.MaxHeightProps
export const allHeight = SS.compose(SS.height, SS.minHeight, SS.maxHeight)

export type SizingProps = AllWidthProps & AllHeightProps
export const sizing = SS.compose(
  SS.width,
  SS.minWidth,
  SS.maxWidth,
  SS.height,
  SS.minHeight,
  SS.maxHeight
)

/******* Text Styling *******/

interface TextDecorationProps {
  textDecoration?: SS.ResponsiveValue<Property.TextDecoration>
  textDecorationColor?: SS.ResponsiveValue<Property.TextDecorationColor>
  textDecorationLine?: SS.ResponsiveValue<Property.TextDecorationLine>
  textDecorationSkipInk?: SS.ResponsiveValue<Property.TextDecorationSkipInk>
  textDecorationStyle?: SS.ResponsiveValue<Property.TextDecorationStyle>
  textDecorationThickness?: SS.ResponsiveValue<Property.TextDecorationThickness<string | number>>
  textUnderlineOffset?: SS.ResponsiveValue<Property.TextUnderlineOffset<string | number>>
  textUnderlinePosition?: SS.ResponsiveValue<Property.TextUnderlinePosition>
}

const textDecoration = SS.system({
  textDecoration: true,
  textDecorationColor: { property: 'textDecorationColor', scale: 'colors' },
  textDecorationLine: true,
  textDecorationSkipInk: true,
  textDecorationStyle: true,
  textDecorationThickness: { property: 'textDecorationThickness', scale: 'space' },
  textUnderlineOffset: { property: 'textUnderlineOffset', scale: 'space' },
  textUnderlinePosition: true,
})

interface TextDirectionProps {
  textOrientation?: SS.ResponsiveValue<Property.TextOrientation>
  writingMode?: SS.ResponsiveValue<Property.WritingMode>
}

const textDirection = SS.system({
  textOrientation: true,
  writingMode: true,
})

interface TextDisplayProps {
  fontStretch?: SS.ResponsiveValue<Property.FontStretch>
  fontVariant?: SS.ResponsiveValue<Property.FontVariant>
  fontVariantCaps?: SS.ResponsiveValue<Property.FontVariantCaps>
  fontVariantLigatures?: SS.ResponsiveValue<Property.FontVariantLigatures>
  fontVariantNumeric?: SS.ResponsiveValue<Property.FontVariantNumeric>
  textIndent?: SS.ResponsiveValue<Property.TextIndent<string | number>>
  textTransform?: SS.ResponsiveValue<Property.TextTransform>
}

const textDisplay = SS.system({
  fontStretch: true,
  fontVariant: true,
  fontVariantCaps: true,
  fontVariantLigatures: true,
  fontVariantNumeric: true,
  textIndent: {
    property: 'textIndent',
    scale: 'space',
    // Unlike most other space props, it makes sense to allow negative numbers.
    transform: (value, scale) => {
      if (scale) {
        if (typeof value === 'number' && value < 0) {
          const scaleVal = scale[-value]
          if (typeof scaleVal === 'number') {
            return -scaleVal
          } else if (scaleVal) {
            return `-${scaleVal}`
          }
        }
        return scale[value] ?? value
      }
      return value
    },
  },
  textTransform: true,
})

interface TextOverflowProps extends SS.OverflowProps {
  hyphens?: SS.ResponsiveValue<Property.Hyphens>
  overflowWrap?: SS.ResponsiveValue<Property.OverflowWrap>
  textOverflow?: SS.ResponsiveValue<Property.TextOverflow>
  whiteSpace?: SS.ResponsiveValue<Property.WhiteSpace>
  wordBreak?: SS.ResponsiveValue<Property.WordBreak>
}

const textOverflow = SS.compose(
  SS.overflow,
  SS.overflowX,
  SS.overflowY,
  SS.system({
    hyphens: true,
    overflowWrap: { properties: ['overflowWrap', 'wordWrap'] },
    textOverflow: true,
    whiteSpace: true,
    wordBreak: true,
  })
)

interface UserSelectProps {
  userSelect?: SS.ResponsiveValue<Property.UserSelect>
}
// This one doesn't really fit anywhere else...
const userSelect = SS.system({ userSelect: true })

// Other text-related props I'm not including:
// `textJustify`: lack of browser support
// `fontVariantAlternates`: lack of browser support
// `fontVariantPosition`: lack of browser support
// `fontVariantAlternates`: lack of browser support
// `fontVariationSettings`: common use cases covered by other properties
// `textShadow`: requires custom transform to utilize themed shadows, wait for use case to add

export const allText = SS.compose(
  SS.color,
  SS.typography,
  textDecoration,
  textDirection,
  textDisplay,
  textOverflow,
  userSelect
)
export type AllTextProps = SS.ColorProps &
  SS.TypographyProps &
  TextDecorationProps &
  TextDirectionProps &
  TextDisplayProps &
  TextOverflowProps &
  UserSelectProps
