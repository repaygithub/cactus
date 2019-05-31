import {
  alignContent,
  AlignContentProps,
  alignItems,
  AlignItemsProps,
  alignSelf,
  AlignSelfProps,
  flex,
  flexBasis,
  FlexBasisProps,
  flexDirection,
  FlexDirectionProps,
  FlexProps,
  flexWrap,
  FlexWrapProps,
  justifyContent,
  JustifyContentProps,
  justifySelf,
  JustifySelfProps,
  order,
  OrderProps,
} from 'styled-system'
import { Box, BoxProps } from '../Box/Box'
import styled from 'styled-components'

interface FlexBoxProps
  extends BoxProps,
    FlexProps,
    AlignItemsProps,
    AlignContentProps,
    JustifyContentProps,
    FlexWrapProps,
    FlexBasisProps,
    FlexDirectionProps,
    JustifySelfProps,
    OrderProps,
    AlignSelfProps {}

export const Flex = styled(Box)<FlexBoxProps>(
  flex,
  alignItems,
  alignContent,
  justifyContent,
  flexWrap,
  flexBasis,
  flexDirection,
  justifySelf,
  alignSelf,
  order
)

Flex.defaultProps = {
  display: 'flex',
  flexWrap: 'wrap',
}

export default Flex
