import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

export const Divider = styled.hr<MarginProps>`
  ${margin}
  border: none;
  height: ${(p) => (p.theme.border === 'thin' ? '1px' : '2px')};
  color: ${(p) => p.theme.colors.lightContrast};
  background-color: ${(p) => p.theme.colors.lightContrast};
`

export default Divider
