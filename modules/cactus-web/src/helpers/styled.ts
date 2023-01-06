import { CactusTheme, screenSizes } from '@repay/cactus-theme'
import { Property } from 'csstype'
import { omit, pick } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { StyledComponent, StyledConfig, ThemedStyledFunction } from 'styled-components'
import * as SS from 'styled-system'

import { useScreenSize } from '../ScreenSizeProvider/ScreenSizeProvider'
import { isIE } from './constants'

// This file exists, in part, because styled-components types are a PAIN.
export type Styled<P> = StyledComponent<React.FC<P>, CactusTheme>

type Attrs = { [k: string]: any } | ((props: any) => any)

// `ElementType` is more correct, but using `ComponentType` internally works better.
interface StyleOpts<T = React.ComponentType> extends StyledConfig {
  as?: T
  className?: string
  extraAttrs?: Attrs
  styles?: SS.styleFn[]
  transitiveProps?: readonly string[]
  preserveProps?: readonly string[]
}

type StyleTag<C extends React.ElementType> = C extends StyledComponent<
  infer C0,
  any,
  infer S,
  infer A
>
  ? ThemedStyledFunction<C0, CactusTheme, S, A>
  : ThemedStyledFunction<C, CactusTheme>

type FixedStyleTag<
  C extends React.ElementType,
  F extends React.ElementType
> = C extends StyledComponent<any, any, infer S, infer A>
  ? ThemedStyledFunction<F, CactusTheme, S, A>
  : ThemedStyledFunction<F, CactusTheme>

interface WithStyles {
  <C extends React.ElementType>(component: C, opts: StyleOpts<never>): StyleTag<C>
  <C extends React.ElementType, F extends React.ElementType>(
    component: C,
    opts: StyleOpts<F>
  ): FixedStyleTag<C, F>
}

type AnyObject = { [p: string]: unknown }
type StyleConfig = { [p: string]: SS.ConfigFunction }

const mergeStyle = (style: AnyObject, props: any, processor: SS.ConfigFunction, value: unknown) => {
  if (value !== null && value !== undefined) {
    const scaleKey = processor.scale
    const scale = (scaleKey && props.theme?.[scaleKey]) || processor.defaults
    const processedStyle = processor(value, scale, props)
    if (processedStyle) {
      Object.assign(style, processedStyle)
      return true
    }
  }
}

export const useResponsiveStyles = (config: StyleConfig, props: any): AnyObject => {
  const currentSize = useScreenSize().valueOf()
  const style: AnyObject = {}
  for (const key in props) {
    const processor = config[key]
    if (!processor) continue
    const rawValue = props[key]

    if (typeof rawValue === 'object') {
      if (Array.isArray(rawValue)) {
        const maxSize = rawValue.length - 1
        for (let i = Math.min(currentSize, maxSize); i >= 0; i--) {
          if (mergeStyle(style, props, processor, rawValue[i])) break
        }
      } else if (rawValue) {
        for (let i = currentSize; i >= 0; i--) {
          const value = (rawValue as AnyObject)[screenSizes[i]]
          if (mergeStyle(style, props, processor, value)) break
        }
      }
    } else {
      mergeStyle(style, props, processor, rawValue)
    }
  }
  return style
}

const getInlineStyleHook = (styleParser: SS.styleFn) => {
  const config = (styleParser.config || {}) as StyleConfig
  // As long as you don't mess with `styled-components` internals, this follows the rules of hooks.
  const useInlineStyles = (props: any) => {
    const parsedStyles = useResponsiveStyles(config, props)
    // Shortcut to check for property existence.
    for (const _ in parsedStyles) {
      return { style: props.style ? { ...props.style, ...parsedStyles } : parsedStyles }
    }
  }
  return useInlineStyles
}

// To keep type inference simple we can't include the style prop types,
// so you need to include them in the tagged template:
//   const Component = withStyles('div', margin)<MarginProps>`
//     static: style;
//   `
export const withStyles: WithStyles = (component: React.ComponentType, options: StyleOpts) => {
  const {
    transitiveProps,
    preserveProps,
    styles = [],
    extraAttrs,
    className,
    as: fixedComponent,
    ...config
  } = options

  const styleParser: SS.styleFn = styles.length === 1 ? styles[0] : SS.compose(...styles)
  const transitivePropSet = new Set<string>()
  // Unlike some of the array methods, Set methods ignore all but the first argument.
  styleParser.propNames?.forEach(transitivePropSet.add, transitivePropSet)
  transitiveProps?.forEach(transitivePropSet.add, transitivePropSet)
  preserveProps?.forEach(transitivePropSet.delete, transitivePropSet)

  if (transitivePropSet.size) {
    config.shouldForwardProp = (propName) => !transitivePropSet.has(propName)
  }
  if (className) {
    config.componentId = className
  } else if (!config.displayName) {
    // Else-if because componentId + displayName behaves oddly.
    config.displayName = fixedComponent?.displayName || component.displayName
  }

  let tag: any = styled(component).withConfig(config)
  if (fixedComponent) tag = tag.attrs({ as: fixedComponent })
  if (extraAttrs) tag = tag.attrs(extraAttrs)
  if (styles.length) tag = tag.attrs(getInlineStyleHook(styleParser))
  return tag
}

// `ResponsiveValue` includes `null` but not `undefined` which conflicts with
// the types in the PropTypes library, so we override the return type to match.
export const responsivePropType = <T>(
  ptype: PropTypes.Requireable<T>
): PropTypes.Requireable<SS.ResponsiveValue<T>> =>
  PropTypes.oneOfType([
    ptype,
    PropTypes.arrayOf(ptype),
    PropTypes.shape(
      screenSizes.reduce((types: any, key) => {
        types[key] = ptype
        return types
      }, {})
    ),
  ]) as any

export const styledProp = responsivePropType<string | number>(
  PropTypes.oneOfType([PropTypes.string, PropTypes.number])
)

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
  flexFlow?: SS.ResponsiveValue<Property.FlexFlow>
  gap?: SS.ResponsiveValue<Property.Gap<string | number>>
  rowGap?: SS.ResponsiveValue<Property.RowGap<string | number>>
  colGap?: SS.ResponsiveValue<Property.ColumnGap<string | number>>
}

export interface FlexOptionProps extends Omit<FlexProps, 'flexFlow'> {
  flexFlow?: SS.ResponsiveValue<boolean | Property.FlexFlow>
}

export type FlexItemProps = Pick<SS.FlexboxProps, typeof itemKeys[number]>

export const flexContainer = SS.system({
  ...pick(SS.flexbox.config, flexKeys),
  ...spaceEvenlyFix,
  gap: { property: 'gap', scale: 'space' },
  rowGap: { property: 'rowGap', scale: 'space' },
  colGap: { property: 'columnGap', scale: 'space' },
  flexFlow: true,
})
export const flexItem = pickStyles(SS.flexbox, ...itemKeys)

// Not exhaustive, but all possible values include at least one of these words.
const isFlexKey = RegExp.prototype.test.bind(/row|column|reverse|wrap/)
// Just like `flexContainer`, except it expects the default display mode to be
// something other than flex and has a shortcut to "activate" flex behavior:
// `<C flexFlow>` -> `<C display="flex" flexFlow="row nowrap">`.
// Be careful that it doesn't override another display mode, e.g. `inline-flex`.
export const flexContainerOption = SS.system({
  ...flexContainer.config,
  flexFlow: (value: any) => {
    if (typeof value === 'boolean') {
      return value ? { display: 'flex' } : undefined
    } else if (isFlexKey(value)) {
      return { display: 'flex', flexFlow: value }
    }
  },
})

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
