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

export type Status = 'success' | 'warning' | 'error' | 'info'

type ColorKey = 'successLight' | 'warningLight' | 'errorLight' | 'lightContrast'

export const StatusPropType = PropTypes.oneOf<Status>(['success', 'warning', 'error', 'info'])

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

const StatusMessage: React.FC<StatusMessageProps> = ({
  status,
  children,
  ...rest
}): React.ReactElement => {
  const StatusIcon: React.ElementType<any> = iconMap[status] || Noop
  return (
    <StyledStatusMessage {...rest} role="alert" $status={status}>
      <StatusIcon aria-hidden="true" />
      <span>{children}</span>
    </StyledStatusMessage>
  )
}

const StyledStatusMessage = styled.div<{ $status: Status }>`
  padding: 2px 4px;
  position: relative;
  box-sizing: border-box;
  overflow-wrap: break-word;
  display: inline-block;
  ${textStyle('small')};
  ${(p) => colorStyle(statusMap[p.$status])}
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
