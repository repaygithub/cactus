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

interface StyledCheckBoxProps extends React.HTMLProps<HTMLSpanElement> {
  disabled?: boolean
}

const CheckBoxBase = (props: CheckBoxProps) => {
  const componentProps = splitProps<CheckBoxProps>(props)
  const { disabled, id, className, ...checkBoxProps } = componentProps
  return (
    <label className={className} htmlFor={id}>
      <HiddenCheckBox id={id} disabled={disabled} {...checkBoxProps} />
      <StyledCheckBox aria-hidden={true} disabled={disabled}>
        <StatusCheck />
      </StyledCheckBox>
    </label>
  )
}

const HiddenCheckBox = styled.input.attrs({ type: 'checkbox' as string })`
  opacity: 0;
  border: 0;
  width: 0;
  height: 0;
  position: absolute;
`

const StyledCheckBox = styled.span<StyledCheckBoxProps>`
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

export const CheckBox = styled(CheckBoxBase)`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  cursor: ${p => (p.disabled ? 'cursor' : 'pointer')};
  input:checked ~ span {
    border-color: ${p => !p.disabled && p.theme.colors.callToAction};
    background-color: ${p => !p.disabled && p.theme.colors.callToAction};
  }

  input:checked ~ span {
    svg {
      visibility: visible;
    }
  }

  input:focus ~ span {
    box-shadow: 0 0 8px ${p => p.theme.colors.callToAction};
  }

  ${margins}
`

CheckBox.defaultProps = {
  disabled: false,
}

export default CheckBox
