import React from 'react'

import { CactusTheme } from '@repay/cactus-theme'
import { MarginProps, margins } from '../helpers/margins'
import { NotificationAlert, NotificationError, StatusCheck } from '@repay/cactus-icons'
import { Omit } from '../types'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

export type Status = 'success' | 'warning' | 'error'

export interface TextInputProps
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
    background: ${p => p.theme.colors.transparentSuccess};
  `,
  warning: css`
    border-color: ${p => p.theme.colors.warning};
    background: ${p => p.theme.colors.transparentWarning};
  `,
  error: css`
    border-color: ${p => p.theme.colors.error};
    background: ${p => p.theme.colors.transparentError};
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
      {status === 'warning' && !disabled && <StyledAlert disabled={disabled} status={status} />}
      {status === 'error' && !disabled && <StyledError disabled={disabled} status={status} />}
    </div>
  )
}

const StyledCheck = styled(StatusCheck)<StyledCheckProps>`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 8px;
  color: ${p => p.theme.colors.darkestContrast};
`

const StyledAlert = styled(NotificationAlert)<StyledAlertProps>`
  width: 24px;
  height: 24px;
  position: absolute;
  right: 8px;
  color: ${p => p.theme.colors.darkestContrast};
`

const StyledError = styled(NotificationError)<StyledErrorProps>`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 8px;
  color: ${p => p.theme.colors.darkestContrast};
`

const Input = styled.input<InputProps>`
  border: 2px solid ${p => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.darkContrast)};
  border-radius: 20px;
  height: 36px;
  outline: none;
  box-sizing: border-box;
  padding: 7px 28px 7px 15px;
  font-size: ${p => p.theme.textStyles.medium.fontSize};
  line-height: ${p => p.theme.textStyles.medium.lineHeight};
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
