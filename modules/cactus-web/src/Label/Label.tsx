import React from 'react'

import { MarginProps, margins } from '../helpers/margins'
import { Omit } from '../types'
import styled from 'styled-components'

export interface LabelProps
  extends Omit<
      React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
      'ref'
    >,
    MarginProps {}

export const Label = styled.label<LabelProps>`
  ${p => p.theme.textStyles.body};
  font-weight: 400;
  color: ${p => p.theme.colors.darkestContrast};

  ${margins}
`

export default Label
