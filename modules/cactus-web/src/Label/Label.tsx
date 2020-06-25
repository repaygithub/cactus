import React from 'react'

import { margin, MarginProps } from 'styled-system'
import { Omit } from '../types'
import styled from 'styled-components'

export interface LabelProps
  extends Omit<
      React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
      'ref'
    >,
    MarginProps {}

export const Label = styled.label<LabelProps>`
  ${(p) => p.theme.textStyles.body};
  font-weight: 600;
  color: ${(p) => p.theme.colors.darkestContrast};

  ${margin}
`

export default Label
