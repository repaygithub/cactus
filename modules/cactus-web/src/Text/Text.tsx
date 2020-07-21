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
} from 'styled-system'
import { textStyle } from '../helpers/theme'
import { TextStyleCollection } from '@repay/cactus-theme'
import styled from 'styled-components'

interface TextProps
  extends SpaceProps,
    ColorProps,
    ColorStyleProps,
    FontFamilyProps,
    FontWeightProps,
    TextAlignProps,
    FontStyleProps {
  textStyle?: keyof TextStyleCollection
}

export const Text = styled('p')<TextProps>`
  ${space}
  ${color}
  ${colorStyle}
  ${fontFamily}
  ${fontWeight}
  ${textAlign}
  ${fontStyle}
  ${(p) => p.textStyle && textStyle(p.theme, p.textStyle)}
`

export const Span = Text.withComponent('span')

export default Text
