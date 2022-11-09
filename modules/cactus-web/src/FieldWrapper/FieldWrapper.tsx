import { margin, MarginProps } from 'styled-system'

import { flexItem, FlexItemProps } from '../helpers/flexItem'
import { withStyles } from '../helpers/styled'

type StyleProps = MarginProps & FlexItemProps & { $gap?: number }
export const FieldWrapper = withStyles('div', {
  displayName: 'FieldWrapper',
  styles: [margin, flexItem],
})<StyleProps>`
  min-width: 1px; /* IE Fix for some situations. */
  :not(:first-child) {
    margin-top: ${(p) => p.theme.space[p.$gap ?? 4]}px;
  }
`

export default FieldWrapper
