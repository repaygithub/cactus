import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { textStyle } from '../helpers/theme'

export interface LabelProps extends React.ComponentPropsWithoutRef<'label'>, MarginProps {}

export const Label = styled.label<LabelProps>`
  ${(p) => textStyle(p.theme, 'body')};
  font-weight: 600;
  color: ${(p): string => p.theme.colors.darkestContrast};

  ${margin}
`

export default Label
