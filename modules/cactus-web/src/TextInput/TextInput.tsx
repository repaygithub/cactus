import React from 'react'
import styled, { FlattenInterpolation, ThemeProps, css } from 'styled-components'
import { CactusTheme } from '@repay/cactus-theme'
import { StatusCheck, NotificationAlert, NotificationError } from '@repay/cactus-icons'
import { Omit } from '../types'
import { margins, splitProps, MarginProps } from '../helpers/margins'

export type Status = 'success' | 'invalid' | 'error'

interface TextInputProps
  extends Omit<
      React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
      'ref'
    >,
    MarginProps {
  disabled?: boolean
  status?: Status | null
}

interface InputProps {
  disabled?: boolean
  status?: Status | null
}

interface StyledCheckProps {
  disabled?: boolean
  status?: Status | null
}

interface StyledAlertProps {
  disabled?: boolean
  status?: Status | null
}

interface StyledErrorProps {
  disabled?: boolean
  status?: Status | null
}

type StatusMap = { [K in Status]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const statusMap: StatusMap = {
  success: css`
    border-color: ${p => p.theme.colors.success};
  `,
  invalid: css`
    border-color: ${p => p.theme.colors.warning};
  `,
  error: css`
    border-color: ${p => p.theme.colors.error};
  `,
}

const displayStatus = (props: TextInputProps) => {
  if (props.status && !props.disabled) {
    return statusMap[props.status]
  }
}

const TextInputBase = (props: TextInputProps) => {
  const { disabled, status, className } = props

  return (
    <div className={className}>
      <Input {...props} />
      {status === 'success' && !disabled && <StyledCheck disabled={disabled} status={status} />}
      {status === 'invalid' && !disabled && <StyledAlert disabled={disabled} status={status} />}
      {status === 'error' && !disabled && <StyledError disabled={disabled} status={status} />}
    </div>
  )
}

const StyledCheck = styled(StatusCheck)<StyledCheckProps>`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 8px;
  color: ${p => p.theme.colors.success};
`

const StyledAlert = styled(NotificationAlert)<StyledAlertProps>`
  width: 24px;
  height: 24px;
  position: absolute;
  right: 8px;
  color: ${p => p.theme.colors.warning};
`

const StyledError = styled(NotificationError)<StyledErrorProps>`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 8px;
  color: ${p => p.theme.colors.error};
`

const Input = styled.input<InputProps>`
  border: 1px solid ${p => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.darkContrast)};
  border-radius: 20px;
  height: 32px;
  outline: none;
  box-sizing: border-box;
  padding: 7px 28px 7px 15px;
  font-size: 18px;
  width: ${p => p.width || 'auto'};
  background-color: ${p => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.white)};

  &:focus {
    border-color: ${p => p.theme.colors.callToAction};
  }

  &::placeholder {
    color: ${p => p.theme.colors.mediumContrast};
    font-style: oblique;
  }

  ${displayStatus}
`

export const TextInput = styled(TextInputBase)`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;

  ${margins}
`

TextInput.defaultProps = {
  disabled: false,
  status: null,
}

export default TextInput
