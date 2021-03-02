import styled from 'styled-components'

import { border } from '../helpers/theme'

export const Divider = styled.hr`
  border: ${(p) => border(p.theme, 'lightContrast')};
`

export default Divider
