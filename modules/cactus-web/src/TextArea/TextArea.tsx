import React from 'react'

import { CactusTheme } from '@repay/cactus-theme'
import { MarginProps, margins } from '../helpers/margins'
import { NotificationAlert, NotificationError, StatusCheck } from '@repay/cactus-icons'
import { Omit } from '../types'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

export type Status = 'success' | 'warning' | 'error'

interface TextAreaProps
  extends Omit<
      React.DetailedHTMLProps<
        React.TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
      >,
      'ref'
    >,
    MarginProps {
  disabled?: boolean
  status?: Status | null
  width?: string
  height?: string
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

const displayStatus = (props: TextAreaProps) => {
  if (props.status && !props.disabled) {
    return statusMap[props.status]
  }
}

const Area = styled.textarea<TextAreaProps>`
  border: 2px solid ${p => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.darkContrast)};
  border-radius: 8px;
  min-height: 100px;
  min-width: 336px;
  box-sizing: border-box;
  font-size: 18px;
  padding: 8px 16px;
  outline: none;
  background-color: ${p => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.white)};
  height: ${p => p.height || 'auto'};
  width: ${p => p.width || 'auto'};
  resize: none;

  &:focus {
    border-color: ${p => p.theme.colors.callToAction};
  }

  &::placeholder {
    color: ${p => p.theme.colors.mediumContrast};
    font-style: oblique;
  }

  ${displayStatus}
`

const StyledCheck = styled(StatusCheck)<StyledCheckProps>`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 8px;
  top: 8px;
  color: ${p => p.theme.colors.darkestContrast};
`

const StyledAlert = styled(NotificationAlert)<StyledAlertProps>`
  width: 24px;
  height: 24px;
  position: absolute;
  right: 8px;
  top: 8px;
  color: ${p => p.theme.colors.darkestContrast};
`

const StyledError = styled(NotificationError)<StyledErrorProps>`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 8px;
  top: 8px;
  color: ${p => p.theme.colors.darkestContrast};
`

const TextAreaBase = (props: TextAreaProps) => {
  const { disabled, status, className } = props

  return (
    <div className={className}>
      <Area {...props} />
      {status === 'success' && !disabled && <StyledCheck disabled={disabled} status={status} />}
      {status === 'warning' && !disabled && <StyledAlert disabled={disabled} status={status} />}
      {status === 'error' && !disabled && <StyledError disabled={disabled} status={status} />}
    </div>
  )
}

export const TextArea = styled(TextAreaBase)`
  position: relative;

  ${margins}
`

TextArea.defaultProps = {
  disabled: false,
  status: null,
}

export default TextArea
