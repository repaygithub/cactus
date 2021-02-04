import { css } from 'styled-components'

import { Status } from '../StatusMessage/StatusMessage'

type StatusMap = { [K in Status]: ReturnType<typeof css> }

export const textFieldStatusMap: StatusMap = {
  success: css`
    border-color: ${(p): string => p.theme.colors.success};
    background: ${(p): string => p.theme.colors.transparentSuccess};
  `,
  warning: css`
    border-color: ${(p): string => p.theme.colors.warning};
    background: ${(p): string => p.theme.colors.transparentWarning};
  `,
  error: css`
    border-color: ${(p): string => p.theme.colors.error};
    background: ${(p): string => p.theme.colors.transparentError};
  `,
}
