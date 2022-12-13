import { margin, MarginProps } from 'styled-system'

import { withStyles } from '../helpers/styled'

export const Divider = withStyles('hr', {
  displayName: 'Divider',
  styles: [margin],
})<MarginProps>`
  border: none;
  height: ${(p) => (p.theme.border === 'thin' ? '1px' : '2px')};
  color: ${(p) => p.theme.colors.lightContrast};
  background-color: ${(p) => p.theme.colors.lightContrast};
`

export default Divider
