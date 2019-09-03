import React from 'react'

import { margin, MarginProps } from 'styled-system'
import { NavigationClose, StatusCheck } from '@repay/cactus-icons'
import { Omit } from '../types'
import { omitMargins } from '../helpers/omit'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export interface ToggleProps
  extends Omit<
      React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
      'value' | 'ref'
    >,
    MarginProps {
  value?: boolean
  disabled?: boolean
}

const ToggleBase = (props: ToggleProps) => {
  const componentProps = omitMargins(props)
  const { value, ...toggleProps } = componentProps
  return (
    <button type="button" role="switch" aria-checked={value} {...toggleProps}>
      <StyledX aria-hidden="true" />
      <StyledCheck aria-hidden="true" />
    </button>
  )
}

const StyledX = styled(NavigationClose)`
  width: 12px;
  height: 12px;
  position: absolute;
  top: 3px;
  left: 25px;
  color: ${p => p.theme.colors.white};
`

const StyledCheck = styled(StatusCheck)`
  width: 15px;
  height: 15px;
  position: absolute;
  top: 1px;
  left: 5px;
  color: ${p => p.theme.colors.white};
`

export const Toggle = styled(ToggleBase)`
  position: relative;
  width: 45px;
  height: 20px;
  border-radius: 10px;
  outline: none;
  background-color: ${p => p.theme.colors.darkestContrast};
  border: 1px solid ${p => p.theme.colors.darkestContrast};
  cursor: ${p => (p.disabled ? 'cursor' : 'pointer')};

  &:focus {
    box-shadow: 0 0 8px ${p => p.theme.colors.callToAction};
  }

  ::after {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    content: '';
    top: 0;
    left: 0;
    position: absolute;
    transition: transform 0.3s;
    background-color: ${p => p.theme.colors.white};
  }

  &[aria-checked='true'] {
    background-color: ${p => p.theme.colors.callToAction};
    border-color: ${p => p.theme.colors.callToAction};

    ::after {
      transform: translateX(25px);
    }

    ${StyledX} {
      opacity: 0;
    }

    ${StyledCheck} {
      opacity: 1;
    }
  }

  ${StyledX} {
    opacity: 1;
    transition: opacity 0.3s;
  }

  ${StyledCheck} {
    opacity: 0;
    transition: opacity 0.3s;
  }

  &[disabled] {
    background-color: ${p => p.theme.colors.lightGray};
    border-color: ${p => p.theme.colors.lightGray};
  }

  ${margin}
`

// @ts-ignore
Toggle.propTypes = {
  value: PropTypes.bool,
  disabled: PropTypes.bool,
}

Toggle.defaultProps = {
  disabled: false,
}

export default Toggle
