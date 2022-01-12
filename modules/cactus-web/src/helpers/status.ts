import PropTypes from 'prop-types'
import { css } from 'styled-components'

export type Status = 'success' | 'warning' | 'error'
export const StatusPropType = PropTypes.oneOf<Status>(['success', 'warning', 'error'])

type StatusMap = { [K in Status]: ReturnType<typeof css> }

export const textFieldStatusMap: StatusMap = {
  success: css`
    border-color: ${(p): string => p.theme.colors.success};
    background: ${(p): string => p.theme.colors.successLight};
  `,
  warning: css`
    border-color: ${(p): string => p.theme.colors.warning};
    background: ${(p): string => p.theme.colors.warningLight};
  `,
  error: css`
    border-color: ${(p): string => p.theme.colors.error};
    background: ${(p): string => p.theme.colors.errorLight};
  `,
}
