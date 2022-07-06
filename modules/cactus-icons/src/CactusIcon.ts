import React from 'react'
import styled from 'styled-components'
import { color, compose, space, verticalAlign } from 'styled-system'

import iconSizes from './iconSizes'
import { IconStyleProps } from './types'

const AbstractIcon: React.FC = () => null

const styleFn = compose(space, color, verticalAlign, iconSizes)
const stylePropNames = new Set<string>()
styleFn.propNames?.forEach((propName) => stylePropNames.add(propName))

const CactusIcon = styled(AbstractIcon).withConfig({
  shouldForwardProp: (p) => !stylePropNames.has(p),
})<IconStyleProps>`
  vertical-align: middle;
  ${styleFn}
`

export default CactusIcon
