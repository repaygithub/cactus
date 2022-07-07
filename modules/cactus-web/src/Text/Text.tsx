import { textStyle, TextStyleCollection } from '@repay/cactus-theme'
import styled from 'styled-components'
import {
  color,
  ColorProps,
  colorStyle,
  ColorStyleProps,
  compose,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system'

import { getOmittableProps } from '../helpers/omit'
import { omitStyles } from '../helpers/styled'

// These are covered by `textStyle` instead.
type FontProps = Omit<TypographyProps, 'fontSize' | 'lineHeight'>
const font = omitStyles(typography, 'fontSize', 'lineHeight')

export interface TextProps extends SpaceProps, ColorProps, ColorStyleProps, FontProps {
  textStyle?: keyof TextStyleCollection
}

const styleProps = getOmittableProps(space, color, colorStyle, font, 'textStyle')
export const Text = styled('span').withConfig({
  shouldForwardProp: (p) => !styleProps.has(p),
})<TextProps>`
  &:not(p) {
    margin: 0;
  }
  &&& {
    ${compose(space, color, colorStyle, font)}
    ${(p) => p.textStyle && textStyle(p, p.textStyle)}
  }
`

export default Text
