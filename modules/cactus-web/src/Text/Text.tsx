import { TextStyle, TextStyleCollection } from '@repay/cactus-theme'
import styled, { FlattenSimpleInterpolation } from 'styled-components'
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
  margin,
  space,
  SpaceProps,
  textAlign,
  TextAlignProps,
} from 'styled-system'

import { textStyle } from '../helpers/theme'

export interface TextProps
  extends SpaceProps,
    ColorProps,
    ColorStyleProps,
    FontFamilyProps,
    FontWeightProps,
    TextAlignProps,
    FontStyleProps {
  textStyle?: keyof TextStyleCollection
}

export const Text = styled('span')<TextProps>`
  &:not(p) {
    margin: 0;
  }
  && {
    ${margin}
  }
  ${space}
  ${color}
  ${colorStyle}
  ${fontFamily}
  ${fontWeight}
  ${textAlign}
  ${fontStyle}
  ${(p): FlattenSimpleInterpolation | TextStyle | undefined =>
    p.textStyle && textStyle(p.theme, p.textStyle)}
`

export default Text
