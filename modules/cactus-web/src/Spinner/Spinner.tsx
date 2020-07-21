import { StatusSpinner as SpinnerBase } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import * as React from 'react'
import styled, { keyframes } from 'styled-components'

import { Omit } from '../types'

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

// @ts-ignore
Spinner.propTypes = {
  iconSize: PropTypes.oneOfType([
    PropTypes.oneOf(['tiny', 'small', 'medium', 'large']),
    PropTypes.string,
  ]),
}

Spinner.defaultProps = {
  iconSize: 'large',
}

export default Spinner
