import React from 'react'
import styled from 'styled-components'
import { StatusCheck } from '@repay/cactus-icons'
import { Omit } from '../types'
import { splitProps, margins, MarginProps } from '../helpers/margins'

export interface CheckBoxProps
  extends Omit<
      React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
      'ref'
    >,
    MarginProps {
  id: string
  disabled?: boolean
}

interface StyledCheckBoxProps extends React.HTMLProps<HTMLDivElement> {
  disabled?: boolean
}

interface CheckBoxContainerProps
  extends React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {
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
  width: 16px;
  height: 16px;
  border: 2px solid ${p => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.darkestContrast)};
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

  ${margins}
`

const CheckBox = (props: CheckBoxProps) => {
  const [componentProps, marginProps] = splitProps<CheckBoxProps>(props)
  const { disabled, id, ...checkBoxProps } = componentProps
  return (
    <CheckBoxContainer disabled={disabled} htmlFor={id} {...marginProps}>
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
