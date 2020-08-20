import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

export const FieldWrapper = styled.div<MarginProps>`
  & + & {
    margin-top: ${(p): number => p.theme.space[4]}px;
  }

  ${margin}
`

export default FieldWrapper
