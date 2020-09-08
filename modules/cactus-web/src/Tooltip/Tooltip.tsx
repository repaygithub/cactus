import { Position } from '@reach/popover'
import { TooltipPopup as ReachTooltipPopup, useTooltip } from '@reach/tooltip'
import VisuallyHidden from '@reach/visually-hidden'
import { NotificationInfo } from '@repay/cactus-icons'
import { ColorStyle, Shape } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { cloneElement } from 'react'
import styled, { css } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { getScrollX, getScrollY } from '../helpers/scrollOffset'
import { border, boxShadow } from '../helpers/theme'

interface TooltipProps extends MarginProps {
  /** Text to be displayed */
  label: React.ReactNode
  ariaLabel?: string
  position?: Position
  maxWidth?: string
  disabled?: boolean
  className?: string
  id?: string
  forceVisible?: boolean
}
export interface TooltipHandle {
  toggle(): void
}

const OFFSET = 8
const cactusPosition: Position = (triggerRect, tooltipRect) => {
  if (!triggerRect || !tooltipRect) {
    return {}
  }
  const scrollX = getScrollX()
  const scrollY = getScrollY()
  const styles: ReturnType<Position> = {
    left: triggerRect.left + scrollX,
    top: triggerRect.top - tooltipRect.height + scrollY,
  }

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
  const directionBottom = collisions.top && !collisions.bottom

  if (directionRight && !directionBottom) {
    styles.borderBottomLeftRadius = '0px'
  } else if (directionRight && directionBottom) {
    styles.borderTopLeftRadius = '0px'
  } else if (!directionRight && !directionBottom) {
    styles.borderBottomRightRadius = '0px'
  } else if (!directionRight && directionBottom) {
    styles.borderTopRightRadius = '0px'
  }

  return {
    ...styles,
    left: directionRight
      ? triggerRect.left + OFFSET + scrollX
      : triggerRect.right - OFFSET - tooltipRect.width + scrollX,
    top: directionBottom
      ? triggerRect.top + triggerRect.height + scrollY
      : triggerRect.top - tooltipRect.height + scrollY,
    // setting width to itself explicitly prevents "drift"
    width: tooltipRect.width,
  }
}

interface StyledInfoProps {
  disabled?: boolean
  $forceVisible?: boolean
}

const getStyledInfoColor = (props: StyledInfoProps): ReturnType<typeof css> => {
  if (props.disabled) {
    return css`
      color: ${(p): string => p.theme.colors.mediumGray};
    `
  } else if (props.$forceVisible) {
    return css`
      color: ${(p): string => p.theme.colors.callToAction};
    `
  }
  return css`
    color: ${(p): string => p.theme.colors.darkestContrast};
  `
}
const StyledInfo = styled(NotificationInfo)<StyledInfoProps>`
  outline: none;
  ${getStyledInfoColor};
  &:hover {
    color: ${(p): string => (p.disabled ? p.theme.colors.mediumGray : p.theme.colors.callToAction)};
  }
`

const TooltipBase = (props: TooltipProps): React.ReactElement => {
  const { className, disabled, label, ariaLabel, id, maxWidth, position, forceVisible } = props
  const [trigger, tooltip] = useTooltip()

  return (
    <>
      {cloneElement(
        <span className={className}>
          <StyledInfo disabled={disabled} $forceVisible={forceVisible} />
        </span>,
        trigger
      )}
      {!disabled && (
        <>
          <TooltipPopup
            {...tooltip}
            isVisible={forceVisible || tooltip.isVisible}
            label={label}
            ariaLabel={ariaLabel}
            position={position || cactusPosition}
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
const shapeMap: { [K in Shape]: string } = {
  square: 'border-radius: 1px;',
  intermediate: 'border-radius: 4px;',
  round: 'border-radius: 8px;',
}

export const TooltipPopup = styled(ReachTooltipPopup)`
  z-index: 100;
  pointer-events: none;
  position: absolute;
  padding: 16px;
  ${(p): string => boxShadow(p.theme, 1)};
  font-size: 15px;
  ${(p): ColorStyle => p.theme.colorStyles.standard};
  box-sizing: border-box;
  overflow-wrap: break-word;
  border: ${(p) => border(p.theme, 'callToAction')};
  ${(p): string => shapeMap[p.theme.shape]}
`

export const Tooltip = styled(TooltipBase)`
  ${margin}
`

Tooltip.propTypes = {
  label: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string,
  position: PropTypes.func,
  maxWidth: PropTypes.string,
  disabled: PropTypes.bool,
}

Tooltip.defaultProps = {
  maxWidth: Math.min(typeof window !== 'undefined' ? window.innerWidth : 500, 500) + 'px',
}

export default Tooltip
