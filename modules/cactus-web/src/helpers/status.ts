import { CactusTheme, color } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import { CSSObject } from 'styled-components'

const statuses = ['success', 'warning', 'error'] as const
export type Status = typeof statuses[number]
type StatusBackground = 'successLight' | 'warningLight' | 'errorLight'
export const StatusPropType = PropTypes.oneOf<Status>(statuses)

interface StatusProps {
  theme: CactusTheme
  status?: Status | null
  disabled?: boolean
}

export const getStatusStyles = (p: StatusProps): CSSObject | undefined => {
  if (!p.disabled && statuses.includes(p.status as any)) {
    return {
      borderColor: color(p, p.status as Status),
      backgroundColor: color(p, `${p.status}Light` as StatusBackground),
    }
  }
}
