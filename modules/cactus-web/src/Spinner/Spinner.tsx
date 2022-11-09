import { StatusSpinner as SpinnerBase } from '@repay/cactus-icons'
import { iconSize } from '@repay/cactus-theme'
import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

export const Spinner = styled(SpinnerBase)`
  animation: ${rotate} 0.75s linear infinite;
  font-size: ${iconSize('large')};
`

export default Spinner
