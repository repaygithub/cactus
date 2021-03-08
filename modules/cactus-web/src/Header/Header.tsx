import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

interface HeaderProps extends MarginProps {}

export const Header = styled.div<HeaderProps>`
  ${margin}
`

export default Header
