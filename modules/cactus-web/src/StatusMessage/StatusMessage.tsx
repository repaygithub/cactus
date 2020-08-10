import { NotificationAlert, NotificationError, StatusCheck } from '@repay/cactus-icons'
import { TextStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css, FlattenSimpleInterpolation } from 'styled-components'

import { textStyle } from '../helpers/theme'

export type Status = 'success' | 'warning' | 'error'

export const StatusPropType = PropTypes.oneOf<Status>(['success', 'warning', 'error'])

interface StatusMessageProps {
  status: Status
}

type StatusMap = { [K in Status]: ReturnType<typeof css> }

const statusMap: StatusMap = {
  success: css`
    background-color: ${(p): string => p.theme.colors.status.avatar.success};
  `,
  warning: css`
    background-color: ${(p): string => p.theme.colors.status.avatar.warning};
  `,
  error: css`
    background-color: ${(p): string => p.theme.colors.status.avatar.error};
  `,
}

const statusColors: any = (props: StatusMessageProps): ReturnType<typeof css> => {
  const { status } = props
  return statusMap[status as Status]
}

const Noop = (): null => null

const StatusMessageBase: React.FC<
  StatusMessageProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ status, className, children, ...rest }): React.ReactElement => {
  let StatusIcon: React.ElementType<any> = Noop
  switch (status) {
    case 'error': {
      StatusIcon = NotificationError
      break
    }
    case 'warning': {
      StatusIcon = NotificationAlert
      break
    }
    case 'success': {
      StatusIcon = StatusCheck
      break
    }
  }
  return (
    <div {...rest} role="alert" className={className}>
      <StatusIcon aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

const StatusMessage = styled(StatusMessageBase)<StatusMessageProps>`
  padding: 2px 4px;
  position: relative;
  box-sizing: border-box;
  overflow-wrap: break-word;
  display: inline-block;
  ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'small')};
  ${statusColors}

  ${NotificationError}, ${NotificationAlert}, ${StatusCheck} {
    margin-right: 4px;
    vertical-align: -2px;
  }
`

StatusMessage.propTypes = {
  status: StatusPropType.isRequired,
}

export default StatusMessage
