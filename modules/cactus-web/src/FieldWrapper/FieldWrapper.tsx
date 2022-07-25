import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { flexItem, FlexItemProps } from '../helpers/flexItem'
import { getOmittableProps } from '../helpers/omit'

type StyleProps = MarginProps & FlexItemProps & { $gap?: number }
const styleProps = getOmittableProps(margin, flexItem)
export const FieldWrapper = styled.div.withConfig({
  shouldForwardProp: (p) => !styleProps.has(p),
})<StyleProps>`
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
