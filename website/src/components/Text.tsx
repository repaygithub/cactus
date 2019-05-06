import {
  color,
  ColorProps,
  colorStyle,
  ColorStyleProps,
  fontFamily,
  FontFamilyProps,
  fontSize,
  FontSizeProps,
  fontWeight,
  FontWeightProps,
  letterSpacing,
  LetterSpacingProps,
  lineHeight,
  LineHeightProps,
  space,
  SpaceProps,
  textAlign,
  TextAlignProps,
} from 'styled-system'
import styled from 'styled-components'

interface TextProps
  extends SpaceProps,
    FontSizeProps,
    ColorProps,
    ColorStyleProps,
    FontFamilyProps,
    FontWeightProps,
    TextAlignProps,
    LineHeightProps,
    LetterSpacingProps {}

const Text = styled('p')<TextProps>(
  space,
  fontSize,
  color,
  colorStyle,
  fontFamily,
  fontWeight,
  textAlign,
  lineHeight,
  letterSpacing
)

export const Span = Text.withComponent('span')

export default Text
