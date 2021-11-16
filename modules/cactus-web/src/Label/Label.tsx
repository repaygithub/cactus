import { CactusTheme, color, textStyle } from '@repay/cactus-theme'
import React from 'react'
import styled, { StyledComponent } from 'styled-components'

import Text, { TextProps } from '../Text/Text'

type LabelAttributes = Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'color'>
export interface LabelProps extends LabelAttributes, TextProps {}

export const Label = styled(Text.withComponent('label'))`
  ${textStyle('body')}
  font-weight: 600;
  color: ${color('darkestContrast')};
` as StyledComponent<React.FC<LabelAttributes>, CactusTheme, TextProps>

export default Label
