import { NavigationClose } from '@repay/cactus-icons'
import { CactusTheme } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css, ThemeProps } from 'styled-components'
import { margin, MarginProps, width, WidthProps } from 'styled-system'

import Avatar from '../Avatar/Avatar'
import { flexItem, FlexItemProps } from '../helpers/flexItem'
import { omitProps } from '../helpers/omit'
import { boxShadow } from '../helpers/theme'
import IconButton from '../IconButton/IconButton'

export type Status = 'error' | 'warning' | 'info' | 'success'
export type Type = 'general' | 'push'

interface AlertProps extends FlexItemProps, React.HTMLAttributes<HTMLDivElement> {
  status?: Status
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void
  closeLabel?: string
}

interface AlertStyleProps extends AlertProps, MarginProps, WidthProps {
  type?: Type
  shadow?: boolean
}

const backgroundColor = (props: AlertProps & ThemeProps<CactusTheme>): string | undefined => {
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

const borderColor = (props: AlertProps & ThemeProps<CactusTheme>): string | undefined => {
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
    padding: ${(p): number => p.theme.space[4]}px;
  `,
  push: css`
    padding: 10px ${(p): number => p.theme.space[4]}px;
  `,
}

const typeVariant = (props: AlertStyleProps) => {
  const { type } = props
  if (type !== undefined) {
    return typeMap[type]
  }
}

const statusToVariantMap: { [K in Status]: 'success' | 'warning' | 'danger' | 'action' } = {
  success: 'success',
  warning: 'warning',
  error: 'danger',
  info: 'action',
}

const AlertBase = (props: AlertProps): React.ReactElement => {
  const { status = 'info', onClose, closeLabel, children, ...rest } = props

  return (
    <div {...rest}>
      <div>
        <Avatar status={status} type="alert" />
      </div>
      <div>{children}</div>
      {typeof onClose === 'function' && (
        <IconButton
          variant={statusToVariantMap[status]}
          onClick={onClose}
          iconSize="small"
          label={closeLabel}
        >
          <NavigationClose />
        </IconButton>
      )}
    </div>
  )
}

export const Alert = styled(AlertBase).withConfig(
  omitProps<AlertStyleProps>(
    margin,
    width,
    'type',
    'shadow',
    'flex',
    'flexBasis',
    'flexGrow',
    'flexShrink'
  )
)`
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: start;
  flex-wrap: nowrap;
  background: ${backgroundColor};
  border: 2px solid ${borderColor};
  ${typeVariant}
  ${(p): string => (p.shadow ? boxShadow(p.theme, 2) : '')};
  border-radius: 8px;
  ${margin}
  ${width}
  ${flexItem}

  div:first-child {
    flex: 0 0 auto;
  }

  div:nth-child(2) {
    margin-left: 16px;
    margin-right: 16px;
    margin-top: 8px;
    overflow-wrap: break-word;
    word-wrap: break-word;
    min-width: 1px;
  }

  ${IconButton} {
    flex-shrink: 0;
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
