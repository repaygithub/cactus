import { NavigationClose, StatusCheck } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { extractMargins } from '../helpers/omit'
import { boxShadow } from '../helpers/theme'

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
        <StyledX aria-hidden />
        <StyledCheck aria-hidden />
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
  margin: 0;
  z-index: 1;
  position: absolute;
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
  color: ${(p): string => p.theme.colors.white};
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
  color: ${(p): string => p.theme.colors.white};
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
  background-color: ${(p) => p.theme.colors.error};
  cursor: pointer;
  input:disabled ~ & {
    background-color: ${(p) => p.theme.colors.lightGray};
    cursor: cursor;
  }

  input:focus ~ & {
    ${(p): string => boxShadow(p.theme, 1)};
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
    background-color: ${(p): string => p.theme.colors.white};
    box-shadow: 0 0 3px ${(p): string => p.theme.colors.darkestContrast};
  }

  input:checked ~ & {
    ::after {
      left: 26px;
    }
  }

  input:checked:not([disabled]) ~ & {
    background-color: ${(p): string => p.theme.colors.success};
  }
`

Toggle.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
}

Toggle.defaultProps = {
  disabled: false,
}

// Enable use of `Toggle` as a styled-components CSS class.
Toggle.toString = Wrapper.toString
Toggle.displayName = 'Toggle'

export default Toggle
