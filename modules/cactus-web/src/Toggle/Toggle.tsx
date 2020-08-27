import { NavigationClose, StatusCheck } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { omitMargins } from '../helpers/omit'
import { boxShadow } from '../helpers/theme'
import { Omit } from '../types'

export interface ToggleProps
  extends Omit<
      React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
      'value' | 'ref'
    >,
    MarginProps {
  value?: boolean
  disabled?: boolean
}

const ToggleBase = (props: ToggleProps): React.ReactElement => {
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
  top: 6px;
  right: 8px;
  color: ${(p): string => p.theme.colors.white};
`

const StyledCheck = styled(StatusCheck)`
  width: 15px;
  height: 15px;
  position: absolute;
  top: 4px;
  left: 5px;
  color: ${(p): string => p.theme.colors.white};
`

export const Toggle = styled(ToggleBase)`
  position: relative;
  width: 51px;
  height: 26px;
  border-radius: 13px;
  outline: none;
  background-color: ${(p): string =>
    p.disabled ? p.theme.colors.lightGray : p.theme.colors.error};
  border: 1px solid ${(p): string => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.error)};
  cursor: ${(p): string => (p.disabled ? 'cursor' : 'pointer')};

  &:focus {
    ${(p): string => boxShadow(p.theme, 1)};
  }

  ::after {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    content: '';
    top: -1px;
    left: -1px;
    position: absolute;
    transition: transform 0.3s;
    background-color: ${(p): string => p.theme.colors.white};
    box-shadow: 0 0 3px ${(p): string => p.theme.colors.darkestContrast};
  }

  &[aria-checked='true'] {
    background-color: ${(p): string => p.theme.colors.success};
    border-color: ${(p): string => p.theme.colors.success};

    ::after {
      transform: translateX(26px);
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
    opacity: 0.5;
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
