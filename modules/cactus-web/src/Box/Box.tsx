import { TextStyleCollection } from '@repay/cactus-theme'
import styled, { DefaultTheme, ThemedStyledProps } from 'styled-components'
import {
  border,
  BorderProps,
  color,
  ColorProps,
  colorStyle,
  ColorStyleProps,
  compose,
  display,
  DisplayProps,
  layout,
  LayoutProps,
  overflow,
  OverflowProps,
  position,
  PositionProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system'

import { flexItem, FlexItemProps } from '../helpers/flexItem'
import { radius, textStyle } from '../helpers/theme'

interface CustomBR {
  square: string
  intermediate: string
  round: string
}

interface CustomBorderProps
  extends Omit<
    BorderProps,
    | 'borderRadius'
    | 'borderTopLeftRadius'
    | 'borderTopRightRadius'
    | 'borderBottomRightRadius'
    | 'borderBottomLeftRadius'
  > {
  borderRadius?: BorderProps['borderRadius'] | CustomBR | 'themed'
  borderTopLeftRadius?: BorderProps['borderTopLeftRadius'] | CustomBR
  borderTopRightRadius?: BorderProps['borderTopRightRadius'] | CustomBR
  borderBottomRightRadius?: BorderProps['borderBottomRightRadius'] | CustomBR
  borderBottomLeftRadius?: BorderProps['borderBottomLeftRadius'] | CustomBR
}

export interface BoxProps
  extends PositionProps,
    LayoutProps,
    SpaceProps,
    ColorProps,
    ColorStyleProps,
    DisplayProps,
    TypographyProps,
    CustomBorderProps,
    OverflowProps,
    FlexItemProps {
  textStyle?: keyof TextStyleCollection
}

const isInstanceOfCustomBR = (borderProp: any): borderProp is CustomBR => {
  return borderProp !== null && borderProp !== undefined && borderProp.hasOwnProperty('square')
}

const decideBorderRadius = (props: ThemedStyledProps<BoxProps, DefaultTheme>) => {
  const {
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
  } = props

  if (borderRadius && borderRadius === 'themed') {
    return `border-radius: ${radius(8)(props)};`
  } else if (isInstanceOfCustomBR(borderRadius)) {
    return `border-radius: ${borderRadius[props.theme.shape]};`
  }

  let borderRadiusStyles = ''

  if (isInstanceOfCustomBR(borderTopLeftRadius)) {
    borderRadiusStyles += `border-top-left-radius: ${borderTopLeftRadius[props.theme.shape]};`
  }
  if (isInstanceOfCustomBR(borderTopRightRadius)) {
    borderRadiusStyles += `border-top-right-radius: ${borderTopRightRadius[props.theme.shape]};`
  }
  if (isInstanceOfCustomBR(borderBottomRightRadius)) {
    borderRadiusStyles += `border-bottom-right-radius: ${
      borderBottomRightRadius[props.theme.shape]
    };`
  }
  if (isInstanceOfCustomBR(borderBottomLeftRadius)) {
    borderRadiusStyles += `border-bottom-left-radius: ${borderBottomLeftRadius[props.theme.shape]};`
  }
  return borderRadiusStyles
}

export const Box = styled('div')<BoxProps>`
  box-sizing: border-box;
  ${compose(
    position,
    display,
    layout,
    space,
    colorStyle,
    color,
    typography,
    border,
    overflow,
    flexItem
  )}
  ${(p) => p.textStyle && textStyle(p.theme, p.textStyle)}
  ${decideBorderRadius}
`

export default Box
