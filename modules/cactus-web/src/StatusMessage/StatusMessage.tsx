import {
  IconProps,
  NotificationAlert,
  NotificationError,
  NotificationInfo,
  StatusCheck,
} from '@repay/cactus-icons'
import { colorStyle, ColorVariant, textStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { omitMargins } from '../helpers/omit'
import { Status as BaseStatus } from '../helpers/status'

type Status = BaseStatus | 'info'

const StatusPropType = PropTypes.oneOf<Status>(['success', 'warning', 'error', 'info'])

interface StatusMessageProps extends React.HTMLAttributes<HTMLDivElement>, MarginProps {
  status: Status
}

type StatusMap = { [K in Status]: ColorVariant }
type IconMap = { [K in Status]: React.ElementType<IconProps> }

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

const StatusMessageBase: React.FC<StatusMessageProps> = (props) => {
  const { status, className, children, ...rest } = omitMargins(props)
  const StatusIcon: React.ElementType<any> = iconMap[status as Status] || Noop
  return (
    <div {...rest} role="alert" className={className}>
      <StatusIcon aria-hidden="true" mr={2} verticalAlign="-2px" />
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
  ${(p) => colorStyle(p, statusMap[p.status])}
  ${margin}
`

StatusMessage.propTypes = {
  status: StatusPropType.isRequired,
}

export default StatusMessage
