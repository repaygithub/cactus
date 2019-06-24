import { CactusTheme } from '@repay/cactus-theme'
import { MarginProps, margins } from '../helpers/margins'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

export type AvatarUsage = 'alert' | 'feedBack'
export type AvatarType = 'error' | 'warning' | 'info' | 'success'

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

export const Avatars = styled.div<AvatarProps>`
  ${margins}
  border-radius: 50%;
  ${variant}
  ${avatar}
`

Avatars.defaultProps = {
  avatarUsage: 'feedBack',
  avatarType: 'info',
}

export default Avatars
