import React from 'react'
import styled from 'styled-components'
import { Omit } from '../types'

interface RadioButtonProps extends Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'as'> {
  id: string
  name: string
  disabled?: boolean
}

interface RadioButtonContainerProps extends React.HTMLProps<HTMLLabelElement> {
  disabled?: boolean
}

interface StyledRadioButtonProps extends React.HTMLProps<HTMLDivElement> {
  disabled?: boolean
}

const RadioButtonContainer = styled.label<RadioButtonContainerProps>`
  cursor: ${p => (p.disabled ? 'cursor' : 'pointer')};
  display: block;
  position: relative;

  input:checked ~ div {
    border-color: ${p => !p.disabled && p.theme.colors.callToAction};
  }

  input:checked ~ div:after {
    display: block;
  }

  input:focus ~ div {
    box-shadow: 0 0 8px ${p => p.theme.colors.callToAction};
  }
`

const HiddenRadioButton = styled.input.attrs({ type: 'radio' as string })`
  opacity: 0;
  height: 0;
  width: 0;
  position: absolute;
`

const StyledRadioButton = styled.div<StyledRadioButtonProps>`
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

const RadioButton = (props: RadioButtonProps) => {
  const { disabled, id, ...radioButtonProps } = props
  return (
    <RadioButtonContainer htmlFor={id} disabled={disabled}>
      <HiddenRadioButton id={id} disabled={disabled} {...radioButtonProps} />
      <StyledRadioButton aria-hidden={true} disabled={disabled} />
    </RadioButtonContainer>
  )
}

export default RadioButton
