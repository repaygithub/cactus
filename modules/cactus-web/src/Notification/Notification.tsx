import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components'

import { ScreenSize, SIZES, useScreenSize } from '../ScreenSizeProvider/ScreenSizeProvider'

interface Position {
  vertical: 'top' | 'bottom'
  horizontal: 'left' | 'center' | 'right'
}

interface NotificationProps {
  open: boolean
  position?: Position
}

interface NotificationWrapperProps {
  $position: Position
  $spacing: number
}

const getNotificationPosition = (props: NotificationWrapperProps): ReturnType<typeof css> => {
  const { $position, $spacing } = props
  return css`
    ${$position.vertical}: ${$spacing}px;
    ${$position.horizontal === 'center'
      ? `left: 50%; transform: translateX(-50%);`
      : `${$position.horizontal}: ${$spacing}px`}
  `
}

const NotificationWrapper = styled.div<NotificationWrapperProps>`
  position: fixed;
  z-index: 100;
  background-color: ${(p) => p.theme.colors.white};

  ${getNotificationPosition}
`

export const Notification: React.FC<NotificationProps> = ({
  open,
  position,
  children,
  ...rest
}) => {
  const screenSize = useScreenSize()

  const getPosition = (): Position => {
    return position
      ? position
      : screenSize === SIZES.tiny
      ? { vertical: 'bottom', horizontal: 'center' }
      : { vertical: 'bottom', horizontal: 'left' }
  }

  const getSpacing = (screenSize: ScreenSize): number => {
    return screenSize === SIZES.extraLarge ||
      screenSize === SIZES.large ||
      screenSize === SIZES.medium
      ? 40
      : screenSize === SIZES.small
      ? 24
      : 16
  }
  return open ? (
    <NotificationWrapper $position={getPosition()} $spacing={getSpacing(screenSize)} {...rest}>
      {children}
    </NotificationWrapper>
  ) : null
}

Notification.displayName = 'Notification'
Notification.propTypes = {
  open: PropTypes.bool.isRequired,
  position: PropTypes.shape({
    vertical: PropTypes.oneOf<'top' | 'bottom'>(['top', 'bottom']).isRequired,
    horizontal: PropTypes.oneOf<'left' | 'center' | 'right'>(['left', 'center', 'right'])
      .isRequired,
  }),
}

export default Notification
