import { CactusTheme } from '@repay/cactus-theme'
import { MarginProps, margins } from '../helpers/margins'
import {
  NotificationAlert,
  NotificationError,
  NotificationInfo,
  StatusCheck,
} from '@repay/cactus-icons'
import React from 'react'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

export type AvatarType = 'alert' | 'feedBack'
export type AvatarStatus = 'error' | 'warning' | 'info' | 'success'

interface AvatarProps extends MarginProps {
  type?: AvatarType
  status?: AvatarStatus
  className?: string
}

type ColorMap = { [K in AvatarStatus]: FlattenInterpolation<ThemeProps<CactusTheme>> }
type TypeMap = { [K in AvatarType]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const avatar = (props: AvatarProps): FlattenInterpolation<ThemeProps<CactusTheme>> | undefined => {
  const { type: type } = props
  if (type !== undefined) {
    return typeMap[type]
  }
}

const iconColor = (props: AvatarProps & ThemeProps<CactusTheme>) => {
  const { status: status, type: type } = props
  if (type === 'feedBack' && (status === 'error' || status === 'success')) {
    return props.theme.colors.white
  } else {
    return props.theme.colors.darkGray
  }
}

const avaColor = (props: AvatarProps & ThemeProps<CactusTheme>) => {
  const { type: type, status: status } = props

  if (type === 'alert') {
    switch (status) {
      case 'error':
        return props.theme.colors.status.avatar.error
      case 'warning':
        return props.theme.colors.status.avatar.warning
      case 'info':
        return props.theme.colors.lightContrast
      case 'success':
        return props.theme.colors.status.avatar.success
    }
  } else if (type === 'feedBack') {
    switch (status) {
      case 'error':
        return props.theme.colors.error
      case 'warning':
        return props.theme.colors.warning
      case 'info':
        return props.theme.colors.lightContrast
      case 'success':
        return props.theme.colors.success
    }
  }
}

const typeMap: TypeMap = {
  alert: css`
    color: ${p => p.theme.colors.darkGray};
  `,
  feedBack: css`
    color: ${iconColor};
  `,
}

const colorMap: ColorMap = {
  error: css`
    background: ${avaColor};
  `,
  warning: css`
    background: ${avaColor};
  `,
  info: css`
    background: ${avaColor};
  `,
  success: css`
    background: ${avaColor};
  `,
}

const variant = (props: AvatarProps): FlattenInterpolation<ThemeProps<CactusTheme>> | undefined => {
  const { status: avatarType } = props

  if (avatarType !== undefined) {
    return colorMap[avatarType]
  }
}

const getIcon = (avatarType: AvatarStatus = 'info') => {
  switch (avatarType) {
    case 'error':
      return NotificationError
    case 'warning':
      return NotificationAlert
    case 'info':
      return NotificationInfo
    case 'success':
      return StatusCheck
  }
}

const AvatarBase = (props: AvatarProps) => {
  const { className, status: avatarType } = props

  const Icon = getIcon(avatarType)
  return (
    <div className={className}>
      <Icon iconSize="medium" />
    </div>
  )
}

export const Avatar = styled(AvatarBase)<AvatarProps>`
  ${margins}
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  ${variant}
  ${avatar}
  ${NotificationError} {
    padding-bottom: 4px;
  }
`

Avatar.defaultProps = {
  type: 'feedBack',
  status: 'info',
}

export default Avatar
