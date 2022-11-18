import { CactusTheme, radius, textStyle, TextStyleCollection } from '@repay/cactus-theme'
import { ThemedStyledProps } from 'styled-components'
import {
  border,
  BorderProps,
  colorStyle,
  ColorStyleProps,
  display,
  DisplayProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  space,
  SpaceProps,
} from 'styled-system'

import { allText, AllTextProps, flexItem, FlexItemProps, withStyles } from '../helpers/styled'

interface CustomBR {
  square: string
  intermediate: string
  round: string
}

const radiusProps = [
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
] as const

type RadiusProp = typeof radiusProps[number]
type BorderRadiusProps = { [K in RadiusProp]?: BorderProps[K] | CustomBR | 'themed' }

export interface BoxProps
  extends PositionProps,
    LayoutProps,
    SpaceProps,
    ColorStyleProps,
    DisplayProps,
    AllTextProps,
    Omit<BorderProps, RadiusProp>,
    BorderRadiusProps,
    FlexItemProps {
  textStyle?: keyof TextStyleCollection
}

const isInstanceOfCustomBR = (borderProp: any): borderProp is CustomBR => {
  return borderProp?.hasOwnProperty?.('square')
}

const getThemedRadius = (props: ThemedStyledProps<BoxProps, CactusTheme>) => {
  let style: any = undefined
  for (const key of radiusProps) {
    const value = props[key]
    if (!value) continue
    if (value === 'themed') {
      if (!style) style = {}
      style[key] = radius(props, 8)
    } else if (isInstanceOfCustomBR(value)) {
      if (!style) style = {}
      style[key] = value[props.theme.shape]
    }
  }
  return style
}

export const Box = withStyles('div', {
  displayName: 'Box',
  transitiveProps: ['textStyle'],
  extraAttrs: getThemedRadius,
  styles: [position, display, layout, space, colorStyle, allText, border, flexItem],
})<BoxProps>`
  box-sizing: border-box;
  ${(p) => p.textStyle && textStyle(p, p.textStyle)}
`

export default Box
