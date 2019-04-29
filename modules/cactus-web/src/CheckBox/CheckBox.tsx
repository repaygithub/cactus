import React from 'react'
import styled from 'styled-components'
import { StatusCheck } from '@repay/cactus-icons'
import { Omit } from '../types'

interface CheckBoxProps extends Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'as'> {
  id: string
  disabled?: boolean
}

interface StyledCheckBoxProps extends React.HTMLProps<HTMLDivElement> {
  disabled?: boolean
}

interface CheckBoxContainerProps extends React.HTMLProps<HTMLLabelElement> {
  disabled?: boolean
}

const HiddenCheckBox = styled.input.attrs({ type: 'checkbox' as string })`
  opacity: 0;
  border: 0;
  width: 0;
  height: 0;
  position: absolute;
`

const StyledCheckBox = styled.div<StyledCheckBoxProps>`
  display: inline-block;
  box-sizing: border-box;
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid ${p => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.base)};
  background: ${p => (p.disabled ? p.theme.colors.lightGray : 'none')};
  border-radius: 1px;
  svg {
    visibility: hidden;
    display: block;
    color: ${p => p.theme.colors.white};
    width: 12px;
    height: 12px;
  }
`

const CheckBoxContainer = styled.label<CheckBoxContainerProps>`
  cursor: ${p => (p.disabled ? 'cursor' : 'pointer')};
  display: block;
  vertical-align: middle;
  position: relative;

  input:checked ~ div {
    border-color: ${p => !p.disabled && p.theme.colors.callToAction};
    background-color: ${p => !p.disabled && p.theme.colors.callToAction};
  }

  input:checked ~ div {
    svg {
      visibility: visible;
    }
  }

  input:focus ~ div {
    box-shadow: 0 0 8px ${p => p.theme.colors.callToAction};
  }
`

const CheckBox = (props: CheckBoxProps) => {
  const { disabled, id, ...checkBoxProps } = props
  return (
    <CheckBoxContainer disabled={disabled} htmlFor={id}>
      <HiddenCheckBox id={id} disabled={disabled} {...checkBoxProps} />
      <StyledCheckBox aria-hidden={true} disabled={disabled}>
        <StatusCheck />
      </StyledCheckBox>
    </CheckBoxContainer>
  )
}

CheckBox.defaultProps = {
  disabled: false,
}

export default CheckBox
