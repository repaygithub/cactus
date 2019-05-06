import {
  alignContent,
  AlignContentProps,
  alignItems,
  AlignItemsProps,
  alignSelf,
  AlignSelfProps,
  borderColor,
  BorderColorProps,
  borderStyle,
  BorderStyleProps,
  borderWidth,
  BorderWidthProps,
  bottom,
  BottomProps,
  color,
  ColorProps,
  colorStyle,
  ColorStyleProps,
  display,
  DisplayProps,
  flex,
  flexBasis,
  FlexBasisProps,
  flexDirection,
  FlexDirectionProps,
  FlexProps,
  flexWrap,
  FlexWrapProps,
  fontSize,
  FontSizeProps,
  justifyContent,
  JustifyContentProps,
  justifySelf,
  JustifySelfProps,
  left,
  LeftProps,
  maxWidth,
  MaxWidthProps,
  minWidth,
  MinWidthProps,
  order,
  OrderProps,
  position,
  PositionProps,
  right,
  RightProps,
  space,
  SpaceProps,
  top,
  TopProps,
  width,
  WidthProps,
  zIndex,
  ZIndexProps,
} from 'styled-system'
import styled from 'styled-components'

interface BoxProps
  extends PositionProps,
    TopProps,
    BottomProps,
    LeftProps,
    RightProps,
    WidthProps,
    MaxWidthProps,
    MinWidthProps,
    SpaceProps,
    FontSizeProps,
    ColorProps,
    ColorStyleProps,
    DisplayProps,
    BorderColorProps,
    BorderWidthProps,
    BorderStyleProps,
    FlexProps,
    AlignItemsProps,
    AlignContentProps,
    JustifyContentProps,
    FlexWrapProps,
    FlexBasisProps,
    FlexDirectionProps,
    JustifySelfProps,
    OrderProps,
    AlignSelfProps,
    ZIndexProps {}

const Box = styled('div')<BoxProps>(
  {
    boxSizing: 'border-box',
  },
  position,
  top,
  right,
  bottom,
  left,
  space,
  width,
  fontSize,
  colorStyle,
  color,
  display,
  borderColor,
  borderWidth,
  borderStyle,
  flex,
  alignItems,
  alignContent,
  justifyContent,
  flexWrap,
  flexBasis,
  flexDirection,
  justifySelf,
  alignSelf,
  order,
  zIndex
)

export default Box
