import {
  NotificationAlert,
  NotificationError,
  NotificationInfo,
  StatusCheck,
} from '@repay/cactus-icons'
import { CactusTheme, ColorStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import { css, ThemeProps } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { withStyles } from '../helpers/styled'

export type AvatarType = 'alert' | 'feedback'
export type AvatarStatus = 'error' | 'warning' | 'info' | 'success'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: AvatarStatus
}

interface AvatarStyleProps extends AvatarProps, MarginProps {
  type?: AvatarType
  disabled?: boolean
}

const avaColor = (
  props: AvatarStyleProps & ThemeProps<CactusTheme>
): ReturnType<typeof css> | ColorStyle | undefined => {
  const { type, status, disabled } = props

  if (status !== undefined) {
    if (disabled) return props.theme.colorStyles.disable
    if (status === 'info') return props.theme.colorStyles.lightContrast

    switch (type) {
      case 'alert':
        return css`
          color: ${(p): string => p.theme.colors.darkestContrast};
          background-color: ${(p): string => p.theme.colors.status.avatar[status]};
        `
      case 'feedback':
        return props.theme.colorStyles[status]
    }
  }
}

const getIcon = (status: AvatarStatus = 'info'): typeof NotificationError => {
  switch (status) {
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

const AvatarBase = (props: AvatarProps): React.ReactElement => {
  const { status, ...rest } = props

  const Icon = getIcon(status)
  return (
    <div {...rest}>
      <Icon iconSize="medium" />
    </div>
  )
}

export const Avatar = withStyles('div', {
  as: AvatarBase,
  displayName: 'Avatar',
  styles: [margin],
  transitiveProps: ['type', 'disabled'],
})<AvatarStyleProps>`
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  ${NotificationError} {
    padding-bottom: 4px;
  }

  ${avaColor}
`

Avatar.propTypes = {
  type: PropTypes.oneOf(['alert', 'feedback']),
  status: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
}

Avatar.defaultProps = {
  type: 'feedback',
  status: 'info',
}

export default Avatar
