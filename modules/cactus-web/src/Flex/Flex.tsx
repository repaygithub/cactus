import { CactusTheme } from '@repay/cactus-theme'
import { Property } from 'csstype'
import styled, { StyledComponentBase } from 'styled-components'
import { compose, ResponsiveValue, system } from 'styled-system'

import { Box, BoxProps } from '../Box/Box'
import { getOmittableProps } from '../helpers/omit'
import { flexContainer, flexItem, FlexItemProps, FlexProps, gapWorkaround } from '../helpers/styled'

export interface FlexBoxProps extends BoxProps, Omit<FlexProps, 'flexFlow'>, FlexItemProps {
  flexFlow?: ResponsiveValue<Property.FlexFlow>
}

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

// `flexContainer` includes a `flexFlow` version for components that aren't flex by
// default which sets `display: flex`, but we don't need that here so overwrite it.
const flexFlow = system({ flexFlow: true })
const styleProps = getOmittableProps(flexContainer, flexItem)
export const Flex: FlexComponent = styled(Box).withConfig({
  shouldForwardProp: (p) => !styleProps.has(p),
})<FlexBoxProps>`
  display: flex;
  flex-wrap: wrap;
  ${gapWorkaround}
  ${compose(flexContainer, flexItem, flexFlow)}
` as any
Flex.supportsGap = !gapWorkaround

const itemStyleProps = getOmittableProps(flexItem)
Flex.Item = styled.div.withConfig({
  shouldForwardProp: (p) => !itemStyleProps.has(p),
})<FlexItemProps>(flexItem)
Flex.Item.displayName = 'Flex.Item'

export default Flex
