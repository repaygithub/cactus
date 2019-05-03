import React from 'react'
import styled from 'styled-components'
import { Omit } from '../types'
import { margins, MarginProps } from '../helpers/margins'

export interface LabelProps
  extends Omit<
      React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
      'ref'
    >,
    MarginProps {}

export const Label = styled.label<LabelProps>`
  font-size: 18px;
  height: 28px;
  font-weight: 400;
  color: ${p => p.theme.colors.darkestContrast};

  ${margins}
`

export default Label
