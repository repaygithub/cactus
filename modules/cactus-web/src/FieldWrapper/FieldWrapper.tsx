import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { flexItem, FlexItemProps } from '../helpers/flexItem'

export const FieldWrapper = styled.div<MarginProps & FlexItemProps>`
  min-width: 1px; /* IE Fix for some situations. */
  & + & {
    margin-top: ${(p): number => p.theme.space[4]}px;
  }

  ${margin}
  ${flexItem}
`

export default FieldWrapper
