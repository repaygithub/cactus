import React from 'react'
import styled, { FlattenInterpolation, ThemeProps, css } from 'styled-components'
import { CactusTheme } from '@repay/cactus-theme'
import { StatusCheck, NotificationAlert, NotificationError } from '@repay/cactus-icons'

export type Status = 'success' | 'invalid' | 'error'

interface TextInputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'as'> {
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

const StyledCheck = styled(StatusCheck)<StyledCheckProps>`
  width: 20px;
  height: 20px;
  position: relative;
  left: -28px;
  opacity: ${p => (p.status === 'success' && !p.disabled ? '1' : '0')};
  color: ${p => p.theme.colors.success};
`

const StyledAlert = styled(NotificationAlert)<StyledAlertProps>`
  width: 24px;
  height: 24px;
  position: relative;
  left: -50px;
  opacity: ${p => (p.status === 'invalid' && !p.disabled ? '1' : '0')};
  color: ${p => p.theme.colors.warning};
`

const StyledError = styled(NotificationError)<StyledErrorProps>`
  width: 20px;
  height: 20px;
  position: relative;
  left: -72px;
  opacity: ${p => (p.status === 'error' && !p.disabled ? '1' : '0')};
  color: ${p => p.theme.colors.error};
`

const TextInputContainer = styled.div`
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Input = styled.input<InputProps>`
  display: block;
  position: relative;
  border: 1px solid ${p => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.darkContrast)};
  border-radius: 20px;
  height: 32px;
  outline: none;
  box-sizing: border-box;
  padding: 7px 18px;
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

const TextInput = (props: TextInputProps) => {
  const { disabled, status } = props
  return (
    <TextInputContainer>
      <Input {...props} />
      <StyledCheck disabled={disabled} status={status} />
      <StyledAlert disabled={disabled} status={status} />
      <StyledError disabled={disabled} status={status} />
    </TextInputContainer>
  )
}

export default TextInput
