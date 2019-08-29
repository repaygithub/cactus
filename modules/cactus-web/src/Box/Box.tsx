import {
  backgroundColor,
  BackgroundColorProps,
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
  textStyle,
  TextStyleProps,
  typography,
  TypographyProps,
} from 'styled-system'
import styled from 'styled-components'

export interface BoxProps
  extends PositionProps,
    LayoutProps,
    SpaceProps,
    ColorProps,
    ColorStyleProps,
    DisplayProps,
    BackgroundColorProps,
    TypographyProps,
    TextStyleProps,
    BorderProps {}

export const Box = styled('div')<BoxProps>(
  {
    boxSizing: 'border-box',
  },
  compose(
    position,
    display,
    layout,
    space,
    colorStyle,
    color,
    backgroundColor,
    typography,
    textStyle,
    border
  )
)

export default Box
