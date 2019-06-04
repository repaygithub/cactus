import {
  color,
  ColorProps,
  colorStyle,
  ColorStyleProps,
  fontFamily,
  FontFamilyProps,
  fontStyle,
  FontStyleProps,
  fontWeight,
  FontWeightProps,
  space,
  SpaceProps,
  textAlign,
  TextAlignProps,
  textStyle,
  TextStyleProps,
} from 'styled-system'
import styled from 'styled-components'

interface TextProps
  extends SpaceProps,
    ColorProps,
    ColorStyleProps,
    FontFamilyProps,
    FontWeightProps,
    TextAlignProps,
    FontStyleProps,
    TextStyleProps {}

export const Text = styled('p')<TextProps>(
  space,
  color,
  colorStyle,
  fontFamily,
  fontWeight,
  textAlign,
  fontStyle,
  textStyle
)

export const Span = Text.withComponent('span')

export default Text
