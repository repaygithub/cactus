import { Position } from '@reach/popover'
import { TooltipPopup as ReachTooltipPopup, useTooltip } from '@reach/tooltip'
import VisuallyHidden from '@reach/visually-hidden'
import { NotificationInfo } from '@repay/cactus-icons'
import { border, CactusTheme, color, colorStyle, radius, shadow } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { margin, MarginProps, TextColorProps } from 'styled-system'

import { getDataProps } from '../helpers/omit'
import { getScrollX, getScrollY } from '../helpers/scrollOffset'

export interface TooltipProps extends MarginProps, TextColorProps {
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
  const center = collisions.right && collisions.left

  if (center) {
    styles.marginLeft = -tooltipRect.width / 2
  } else if (directionRight && !directionBottom) {
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
    left: center
      ? '50%'
      : directionRight
      ? triggerRect.left + OFFSET + scrollX
      : triggerRect.right - OFFSET - tooltipRect.width + scrollX,
    top: directionBottom
      ? triggerRect.top + triggerRect.height + scrollY
      : triggerRect.top - tooltipRect.height + scrollY,
    // setting width to itself explicitly prevents "drift"
    width: tooltipRect.width,
  }
}

interface StyledInfoProps extends TextColorProps {
  disabled?: boolean
  forceVisible?: boolean
}

const getStyledInfoColor = (props: StyledInfoProps & { theme: CactusTheme }) => {
  if (props.disabled) {
    return `color: ${color(props, 'mediumGray')};`
  } else if (props.forceVisible) {
    return `color: ${color(props, 'callToAction')};`
  } else if (!props.color) {
    return `color: ${color(props, 'darkestContrast')};`
  }
  // The color prop is handled by the `NotificationInfo` icon.
}
const StyledInfo = styled(({ forceVisible, ...props }) => (
  <NotificationInfo {...props} />
))<StyledInfoProps>`
  outline: none;
  ${getStyledInfoColor};
`

const TooltipBase = (props: TooltipProps): React.ReactElement => {
  const {
    className,
    color: colorProp,
    disabled,
    label,
    ariaLabel,
    id,
    maxWidth,
    position,
    forceVisible,
  } = props
  const triggerRef = useRef<HTMLSpanElement | null>(null)
  const widgetRef = useRef<HTMLDivElement | null>(null)
  const [trigger, tooltip] = useTooltip({ ref: triggerRef })
  const [hovering, setHovering] = useState<boolean>(false)
  const [stayOpen, setStayOpen] = useState<boolean>(false)

  useEffect(() => {
    const handleBodyClick = (event: MouseEvent): void => {
      const { target } = event
      if (
        !(target instanceof Node) ||
        (!triggerRef.current?.contains(target) && !widgetRef.current?.contains(target))
      ) {
        setStayOpen(false)
      }
    }

    document.body.addEventListener('click', handleBodyClick)

    return () => {
      document.body.removeEventListener('click', handleBodyClick)
    }
  }, [])

  const defaultPosition: Position = (_, tooltipRect) => {
    return cactusPosition(triggerRef.current?.getBoundingClientRect(), tooltipRect)
  }

  const isVisible = stayOpen || hovering || forceVisible || tooltip.isVisible
  return (
    <>
      {!disabled && (
        <>
          <TooltipPopup
            {...tooltip}
            ref={widgetRef}
            isVisible={isVisible}
            label={label}
            ariaLabel={ariaLabel}
            position={position || defaultPosition}
            style={{ maxWidth }}
            onMouseEnter={() => {
              setHovering(true)
            }}
            onMouseLeave={() => {
              setHovering(false)
            }}
          />
          <VisuallyHidden role="tooltip" id={id} {...getDataProps(props)}>
            {label}
          </VisuallyHidden>
        </>
      )}
      <span {...trigger} className={className} onClick={() => setStayOpen(true)}>
        <StyledInfo color={colorProp} disabled={disabled} forceVisible={isVisible} />
      </span>
    </>
  )
}

export const TooltipPopup = styled(ReachTooltipPopup)`
  z-index: 100;
  position: absolute;
  padding: 16px;
  ${shadow(1)};
  font-size: 15px;
  ${colorStyle('standard')};
  box-sizing: border-box;
  overflow-wrap: break-word;
  word-wrap: break-word;
  border: ${border('callToAction')};
  border-radius: ${radius(8)};
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
