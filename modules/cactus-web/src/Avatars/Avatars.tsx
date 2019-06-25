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

export type AvatarUsage = 'alert' | 'feedBack'
export type AvatarType = 'error' | 'warning' | 'info' | 'success'

interface AvatarProps extends MarginProps {
  avatarUsage?: AvatarUsage
  avatarType?: AvatarType
  className?: string
}

type ColorMap = { [K in AvatarType]: FlattenInterpolation<ThemeProps<CactusTheme>> }
type UsageMap = { [K in AvatarUsage]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const avatar = (props: AvatarProps): FlattenInterpolation<ThemeProps<CactusTheme>> | undefined => {
  const { avatarUsage } = props
  if (avatarUsage !== undefined) {
    return usageMap[avatarUsage]
  }
}

const iconColor = (props: AvatarProps & ThemeProps<CactusTheme>) => {
  const { avatarType, avatarUsage } = props
  if (avatarUsage === 'feedBack' && (avatarType === 'error' || avatarType === 'success')) {
    return props.theme.colors.white
  } else {
    return props.theme.colors.darkGray
  }
}

const avaColor = (props: AvatarProps & ThemeProps<CactusTheme>) => {
  const { avatarUsage, avatarType } = props

  if (avatarUsage === 'alert') {
    switch (avatarType) {
      case 'error':
        return `hsla(353, 84%, 44%, 0.3)`
      case 'warning':
        return `hsla(47, 82%, 47%, 0.3)`
      case 'info':
        return props.theme.colors.lightContrast
      case 'success':
        return `hsla(145, 89%, 28%, 0.3)`
    }
  } else if (avatarUsage === 'feedBack') {
    switch (avatarType) {
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

const usageMap: UsageMap = {
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
  const { avatarType, avatarUsage } = props

  if (avatarType !== undefined) {
    return colorMap[avatarType]
  }
}

const getIcon = (avatarType: AvatarType = 'info') => {
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
  const { className, avatarType } = props

  const Icon = getIcon(avatarType)
  return (
    <div className={className}>
      <Icon iconSize="medium" />
    </div>
  )
}

export const Avatars = styled(AvatarBase)<AvatarProps>`
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

Avatars.defaultProps = {
  avatarUsage: 'feedBack',
  avatarType: 'info',
}

export default Avatars
