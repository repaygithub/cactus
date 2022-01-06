import {
  NotificationAlert,
  NotificationError,
  NotificationInfo,
  StatusCheck,
} from '@repay/cactus-icons'
import { colorStyle, textStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { Status as BaseStatus } from '../helpers/status'

type Status = BaseStatus | 'info'
type ColorKey = 'successLight' | 'warningLight' | 'errorLight' | 'lightContrast'

const StatusPropType = PropTypes.oneOf<Status>(['success', 'warning', 'error', 'info'])

interface StatusMessageProps extends React.HTMLAttributes<HTMLDivElement>, MarginProps {
  status: Status
}

type StatusMap = { [K in Status]: ColorKey }
type IconMap = { [K in Status]: React.ElementType<any> }

const statusMap: StatusMap = {
  success: 'successLight',
  warning: 'warningLight',
  error: 'errorLight',
  info: 'lightContrast',
}

const iconMap: IconMap = {
  success: StatusCheck,
  warning: NotificationAlert,
  error: NotificationError,
  info: NotificationInfo,
}

const Noop = (): null => null

const StatusMessageBase: React.FC<StatusMessageProps> = ({
  status,
  className,
  children,
  ...rest
}): React.ReactElement => {
  const StatusIcon: React.ElementType<any> = iconMap[status] || Noop
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
  ${textStyle('small')};
  ${(p) => colorStyle(statusMap[p.status])}
  ${margin}

  ${NotificationError}, ${NotificationAlert}, ${StatusCheck}, ${NotificationInfo} {
    margin-right: 4px;
    vertical-align: -2px;
  }
`

StatusMessage.propTypes = {
  status: StatusPropType.isRequired,
}

export default StatusMessage
