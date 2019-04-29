import styled from 'styled-components'
import {
  space,
  fontSize,
  color,
  colorStyle,
  fontFamily,
  fontWeight,
  textAlign,
  lineHeight,
  letterSpacing,
  SpaceProps,
  FontSizeProps,
  ColorProps,
  ColorStyleProps,
  FontFamilyProps,
  FontWeightProps,
  TextAlignProps,
  LineHeightProps,
  LetterSpacingProps,
} from 'styled-system'

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
