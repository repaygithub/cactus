import { Position } from '@reach/popover'
import VisuallyHidden from '@reach/visually-hidden'
import { NotificationInfo } from '@repay/cactus-icons'
import { border, CactusTheme, color, colorStyle, radius, shadow } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { margin, MarginProps, TextColorProps } from 'styled-system'

import { getDataProps } from '../helpers/omit'
import { PositionCallback, usePositioning } from '../helpers/positionPopover'
import usePopup from '../helpers/usePopup'
import Modal from '../Modal/Modal'

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

interface TooltipStyles {
  left: number
  top: number
  marginLeft?: number
  borderBottomLeftRadius?: number
  borderTopLeftRadius?: number
  borderBottomRightRadius?: number
  borderTopRightRadius?: number
}

const OFFSET = 8
const cactusPosition: (theme: CactusTheme) => PositionCallback = (theme) => {
  const initialBR = radius(8)({ theme })
  return (tooltip, trigger) => {
    if (!trigger) return
    const tooltipRect = tooltip.getBoundingClientRect()
    const triggerRect = trigger.getBoundingClientRect()
    const styles: TooltipStyles = {
      left: triggerRect.left,
      top: triggerRect.top - tooltipRect.height,
    }

    const collisions = {
      top: triggerRect.top - tooltipRect.height < 0,
      right: window.innerWidth < triggerRect.left + tooltipRect.width,
      bottom: window.innerHeight < triggerRect.bottom + tooltipRect.height,
      left: triggerRect.left - tooltipRect.width < 0,
    }

    tooltip.style.borderRadius = initialBR
    const directionRight = collisions.left && !collisions.right
    const directionBottom = collisions.top && !collisions.bottom
    const center = collisions.right && collisions.left

    if (center) {
      styles.marginLeft = -tooltipRect.width / 2
    } else if (directionRight && !directionBottom) {
      styles.borderBottomLeftRadius = 0
    } else if (directionRight && directionBottom) {
      styles.borderTopLeftRadius = 0
    } else if (!directionRight && !directionBottom) {
      styles.borderBottomRightRadius = 0
    } else if (!directionRight && directionBottom) {
      styles.borderTopRightRadius = 0
    }

    const tooltipStyles = {
      ...styles,
      left: center
        ? '50%'
        : directionRight
        ? triggerRect.left + OFFSET
        : triggerRect.right - OFFSET - tooltipRect.width,
      top: directionBottom
        ? triggerRect.top + triggerRect.height
        : triggerRect.top - tooltipRect.height,
    }

    const keys = Object.keys(tooltipStyles) as (keyof TooltipStyles)[]
    keys.forEach((key: keyof TooltipStyles) => {
      const style = tooltipStyles[key]
      tooltip.style[key] = `${style}px`
    })
  }
}

// TODO: Remove this wrapper when we're ready for v10 breaking changed
const wrapPosition = (position: Position): PositionCallback => {
  return (tooltip, trigger) => {
    const styles = position(trigger?.getBoundingClientRect(), tooltip.getBoundingClientRect())
    if (styles) {
      const keys = Object.keys(styles) as (keyof TooltipStyles)[]
      keys.forEach((key: keyof TooltipStyles) => {
        let style = styles[key]
        if (typeof style !== 'string' || !style.includes('px')) {
          style = `${style}px`
        }
        tooltip.style[key] = style
      })
    }
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
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const [stayOpen, setStayOpen] = useState<boolean>(false)
  const hoveringPopup = useRef<boolean>(false)
  const theme = useTheme()
  const positionFn = position ? wrapPosition(position) : cactusPosition(theme)
  const {
    buttonProps: triggerProps,
    popupProps,
    toggle,
    expanded,
  } = usePopup('menu', {
    id,
    positionPopup: positionFn,
  })
  const visible = stayOpen || expanded || forceVisible || false

  usePositioning({
    position: positionFn,
    visible,
    ref: tooltipRef,
    anchorRef: triggerRef,
    updateOnScroll: true,
  })

  useEffect(() => {
    const handleBodyClick = (event: MouseEvent): void => {
      const { target } = event
      if (
        !(target instanceof Node) ||
        (!triggerRef.current?.contains(target) && !tooltipRef.current?.contains(target))
      ) {
        toggle(false)
        setStayOpen(false)
      }
    }

    document.body.addEventListener('click', handleBodyClick, true)

    return () => {
      document.body.removeEventListener('click', handleBodyClick, true)
    }
  }, [toggle])

  const delayHovering = (value: boolean) => {
    setTimeout(() => {
      if (!hoveringPopup.current) toggle(value)
    }, 500)
  }

  return (
    <div onMouseEnter={() => delayHovering(true)} onMouseLeave={() => delayHovering(false)}>
      {!disabled && (
        <>
          <TooltipPopup
            id={popupProps.id}
            ref={tooltipRef}
            aria-label={ariaLabel}
            aria-hidden={!visible}
            style={{ maxWidth }}
            data-tooltip-popup="true"
            onMouseEnter={() => {
              hoveringPopup.current = true
            }}
            onMouseLeave={() => {
              hoveringPopup.current = false
            }}
          >
            {label}
          </TooltipPopup>
          <VisuallyHidden role="tooltip" id={id} {...getDataProps(props)}>
            {label}
          </VisuallyHidden>
        </>
      )}
      <span
        id={triggerProps.id}
        ref={triggerRef}
        className={className}
        onClick={() => {
          setStayOpen(true)
        }}
      >
        <StyledInfo color={colorProp} disabled={disabled} forceVisible={visible} />
      </span>
    </div>
  )
}

export const TooltipPopup = styled.div`
  z-index: 100;
  position: fixed;
  padding: 16px;
  ${shadow(1)};
  font-size: 15px;
  ${colorStyle('standard')};
  box-sizing: border-box;
  overflow-wrap: break-word;
  word-wrap: break-word;
  border: ${border('callToAction')};
  border-radius: ${radius(8)};

  display: block;
  &[aria-hidden='true'] {
    display: none;
  }

  ${Modal} & {
    z-index: 102;
  }
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
