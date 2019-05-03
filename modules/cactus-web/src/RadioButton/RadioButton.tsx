import React from 'react'
import styled from 'styled-components'
import { Omit } from '../types'
import { margins, splitProps, MarginProps } from '../helpers/margins'

interface RadioButtonProps
  extends Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'as'>,
    MarginProps {
  id: string
  name: string
  disabled?: boolean
}

interface StyledRadioButtonProps extends React.HTMLProps<HTMLSpanElement> {
  disabled?: boolean
}

const RadioButtonBase = (props: RadioButtonProps) => {
  const componentProps = splitProps<RadioButtonProps>(props)
  const { disabled, id, className, ...radioButtonProps } = componentProps
  return (
    <label className={className} htmlFor={id}>
      <HiddenRadioButton id={id} disabled={disabled} {...radioButtonProps} />
      <StyledRadioButton aria-hidden={true} disabled={disabled} />
    </label>
  )
}

const HiddenRadioButton = styled.input.attrs({ type: 'radio' as string })`
  opacity: 0;
  height: 0;
  width: 0;
  position: absolute;
`

const StyledRadioButton = styled.span<StyledRadioButtonProps>`
  display: inline-block;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${p => (p.disabled ? p.theme.colors.lightGray : 'none')};
  border: 2px solid ${p => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.base)};

  :after {
    position: absolute;
    content: '';
    display: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${p => !p.disabled && p.theme.colors.callToAction};
    margin: 2px 2px;
    box-sizing: border-box;
  }
`

export const RadioButton = styled(RadioButtonBase)`
  position: relative;
  display: inline-block;
  cursor: ${p => (p.disabled ? 'cursor' : 'pointer')};

  input:checked ~ span {
    border-color: ${p => !p.disabled && p.theme.colors.callToAction};
  }

  input:checked ~ span:after {
    display: block;
  }

  input:focus ~ span {
    box-shadow: 0 0 8px ${p => p.theme.colors.callToAction};
  }

  ${margins}
`

RadioButton.defaultProps = {
  disabled: false,
}

export default RadioButton
