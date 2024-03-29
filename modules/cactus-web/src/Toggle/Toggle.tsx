import { NavigationClose, StatusCheck } from '@repay/cactus-icons'
import { boxShadow, color, shadow } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { extractMargins } from '../helpers/omit'

export interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement>, MarginProps {
  checked?: boolean
  disabled?: boolean
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, ...props }, ref) => {
    const marginProps = extractMargins(props)
    return (
      <Wrapper {...marginProps} className={className} role="none">
        <Checkbox {...props} role="switch" aria-checked={props.checked} ref={ref} />
        <Switch aria-hidden />
        <StyledX aria-hidden color="white" />
        <StyledCheck aria-hidden color="white" />
      </Wrapper>
    )
  }
)

const Checkbox = styled.input.attrs({ type: 'checkbox' as string })`
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  opacity: 0;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;
  :disabled {
    cursor: not-allowed;
  }
`

const StyledX = styled(NavigationClose)`
  width: 12px;
  height: 12px;
  position: absolute;
  top: 7px;
  right: 9px;
  opacity: 1;
  transition: opacity 0.3s;
  input:checked ~ & {
    opacity: 0;
  }
`

const StyledCheck = styled(StatusCheck)`
  width: 15px;
  height: 15px;
  position: absolute;
  top: 5px;
  left: 6px;
  opacity: 0;
  transition: opacity 0.3s;
  input:checked ~ & {
    opacity: 1;
  }
`

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 51px;
  height: 26px;
  box-sizing: border-box;
  padding: 0;
  border: none;
  outline: none;
  ${margin}
`

const Switch = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 13px;
  background-color: ${color('error')};
  cursor: pointer;
  input:disabled ~ & {
    background-color: ${color('lightGray')};
    cursor: cursor;
  }

  input:focus ~ & {
    ${shadow(1)};
  }

  ::after {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    content: '';
    top: 0;
    left: 0;
    position: absolute;
    transition: left 0.3s;
    background-color: ${color('white')};
    ${boxShadow(0, 'darkestContrast')};
  }

  input:checked ~ & {
    ::after {
      left: 26px;
    }
  }

  input:checked:not(:disabled) ~ & {
    background-color: ${color('success')};
  }
`

Toggle.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
}

// Enable use of `Toggle` as a styled-components CSS class.
Toggle.toString = Wrapper.toString
Toggle.displayName = 'Toggle'

export default Toggle
