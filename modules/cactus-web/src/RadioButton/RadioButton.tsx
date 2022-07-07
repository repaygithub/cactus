import { color, shadow } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { omitMargins } from '../helpers/omit'

export interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement>, MarginProps {
  id?: string
  name: string
  disabled?: boolean
}

interface StyledRadioButtonProps extends React.HTMLProps<HTMLSpanElement> {
  disabled?: boolean
}

const RadioButtonBase = React.forwardRef<HTMLInputElement, RadioButtonProps>((props, ref) => {
  const componentProps = omitMargins(props) as Omit<RadioButtonProps, keyof MarginProps>
  const { id, className, ...radioButtonProps } = componentProps
  return (
    <label className={className} htmlFor={id}>
      <HiddenRadioButton ref={ref} id={id} {...radioButtonProps} />
      <StyledRadioButton aria-hidden={true} />
    </label>
  )
})

const HiddenRadioButton = styled.input.attrs({ type: 'radio' as string })`
  opacity: 0;
  height: 0;
  width: 0;
  margin: 0;
  position: absolute;
`

const StyledRadioButton = styled.span<StyledRadioButtonProps>`
  display: inline-block;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: transparent;
  border: 2px solid ${color('base')};

  ::after {
    position: absolute;
    content: '';
    display: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${color('callToAction')};
    margin: 2px 2px;
    box-sizing: border-box;
  }
`

export const RadioButton = styled(RadioButtonBase)`
  position: relative;
  display: inline-block;
  vertical-align: -1px;
  line-height: 16px;
  width: 16px;
  height: 16px;
  cursor: ${(p): string => (p.disabled ? 'cursor' : 'pointer')};

  input:checked ~ span {
    border-color: ${color('callToAction')};
    &::after {
      display: block;
    }
  }

  input:focus ~ span {
    ${shadow(1)}
  }

  input:disabled ~ span {
    background-color: ${color('lightGray')};
    border-color: ${color('lightGray')};
    &::after {
      background-color: ${color('lightGray')};
    }
  }

  ${margin}
`

RadioButton.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
}

export default RadioButton
