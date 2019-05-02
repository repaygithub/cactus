import React from 'react'
import styled from 'styled-components'
import { StatusCheck, NavigationClose } from '@repay/cactus-icons'
import { Omit } from '../types'
import { margins, MarginProps } from '../helpers/margins'

export interface ToggleProps
  extends Omit<
      React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
      'value' | 'ref'
    >,
    MarginProps {
  value: boolean
  disabled?: boolean
}

const ToggleBase = (props: ToggleProps) => {
  const { value, ...toggleProps } = props
  return (
    <button type="button" aria-checked={value} {...toggleProps}>
      <StyledX />
      <StyledCheck />
    </button>
  )
}

const StyledX = styled(NavigationClose)`
  width: 16px;
  height: 16px;
  color: ${p => p.theme.colors.white};
`

const StyledCheck = styled(StatusCheck)`
  width: 16px;
  height: 16px;
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
    position: absolute;
    top: 1px;
    left: 22px;
    opacity: 1;
    transition: opacity 0.3s;
  }

  ${StyledCheck} {
    position: absolute;
    top: 1px;
    left: 5px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &[disabled] {
    background-color: ${p => p.theme.colors.lightGray};
    border-color: ${p => p.theme.colors.lightGray};
  }

  ${margins}
`

export default Toggle
