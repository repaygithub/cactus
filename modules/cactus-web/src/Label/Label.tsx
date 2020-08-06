import { TextStyle } from '@repay/cactus-theme'
import React from 'react'
import styled, { FlattenSimpleInterpolation } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { textStyle } from '../helpers/theme'
import { Omit } from '../types'

export interface LabelProps
  extends Omit<
      React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
      'ref'
    >,
    MarginProps {}

export const Label = styled.label<LabelProps>`
  ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'body')};
  font-weight: 600;
  color: ${(p): string => p.theme.colors.darkestContrast};

  ${margin}
`

export default Label
