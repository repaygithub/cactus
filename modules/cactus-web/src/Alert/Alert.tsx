import React from 'react'

import { CactusTheme } from '@repay/cactus-theme'
import { margin, MarginProps, width, WidthProps } from 'styled-system'
import Avatar from '../Avatar/Avatar'
import IconButton from '../IconButton/IconButton'
import PropTypes from 'prop-types'
import styled, { css, ThemeProps } from 'styled-components'

import { NavigationClose } from '@repay/cactus-icons'

export type Status = 'error' | 'warning' | 'info' | 'success'
export type Type = 'general' | 'push'

interface AlertProps
  extends MarginProps,
    WidthProps,
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  status?: Status
  type?: Type
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  children?: React.ReactNode
  shadow?: boolean
  closeLabel?: string
}

const backgroundColor = (props: AlertProps & ThemeProps<CactusTheme>) => {
  const { status } = props
  switch (status) {
    case 'error':
      return props.theme.colors.status.avatar.error
    case 'warning':
      return props.theme.colors.status.avatar.warning
    case 'info':
      return props.theme.colors.white
    case 'success':
      return props.theme.colors.status.avatar.success
  }
}

const borderColor = (props: AlertProps & ThemeProps<CactusTheme>) => {
  const { status: status } = props
  switch (status) {
    case 'error':
      return props.theme.colors.error
    case 'warning':
      return props.theme.colors.warning
    case 'info':
      return props.theme.colors.callToAction
    case 'success':
      return props.theme.colors.success
  }
}

type TypeMap = { [K in Type]: ReturnType<typeof css> }
const typeMap: TypeMap = {
  general: css`
    width: 100%;
    padding: ${(p) => p.theme.space[4]}px;
  `,
  push: css`
    padding: 10px ${(p) => p.theme.space[4]}px;
  `,
}

const typeVariant = (props: AlertProps) => {
  const { type } = props
  if (type !== undefined) {
    return typeMap[type]
  }
}

const AlertBase = (props: AlertProps) => {
  const { className, status, onClose, closeLabel, children } = props

  return (
    <div className={className}>
      <div>
        <Avatar status={status} type="alert" />
      </div>
      <div>{children}</div>
      {typeof onClose === 'function' && (
        <IconButton onClick={onClose} iconSize="small" label={closeLabel}>
          <NavigationClose />
        </IconButton>
      )}
    </div>
  )
}

export const Alert = styled(AlertBase)<AlertProps>`
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: start;
  flex-wrap: nowrap;
  background: ${backgroundColor};
  border: 2px solid ${borderColor};
  ${typeVariant}
  box-shadow: ${(p) => p.shadow && `0 9px 24px ${p.theme.colors.callToAction};`};
  border-radius: 8px;
  ${margin}
  ${width}

  div:first-child {
    flex: 0 0 auto;
  }

  div:nth-child(2) {
    margin-left: 16px;
    margin-right: 16px;
    margin-top: 8px;
  }

  ${IconButton} {
    flex: 0;
    margin-left: auto;
    margin-top: 10px;
  }
`

// @ts-ignore
Alert.propTypes = {
  status: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  type: PropTypes.oneOf(['general', 'push']),
  onClose: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
  shadow: PropTypes.bool,
  closeLabel: PropTypes.string,
}

Alert.defaultProps = {
  status: 'info',
  type: 'general',
  shadow: false,
  closeLabel: 'close alert',
}

export default Alert
