import * as React from 'react'

import { Omit } from '../types'
import { StatusSpinner as SpinnerBase } from '@repay/cactus-icons'
import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

interface Props extends Omit<React.ComponentPropsWithRef<typeof SpinnerBase>, 'iconSize'> {
  iconSize?: 'tiny' | 'small' | 'medium' | 'large' | string
}

export const Spinner = styled(SpinnerBase as React.FC<Props>)`
  animation: ${rotate} 0.75s linear infinite;
`

Spinner.defaultProps = {
  iconSize: 'large',
}

export default Spinner
