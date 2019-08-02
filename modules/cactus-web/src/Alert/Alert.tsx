import { CactusTheme } from '@repay/cactus-theme'
import { MarginProps, margins } from '../helpers/margins'
import Avatar from '../Avatar/Avatar'
import Flex from '../Flex/Flex'
import Grid from '../Grid/Grid'
import IconButton from '../IconButton/IconButton'
import React from 'react'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

import { NavigationClose } from '@repay/cactus-icons'

export type Status = 'error' | 'warning' | 'info' | 'success'
export type Type = 'general' | 'push'

interface AlertProps
  extends MarginProps,
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  status?: Status
  type?: Type
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  children?: React.ReactNode
  shadow?: boolean
  closeLabel?: string
}

type StatusMap = { [K in Status]: FlattenInterpolation<ThemeProps<CactusTheme>> }
type TypeMap = { [K in Type]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const backgroundColor = (props: AlertProps & ThemeProps<CactusTheme>) => {
  const { status: status } = props
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

const backgroundMap: StatusMap = {
  error: css`
    background: ${backgroundColor};
    border: 2px solid ${borderColor};
  `,
  warning: css`
    background: ${backgroundColor};
    border: 2px solid ${borderColor};
  `,
  info: css`
    background: ${backgroundColor};
    border: 2px solid ${borderColor};
  `,
  success: css`
    background: ${backgroundColor};
    border: 2px solid ${borderColor};
  `,
}

const typeMap: TypeMap = {
  general: css`
    min-height: 88px;
  `,
  push: css`
    min-height: 60px;
  `,
}

const backgroundVariant = (
  props: AlertProps
): FlattenInterpolation<ThemeProps<CactusTheme>> | undefined => {
  const { status: status } = props
  if (status !== undefined) {
    return backgroundMap[status]
  }
}

const sizeVariant = (
  props: AlertProps
): FlattenInterpolation<ThemeProps<CactusTheme>> | undefined => {
  const { type: type } = props
  if (type !== undefined) {
    return typeMap[type]
  }
}

const AvatarBase = styled(Avatar)`
  margin: 10px 10px;
`
const closeButton = (onClose: any, closeLabel: string) => {
  return (
    <Flex justifyContent="flex-end">
      <Grid.Item tiny={1}>
        <IconButton
          onClick={onClose}
          style={{ marginTop: '20px', marginRight: '20px' }}
          iconSize="small"
          label={closeLabel}
        >
          <NavigationClose />
        </IconButton>
      </Grid.Item>
    </Flex>
  )
}

const AlertBase = (props: AlertProps) => {
  const {
    className,
    type: type,
    status: status,
    onClose: onClose,
    closeLabel = 'close alert',
  } = props
  const margin = type === 'push' ? '0px' : '15px'
  const messageWidth = onClose ? 10 : 11

  return (
    <div className={className}>
      <Grid marginTop={margin}>
        <Flex justifyContent="center">
          <Grid.Item tiny={1}>
            <AvatarBase status={status} type="alert" />
          </Grid.Item>
        </Flex>
        <Grid.Item tiny={messageWidth}>
          <div style={{ margin: '15px 0' }}>{props.children} </div>
        </Grid.Item>
        {onClose ? closeButton(onClose, closeLabel) : null}
      </Grid>
    </div>
  )
}

export const Alert = styled(AlertBase)<AlertProps>`
  ${margins}
  ${backgroundVariant}
  ${sizeVariant}
  box-shadow: ${p => p.shadow && `0 9px 24px ${p.theme.colors.callToAction};`};
  border-radius: 8px;
  width: 100%;
`

Alert.defaultProps = {
  status: 'info',
  type: 'general',
  shadow: false,
  closeLabel: 'close alert',
}

export default Alert
