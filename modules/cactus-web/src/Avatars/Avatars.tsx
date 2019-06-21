import { CactusTheme } from '@repay/cactus-theme'
import { MarginProps, margins } from '../helpers/margins'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

export type AvatarUsage = 'alert' | 'feedBack' | 'steps'
export type AvatarColor =
  | 'NotificationError'
  | 'NotificationAlert'
  | 'NotificationInfo'
  | 'StatusCheck'
export type AvatarStep = 'notDone' | 'inProcess' | 'done'
export type CurrentStep = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

interface AvatarProps extends MarginProps {
  avatarUsage?: AvatarUsage
  avatarColor?: AvatarColor
  avatarStep?: AvatarStep
  stepNumber?: CurrentStep
}

type ColorMap = { [K in AvatarColor]: FlattenInterpolation<ThemeProps<CactusTheme>> }
type UsageMap = { [K in AvatarUsage]: FlattenInterpolation<ThemeProps<CactusTheme>> }
type StepColor = { [K in AvatarStep]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const avatar = (props: AvatarProps): FlattenInterpolation<ThemeProps<CactusTheme>> | undefined => {
  const { avatarUsage, avatarColor } = props

  if (avatarUsage !== undefined) {
    return usageMap[avatarUsage]
  }
}

const iconColor = (props: AvatarProps & ThemeProps<CactusTheme>) => {
  const { avatarColor, avatarUsage } = props
  if (
    avatarUsage === 'feedBack' &&
    (avatarColor === 'NotificationError' || avatarColor === 'StatusCheck')
  ) {
    return props.theme.colors.white
  } else {
    return props.theme.colors.darkGray
  }
}

const avaColor = (props: AvatarProps & ThemeProps<CactusTheme>) => {
  const { avatarUsage, avatarColor } = props

  if (avatarUsage === 'alert') {
    switch (avatarColor) {
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
    switch (avatarColor) {
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
  steps: css`
    width: 48px;
    height: 48px;
    font-size: ${p => p.theme.textStyles.h2.fontSize};
    font-weight: 400px;
    text-align: center;
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

const stepColorMap: StepColor = {
  notDone: css`
    background: ${p => p.theme.colors.lightContrast};
    color: ${p => p.theme.colors.darkestContrast};
  `,
  inProcess: css`
    background: ${p => p.theme.colors.callToAction};
    color: ${p => p.theme.colors.white};
  `,
  done: css`
    background: ${p => p.theme.colors.base};
    color: ${p => p.theme.colors.white};
  `,
}

const variant = (props: AvatarProps): FlattenInterpolation<ThemeProps<CactusTheme>> | undefined => {
  const { avatarColor, avatarUsage, avatarStep } = props
  if (avatarUsage === 'steps') {
    // @ts-ignore
    return stepColorMap[avatarStep]
  }
  if (avatarColor !== undefined) {
    return colorMap[avatarColor]
  }
}

export const Avatars = styled.div<AvatarProps>`
  ${margins}
  border-radius: 50%;
  ${variant}
  ${avatar}
`

export default Avatars
