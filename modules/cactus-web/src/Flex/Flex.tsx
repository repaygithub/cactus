import { CactusTheme } from '@repay/cactus-theme'
import { StyledComponentBase } from 'styled-components'

import { Box, BoxProps } from '../Box/Box'
import {
  flexContainer,
  flexItem,
  FlexItemProps,
  FlexProps,
  gapWorkaround,
  withStyles,
} from '../helpers/styled'

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

export const Flex: FlexComponent = withStyles(Box, {
  displayName: 'Flex',
  transitiveProps: gapWorkaround?.propNames,
  styles: [flexContainer, flexItem],
})<FlexBoxProps>`
  display: flex;
  flex-wrap: wrap;
  ${gapWorkaround}
` as any
Flex.supportsGap = !gapWorkaround

Flex.Item = withStyles('div', { displayName: 'Flex.Item', styles: [flexItem] })<FlexItemProps>(
  flexItem
)

export default Flex
