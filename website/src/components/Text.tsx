import styled from 'styled-components'
import {
  color,
  ColorProps,
  colorStyle,
  ColorStyleProps,
  fontFamily,
  FontFamilyProps,
  fontSize,
  FontSizeProps,
  fontStyle,
  FontStyleProps,
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

interface TextProps
  extends SpaceProps,
    FontSizeProps,
    ColorProps,
    ColorStyleProps,
    FontFamilyProps,
    FontWeightProps,
    TextAlignProps,
    FontStyleProps,
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
  fontStyle,
  lineHeight,
  letterSpacing
)

export const Span = Text.withComponent('span')

export default Text
