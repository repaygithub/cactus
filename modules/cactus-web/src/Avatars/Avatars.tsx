import { CactusTheme } from '@repay/cactus-theme'
import { MarginProps, margins } from '../helpers/margins'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

export type AvatarUsage = 'alert' | 'feedBack'
export type AvatarType =
  | 'NotificationError'
  | 'NotificationAlert'
  | 'NotificationInfo'
  | 'StatusCheck'

interface AvatarProps extends MarginProps {
  avatarUsage?: AvatarUsage
  avatarType?: AvatarType
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
  if (
    avatarUsage === 'feedBack' &&
    (avatarType === 'NotificationError' || avatarType === 'StatusCheck')
  ) {
    return props.theme.colors.white
  } else {
    return props.theme.colors.darkGray
  }
}

const avaColor = (props: AvatarProps & ThemeProps<CactusTheme>) => {
  const { avatarUsage, avatarType } = props

  if (avatarUsage === 'alert') {
    switch (avatarType) {
      case 'NotificationError':
        return `hsla(353, 84%, 44%, 0.3)`
      case 'NotificationAlert':
        return `hsla(47, 82%, 47%, 0.3)`
      case 'NotificationInfo':
        return props.theme.colors.lightContrast
      case 'StatusCheck':
        return `hsla(145, 89%, 28%, 0.3)`
    }
  } else if (avatarUsage === 'feedBack') {
    switch (avatarType) {
      case 'NotificationError':
        return props.theme.colors.error
      case 'NotificationAlert':
        return props.theme.colors.warning
      case 'NotificationInfo':
        return props.theme.colors.lightContrast
      case 'StatusCheck':
        return props.theme.colors.success
    }
  }
}

const usageMap: UsageMap = {
  alert: css`
    width: 40px;
    height: 40px;
    color: ${p => p.theme.colors.darkGray};
  `,
  feedBack: css`
    width: 40px;
    height: 40px;
    color: ${iconColor};
  `,
}

const colorMap: ColorMap = {
  NotificationError: css`
    background: ${avaColor};
  `,
  NotificationAlert: css`
    background: ${avaColor};
  `,
  NotificationInfo: css`
    background: ${avaColor};
  `,
  StatusCheck: css`
    background: ${avaColor};
  `,
}

const variant = (props: AvatarProps): FlattenInterpolation<ThemeProps<CactusTheme>> | undefined => {
  const { avatarType, avatarUsage } = props

  if (avatarType !== undefined) {
    return colorMap[avatarType]
  }
}

export const Avatars = styled.div<AvatarProps>`
  ${margins}
  border-radius: 50%;
  ${variant}
  ${avatar}
`

Avatars.defaultProps = {
  avatarUsage: 'feedBack',
  avatarType: 'NotificationInfo',
}

export default Avatars
