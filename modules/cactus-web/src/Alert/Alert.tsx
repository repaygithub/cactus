import { CactusTheme } from '@repay/cactus-theme'
import { MarginProps, margins } from '../helpers/margins'
import Avatar from '../Avatar/Avatar'
import Flex from '../Flex/Flex'
import Grid from '../Grid/Grid'
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

const GeneralAvatarBase = styled(Avatar)`
  margin-top: 24px;
  margin-left: 16px;
`
const GeneralTextAlign = styled.div`
  margin-left: 72px;
  margin-top: -34px;
  margin-bottom: 34px;
`
const PushAvatarBase = styled(Avatar)`
  margin: 10px 10px;
`
const PushTextAlign = styled.div`
  margin: 16px 0;
`
const CloseIcon = styled.div`
  margin-top: 12px;
`
const Button = styled('button')`
  background: none;
  border: none;
  appearance: none;
  margin-right: 16px;
`

const AlertBase = (props: AlertProps) => {
  const { className, type: type, status: status, onClose: onClose } = props

  if (type === 'push') {
    return (
      <div className={className}>
        <Grid>
          <Flex justifyContent="center">
            <Grid.Item tiny={1}>
              <PushAvatarBase status={status} type="alert" />
            </Grid.Item>
          </Flex>

          <Grid.Item tiny={10}>
            <PushTextAlign>{props.children} </PushTextAlign>
          </Grid.Item>

          <Flex justifyContent="flex-end">
            <Grid.Item tiny={1}>
              <CloseIcon>
                <Button onClick={onClose}>
                  <NavigationClose iconSize="small" />
                </Button>
              </CloseIcon>
            </Grid.Item>
          </Flex>
        </Grid>
      </div>
    )
  } else {
    return (
      <div className={className}>
        <GeneralAvatarBase status={status} type="alert" />
        <GeneralTextAlign> {props.children} </GeneralTextAlign>
      </div>
    )
  }
}

export const Alert = styled(AlertBase)<AlertProps>`
  ${margins}
  ${backgroundVariant}
  ${sizeVariant}
  border-radius: 8px;
  width: 100%;
`

Alert.defaultProps = {
  status: 'info',
  type: 'push',
}

export default Alert
