import { CactusTheme } from '@repay/cactus-theme'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

export type Status = 'success' | 'warning' | 'error'

interface StatusMessageProps {
  status: Status
}

type StatusMap = { [K in Status]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const statusMap: StatusMap = {
  success: css`
    border-color: ${p => p.theme.colors.success};
    background: ${p => p.theme.colors.success};
    color: ${p => p.theme.colors.white};
  `,
  warning: css`
    border-color: ${p => p.theme.colors.warning};
    background-color: ${p => p.theme.colors.warning};
    color: ${p => p.theme.colors.darkestContrast};
  `,
  error: css`
    border-color: ${p => p.theme.colors.error};
    background-color: ${p => p.theme.colors.error};
    color: ${p => p.theme.colors.white};
  `,
}

const statusColors = (props: StatusMessageProps) => {
  const { status } = props
  return statusMap[status]
}

const StatusMessage = styled.div<StatusMessageProps>`
  border-radius: 0 8px 8px 8px;
  padding: 8px 16px 8px 16px;
  position: relative;
  top: 4px;
  min-height: 16px;
  font-size: 15px;
  box-sizing: border-box;
  word-break: break-all;

  span {
    position: relative;
    display: inline-block;
    bottom: 2px;
    vertical-align: middle;
  }

  ${statusColors}
`

export default StatusMessage
