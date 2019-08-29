import { Box, BoxProps } from '../Box/Box'
import { flexbox, FlexboxProps } from 'styled-system'
import styled from 'styled-components'

interface FlexBoxProps extends BoxProps, FlexboxProps {}

export const Flex = styled(Box)<FlexBoxProps>(flexbox)

Flex.defaultProps = {
  display: 'flex',
  flexWrap: 'wrap',
}

export default Flex
