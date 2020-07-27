import {
  NotificationAlert,
  NotificationError,
  NotificationInfo,
  StatusCheck,
} from '@repay/cactus-icons'
import { CactusTheme } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css, ThemeProps } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

export type AvatarType = 'alert' | 'feedback'
export type AvatarStatus = 'error' | 'warning' | 'info' | 'success'

interface AvatarProps extends MarginProps {
  type?: AvatarType
  status?: AvatarStatus
  disabled?: boolean
  className?: string
}

const avaColor = (props: AvatarProps & ThemeProps<CactusTheme>) => {
  const { type, status, disabled } = props

  if (status !== undefined) {
    if (disabled) {
      return css`
        color: ${props.theme.colors.white};
        background-color: ${props.theme.colors.mediumGray};
      `
    } else
      switch (type) {
        case 'alert':
          return status === 'info'
            ? props.theme.colorStyles.lightContrast
            : css`
                color: ${props.theme.colors.darkestContrast};
                background-color: ${props.theme.colors.status.avatar[status]};
              `
        case 'feedback':
          return status === 'info'
            ? props.theme.colorStyles.lightContrast
            : props.theme.colorStyles[status]
      }
  }
}

const getIcon = (status: AvatarStatus = 'info') => {
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

const AvatarBase = (props: AvatarProps) => {
  const { className, status } = props

  const Icon = getIcon(status)
  return (
    <div className={className}>
      <Icon iconSize="medium" />
    </div>
  )
}

export const Avatar = styled(AvatarBase)<AvatarProps>`
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

  ${margin}
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
