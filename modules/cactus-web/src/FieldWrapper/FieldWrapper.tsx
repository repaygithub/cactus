import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { flexItem, FlexItemProps } from '../helpers/flexItem'

type StyleProps = MarginProps & FlexItemProps & { $gap?: number }
export const FieldWrapper = styled.div<StyleProps>`
  min-width: 1px; /* IE Fix for some situations. */
  :not(:first-child) {
    margin-top: ${(p) => p.theme.space[p.$gap ?? 4]}px;
  }
  && {
    ${margin}
    ${flexItem}
  }
`

export default FieldWrapper
