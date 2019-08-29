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
  textAlign,
  TextAlignProps,
  textStyle,
  TextStyleProps,
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
    TextAlignProps,
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
    textAlign,
    textStyle,
    border
  )
)

export default Box
