import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

interface FieldWrapperProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    MarginProps {}

export const FieldWrapper = styled.div<FieldWrapperProps>`
  & + & {
    margin-top: ${(p) => p.theme.space[4]}px;
  }

  ${margin}
`

export default FieldWrapper
