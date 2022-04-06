import { CactusTheme } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css, ThemedStyledProps } from 'styled-components'

import { ScreenSize, SIZES, useScreenSize } from '../ScreenSizeProvider/ScreenSizeProvider'

type Vertical = 'top' | 'bottom'
type Horizontal = 'left' | 'center' | 'right'

export interface NotificationPositionProps {
  vertical?: Vertical
  horizontal?: Horizontal
}

interface NotificationProps extends NotificationPositionProps {
  open: boolean
}

interface NotificationWrapperProps {
  $vertical: Vertical
  $horizontal: Horizontal
  $screenSize: ScreenSize
}

const getNotificationPosition = (
  props: ThemedStyledProps<NotificationWrapperProps, CactusTheme>
): ReturnType<typeof css> => {
  const { $vertical, $horizontal, $screenSize, theme } = props

  const spacingIndex = $screenSize === SIZES.tiny ? 4 : $screenSize === SIZES.small ? 5 : 7

  return css`
    ${$vertical}: ${theme.space[spacingIndex]}px;
    ${$horizontal === 'center'
      ? `left: 50%; transform: translateX(-50%);`
      : `${$horizontal}: ${theme.space[spacingIndex]}px`}
  `
}

const NotificationWrapper = styled.div<NotificationWrapperProps>`
  position: fixed;
  z-index: 100;
  background-color: ${(p) => p.theme.colors.white};
  border-radius: 8px;

  ${getNotificationPosition}
`

export const Notification: React.FC<NotificationProps> = ({
  open,
  vertical = 'bottom',
  horizontal,
  children,
  ...rest
}) => {
  const screenSize = useScreenSize()

  if (!horizontal) {
    horizontal = screenSize === SIZES.tiny ? 'center' : 'right'
  }

  return open ? (
    <NotificationWrapper
      $vertical={vertical}
      $horizontal={horizontal}
      $screenSize={screenSize}
      {...rest}
    >
      {children}
    </NotificationWrapper>
  ) : null
}

Notification.displayName = 'Notification'
Notification.propTypes = {
  open: PropTypes.bool.isRequired,
  vertical: PropTypes.oneOf<Vertical>(['top', 'bottom']),
  horizontal: PropTypes.oneOf<Horizontal>(['left', 'center', 'right']),
}

export default Notification
