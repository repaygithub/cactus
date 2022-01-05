import { NotificationAlert, NotificationError, StatusCheck } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components'

import { textStyle } from '../helpers/theme'

export type Status = 'success' | 'warning' | 'error'

export const StatusPropType = PropTypes.oneOf<Status>(['success', 'warning', 'error'])

interface StatusMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  status: Status
}

type StatusMap = { [K in Status]: ReturnType<typeof css> }

const statusMap: StatusMap = {
  success: css`
    background-color: ${(p) => p.theme.colors.status.background.success};
  `,
  warning: css`
    background-color: ${(p) => p.theme.colors.status.background.warning};
  `,
  error: css`
    background-color: ${(p) => p.theme.colors.status.background.error};
  `,
}

const Noop = (): null => null

const StatusMessageBase: React.FC<StatusMessageProps> = ({
  status,
  className,
  children,
  ...rest
}): React.ReactElement => {
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

const StatusMessage = styled(StatusMessageBase)`
  padding: 2px 4px;
  position: relative;
  box-sizing: border-box;
  overflow-wrap: break-word;
  display: inline-block;
  color: ${(p) => p.theme.colors.darkestContrast};
  ${(p) => textStyle(p.theme, 'small')};
  ${(p) => statusMap[p.status]}

  ${NotificationError}, ${NotificationAlert}, ${StatusCheck} {
    margin-right: 4px;
    vertical-align: -2px;
  }
`

StatusMessage.propTypes = {
  status: StatusPropType.isRequired,
}

export default StatusMessage
