import React from 'react'

import { MarginProps, margins } from '../helpers/margins'
import styled from 'styled-components'

interface FieldWrapperProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    MarginProps {}

export const FieldWrapper = styled.div<FieldWrapperProps>`
  & + & {
    margin-top: ${p => p.theme.space[4]}px;
  }

  ${margins}
`

export default FieldWrapper
