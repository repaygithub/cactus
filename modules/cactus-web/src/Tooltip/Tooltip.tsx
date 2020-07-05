import React, { cloneElement } from 'react'

import { getScrollX, getScrollY } from '../helpers/scrollOffset'
import { margin, MarginProps, maxWidth } from 'styled-system'
import { NotificationInfo } from '@repay/cactus-icons'
import { Omit } from '../types'
import { PRect } from '@reach/rect'
import { TooltipPopup as ReachTooltipPopup, useTooltip } from '@reach/tooltip'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import VisuallyHidden from '@reach/visually-hidden'

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
) => {
  if (!triggerRect || !tooltipRect) {
    return {}
  }
  const scrollX = getScrollX()
  const scrollY = getScrollY()
  let styles: Styles = ({
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
  color: ${(p) => (p.disabled ? p.theme.colors.mediumGray : p.theme.colors.callToAction)};
`

const TooltipBase = (props: TooltipProps) => {
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
  box-shadow: 0 9px 24px -8px ${(p) => p.theme.colors.callToAction};
  font-size: 15px;
  background: ${(p) => p.theme.colors.white};
  color: ${(p) => p.theme.colors.darkestContrast};
  border: 2px solid ${(p) => p.theme.colors.callToAction};
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
