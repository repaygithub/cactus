import { textStyle, TextStyleCollection } from '@repay/cactus-theme'
import styled from 'styled-components'
import { colorStyle, ColorStyleProps, compose, space, SpaceProps } from 'styled-system'

import { getOmittableProps } from '../helpers/omit'
import { allText, AllTextProps, flexItem, FlexItemProps, omitStyles } from '../helpers/styled'

// These are covered by `textStyle` instead.
type FontProps = Omit<AllTextProps, 'fontSize' | 'lineHeight'>
const font = omitStyles(allText, 'fontSize', 'lineHeight')

export interface TextProps extends SpaceProps, ColorStyleProps, FontProps, FlexItemProps {
  textStyle?: keyof TextStyleCollection
}

const styleProps = getOmittableProps(space, colorStyle, font, flexItem, 'textStyle')
export const Text = styled('span').withConfig({
  shouldForwardProp: (p) => !styleProps.has(p),
})<TextProps>`
  &:not(p) {
    margin: 0;
  }
  &&& {
    ${compose(space, colorStyle, font, flexItem)}
    ${(p) => p.textStyle && textStyle(p, p.textStyle)}
  }
`

export default Text
