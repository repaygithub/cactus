import { CactusTheme } from '@repay/cactus-theme'
import { MarginProps, margins } from '../helpers/margins'
import Avatar from '../Avatar/Avatar'
import IconButton from '../IconButton/IconButton'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

import { NavigationClose } from '@repay/cactus-icons'
import { width, WidthProps } from 'styled-system'

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

type TypeMap = { [K in Type]: FlattenInterpolation<ThemeProps<CactusTheme>> }
const typeMap: TypeMap = {
  general: css`
    width: 100%;
    padding: 24px 16px;
  `,
  push: css`
    padding: 10px 16px;
  `,
}

const typeVariant = (
  props: AlertProps
): FlattenInterpolation<ThemeProps<CactusTheme>> | undefined => {
  const { type } = props
  if (type !== undefined) {
    return typeMap[type]
  }
}

const AlertBase = (props: AlertProps) => {
  const { className, status, onClose, closeLabel } = props

  return (
    <div className={className}>
      <div>
        <Avatar status={status} type="alert" />
      </div>
      <div>{props.children}</div>
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
  box-shadow: ${p => p.shadow && `0 9px 24px ${p.theme.colors.callToAction};`};
  border-radius: 8px;
  ${margins}
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
