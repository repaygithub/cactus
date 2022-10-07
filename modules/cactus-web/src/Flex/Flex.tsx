import { CactusTheme } from '@repay/cactus-theme'
import styled, { StyledComponentBase } from 'styled-components'
import { compose } from 'styled-system'

import { Box, BoxProps } from '../Box/Box'
import { getOmittableProps } from '../helpers/omit'
import { flexContainer, flexItem, FlexItemProps, FlexProps, gapWorkaround } from '../helpers/styled'

export interface FlexBoxProps extends BoxProps, FlexProps, FlexItemProps {}

interface FlexComponent extends StyledComponentBase<'div', CactusTheme, FlexBoxProps> {
  Item: StyledComponentBase<'div', CactusTheme, FlexItemProps>
  supportsGap: boolean
}

export const justifyOptions = [
  'unset',
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
  'stretch',
] as const
export type JustifyContent = typeof justifyOptions[number]

const styleProps = getOmittableProps(flexContainer, flexItem)
export const Flex: FlexComponent = styled(Box).withConfig({
  shouldForwardProp: (p) => !styleProps.has(p),
})<FlexBoxProps>`
  display: flex;
  flex-wrap: wrap;
  ${gapWorkaround}
  ${compose(flexContainer, flexItem)}
` as any
Flex.supportsGap = !gapWorkaround

const itemStyleProps = getOmittableProps(flexItem)
Flex.Item = styled.div.withConfig({
  shouldForwardProp: (p) => !itemStyleProps.has(p),
})<FlexItemProps>(flexItem)
Flex.Item.displayName = 'Flex.Item'

export default Flex
