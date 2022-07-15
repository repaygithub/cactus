import React from 'react'
import styled from 'styled-components'
import { color, compose, space, verticalAlign } from 'styled-system'

import iconSizes from './iconSizes'
import { IconStyleProps } from './types'

const NullIcon: React.FC = () => null

const styleFn = compose(space, color, verticalAlign, iconSizes)
const stylePropNames = new Set<string>()
styleFn.propNames?.forEach((propName) => stylePropNames.add(propName))

// Naming it this way so the generated CSS class will start with "CactusIcon-".
const CactusIcon = styled(NullIcon).withConfig({
  shouldForwardProp: (p) => !stylePropNames.has(p),
})<IconStyleProps>`
  vertical-align: middle;
  ${styleFn}
`
CactusIcon.displayName = 'AbstractIcon'

export default CactusIcon
