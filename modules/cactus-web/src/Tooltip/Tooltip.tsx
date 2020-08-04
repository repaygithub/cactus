import { PRect } from '@reach/rect'
import { TooltipPopup as ReachTooltipPopup, useTooltip } from '@reach/tooltip'
import VisuallyHidden from '@reach/visually-hidden'
import { NotificationInfo } from '@repay/cactus-icons'
import { ColorStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { cloneElement } from 'react'
import styled from 'styled-components'
import { margin, MarginProps, maxWidth } from 'styled-system'

import { getScrollX, getScrollY } from '../helpers/scrollOffset'
import { boxShadow } from '../helpers/theme'
import { Omit } from '../types'

interface Styles extends DOMRect {
  top: number
  left: number
  borderTopLeftRadius?: string
  borderTopRightRadius?: string
  borderBottomRightRadius?: string
  borderBottomLeftRadius?: string
}

type Position = (
  triggerRect: PRect | null | undefined,
  tooltipRect: PRect | null | undefined
) => DOMRect

interface TooltipProps
  extends MarginProps,
    Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'ref'> {
  /** Text to be displayed */
  label: string
  ariaLabel?: string
  DEBUG_STYLE?: boolean
  position?: Position
  maxWidth?: string
  disabled?: boolean
}

const OFFSET = 8
// @ts-ignore
const cactusPosition: Position = (
  triggerRect: PRect | null | undefined,
  tooltipRect: PRect | null | undefined
): {
  left?: number
  top?: number
  width?: number
  borderTopLeftRadius?: string
  borderTopRightRadius?: string
  borderBottomRightRadius?: string
  borderBottomLeftRadius?: string
} => {
  if (!triggerRect || !tooltipRect) {
    return {}
  }
  const scrollX = getScrollX()
  const scrollY = getScrollY()
  const styles: Styles = ({
    left: triggerRect.left + scrollX,
    top: triggerRect.top + triggerRect.height + scrollY,
  } as unknown) as DOMRect

  if (!tooltipRect) {
    return styles
  }

  const collisions = {
    top: triggerRect.top - tooltipRect.height < 0,
    right: window.innerWidth < triggerRect.left + tooltipRect.width,
    bottom: window.innerHeight < triggerRect.bottom + tooltipRect.height,
    left: triggerRect.left - tooltipRect.width < 0,
  }

  const directionRight = collisions.left && !collisions.right
  const directionUp = collisions.bottom && !collisions.top

  if (directionRight && !directionUp) {
    styles.borderTopLeftRadius = '0px'
  } else if (directionRight && directionUp) {
    styles.borderBottomLeftRadius = '0px'
  } else if (!directionRight && !directionUp) {
    styles.borderTopRightRadius = '0px'
  } else if (!directionRight && directionUp) {
    styles.borderBottomRightRadius = '0px'
  }

  return {
    ...styles,
    left: directionRight
      ? triggerRect.left + OFFSET + scrollX
      : triggerRect.right - OFFSET - tooltipRect.width + scrollX,
    top: directionUp
      ? triggerRect.top - tooltipRect.height + scrollY
      : triggerRect.top + triggerRect.height + scrollY,
    // setting width to itself explicitly prevents "drift"
    width: tooltipRect.width,
  }
}

interface StyledInfoProps {
  disabled?: boolean
}

const StyledInfo = styled(NotificationInfo)<StyledInfoProps>`
  color: ${(p): string => (p.disabled ? p.theme.colors.mediumGray : p.theme.colors.callToAction)};
`

const TooltipBase = (props: TooltipProps): React.ReactElement => {
  const { className, disabled, label, ariaLabel, id, maxWidth } = props
  const [trigger, tooltip] = useTooltip()
  return (
    <>
      {cloneElement(
        <span className={className}>
          <StyledInfo disabled={disabled} />
        </span>,
        trigger
      )}
      {!disabled && (
        <>
          <TooltipPopup
            {...tooltip}
            label={label}
            ariaLabel={ariaLabel}
            position={cactusPosition}
            style={{ maxWidth }}
          />
          <VisuallyHidden role="tooltip" id={id}>
            {label}
          </VisuallyHidden>
        </>
      )}
    </>
  )
}

export const TooltipPopup = styled(ReachTooltipPopup)`
  z-index: 100;
  pointer-events: none;
  position: absolute;
  padding: 16px;
  border-radius: 8px 8px 8px 8px;
  ${(p): string => boxShadow(p.theme, 2)};
  font-size: 15px;
  ${(p): ColorStyle => p.theme.colorStyles.standard};
  border: 2px solid ${(p): string => p.theme.colors.callToAction};
  box-sizing: border-box;
  overflow-wrap: break-word;

  ${maxWidth}
`

export const Tooltip = styled(TooltipBase)`
  ${margin}
`

Tooltip.propTypes = {
  label: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string,
  position: PropTypes.func,
  maxWidth: PropTypes.string,
  disabled: PropTypes.bool,
}

Tooltip.defaultProps = {
  maxWidth: Math.min(typeof window !== 'undefined' ? window.innerWidth : 500, 500) + 'px',
}

export default Tooltip
