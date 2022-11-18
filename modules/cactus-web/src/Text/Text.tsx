import { textStyle, TextStyleCollection } from '@repay/cactus-theme'
import { colorStyle, ColorStyleProps, space, SpaceProps } from 'styled-system'

import {
  allText,
  AllTextProps,
  flexItem,
  FlexItemProps,
  omitStyles,
  withStyles,
} from '../helpers/styled'

// These are covered by `textStyle` instead.
type FontProps = Omit<AllTextProps, 'fontSize' | 'lineHeight'>
const font = omitStyles(allText, 'fontSize', 'lineHeight')

export interface TextProps extends SpaceProps, ColorStyleProps, FontProps, FlexItemProps {
  textStyle?: keyof TextStyleCollection
}

export const Text = withStyles('span', {
  displayName: 'Text',
  transitiveProps: ['textStyle'],
  styles: [space, colorStyle, font, flexItem],
})<TextProps>`
  &:not(p) {
    margin: 0;
  }
  &&& {
    ${(p) => p.textStyle && textStyle(p, p.textStyle)}
  }
`

export default Text
