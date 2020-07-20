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
  position,
  PositionProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system'
import { textStyle } from '../helpers/theme'
import { TextStyleCollection } from '@repay/cactus-theme'
import styled from 'styled-components'

export interface BoxProps
  extends PositionProps,
    LayoutProps,
    SpaceProps,
    ColorProps,
    ColorStyleProps,
    DisplayProps,
    TypographyProps,
    BorderProps {
  textStyle?: keyof TextStyleCollection
}

export const Box = styled('div')<BoxProps>`
  box-sizing: border-box;
  ${compose(position, display, layout, space, colorStyle, color, typography, border)}
  ${(p) => p.textStyle && textStyle(p.theme, p.textStyle)}
`

export default Box
