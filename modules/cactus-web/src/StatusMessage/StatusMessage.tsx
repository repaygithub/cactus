import { CactusTheme } from '@repay/cactus-theme'
import { NotificationAlert, NotificationError, StatusCheck } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components'

export type Status = 'success' | 'warning' | 'error'

export const StatusPropType = PropTypes.oneOf(['success', 'warning', 'error'])

interface StatusMessageProps {
  status: Status
}

type StatusMap = { [K in Status]: ReturnType<typeof css> }

const statusMap: StatusMap = {
  success: css`
    border-color: ${p => p.theme.colors.success};
  `,
  warning: css`
    border-color: ${p => p.theme.colors.warning};
  `,
  error: css`
    border-color: ${p => p.theme.colors.error};
  `,
}

// @ts-ignore
const statusColors: any = props => {
  const { status } = props
  return statusMap[status as Status]
}

const Noop = () => null

const StatusMessageBase: React.FC<
  StatusMessageProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ status, className, children, ...rest }) => {
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
  border-radius: 0 8px 8px 8px;
  padding: 8px 16px 8px 16px;
  position: relative;
  box-sizing: border-box;
  overflow-wrap: break-word;
  display: inline-block;
  border: 2px solid;
  ${p => p.theme.textStyles.small};
  ${statusColors}

  ${NotificationError}, ${NotificationAlert}, ${StatusCheck} {
    margin-right: 4px;
    vertical-align: -2px;
  }
`

// @ts-ignore
StatusMessage.propTypes = {
  status: StatusPropType.isRequired,
}

export default StatusMessage
