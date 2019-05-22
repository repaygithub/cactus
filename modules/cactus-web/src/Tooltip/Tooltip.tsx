import React, { CSSProperties, forwardRef, Fragment, useRef } from 'react'

import { getScrollX, getScrollY } from '../helpers/scrollOffset'
import { MarginProps, margins } from '../helpers/margins'
import { maxWidth } from 'styled-system'
import { NotificationInfo } from '@repay/cactus-icons'
import { Omit } from '../types'
import { useRect } from '@reach/rect'
import { useTooltip } from '@reach/tooltip'
import Portal from '@reach/portal'
import styled from 'styled-components'
import VisuallyHidden from '@reach/visually-hidden'

interface Styles {
  top: string
  left: string
  borderTopLeftRadius?: string
  borderTopRightRadius?: string
  borderBottomRightRadius?: string
  borderBottomLeftRadius?: string
}

type Position = (triggerRect: DOMRect, tooltipRect: DOMRect | null) => Styles

interface TooltipProps
  extends MarginProps,
    Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'ref'> {
  /** Text to be displayed */
  label: string
  ariaLabel?: string
  DEBUG_STYLE?: boolean
  position?: Position
  maxWidth?: string
}

interface TooltipPopupProps
  extends Omit<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    'ref'
  > {
  triggerRect: DOMRect
  isVisible: boolean
  label: string
  ariaLabel?: string
  position?: Position
  maxWidth?: string
}

interface TooltipContentProps extends React.HTMLProps<HTMLDivElement> {
  triggerRect: DOMRect
  isVisible: boolean
  ariaLabel?: string
  position?: Position
  maxWidth?: string
}

const OFFSET = 8
const cactusPosition: Position = (triggerRect, tooltipRect) => {
  const scrollX = getScrollX()
  const scrollY = getScrollY()
  let styles: Styles = {
    left: `${triggerRect.left + scrollX}px`,
    top: `${triggerRect.top + triggerRect.height + scrollY}px`,
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
  const directionUp = collisions.bottom && !collisions.top

  styles = directionRight && !directionUp ? { ...styles, borderTopLeftRadius: '0px' } : styles
  styles = directionRight && directionUp ? { ...styles, borderBottomLeftRadius: '0px' } : styles
  styles = !directionRight && !directionUp ? { ...styles, borderTopRightRadius: '0px' } : styles
  styles = !directionRight && directionUp ? { ...styles, borderBottomRightRadius: '0px' } : styles

  return {
    ...styles,
    left: directionRight
      ? `${triggerRect.left + OFFSET + scrollX}px`
      : `${triggerRect.right - OFFSET - tooltipRect.width + scrollX}px`,
    top: directionUp
      ? `${triggerRect.top - tooltipRect.height + scrollY}px`
      : `${triggerRect.top + triggerRect.height + scrollY}px`,
  }
}

const StyledSpan = styled.span`
  outline: none;
`

/**
 * Stolen from reach/tooltip and adapted to fit our needs
 * https://github.com/reach/reach-ui/tree/master/packages/tooltip
 */

const TooltipBase = (props: TooltipProps) => {
  const { children, label, ariaLabel, DEBUG_STYLE, className, ...rest } = props
  const [trigger, tooltip] = useTooltip({ DEBUG_STYLE })
  return (
    <Fragment>
      <StyledSpan className={className} {...trigger} tabIndex={0}>
        <NotificationInfo />
      </StyledSpan>
      <TooltipPopup label={label} ariaLabel={ariaLabel} {...tooltip} {...rest} />
    </Fragment>
  )
}

export const TooltipPopup = forwardRef<HTMLDivElement, TooltipPopupProps>(function TooltipPopup(
  {
    // own props
    label, // could use children but want to encourage simple strings
    ariaLabel,
    position,

    // hook spread props
    isVisible,
    id,
    triggerRect,
    ...rest
  },
  forwardRef
) {
  return isVisible ? (
    <Portal>
      <TooltipContent
        label={label}
        ariaLabel={ariaLabel}
        position={position}
        isVisible={isVisible}
        id={id}
        triggerRect={triggerRect}
        ref={forwardRef}
        {...rest}
      />
    </Portal>
  ) : null
})

const getStyles = (
  position: Position,
  triggerRect: DOMRect,
  tooltipRect: DOMRect | null
): Pick<CSSProperties, 'top' | 'left' | 'visibility'> => {
  const haventMeasuredTooltipYet = !tooltipRect
  if (haventMeasuredTooltipYet) {
    return { visibility: 'hidden' }
  }
  return position(triggerRect, tooltipRect)
}

const TooltipContentBase = forwardRef<HTMLDivElement, TooltipContentProps>(function TooltipContent(
  {
    label,
    ariaLabel,
    position = cactusPosition,
    isVisible,
    id,
    triggerRect,
    style,
    maxWidth,
    ...rest
  },
  forwardRef
) {
  const useAriaLabel = ariaLabel != null
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const tooltipRect = useRect(tooltipRef, isVisible)
  return (
    <Fragment>
      <div
        data-reach-tooltip
        role={useAriaLabel ? undefined : 'tooltip'}
        id={useAriaLabel ? undefined : id}
        children={label}
        style={{
          ...style,
          ...getStyles(position, triggerRect, tooltipRect),
        }}
        ref={node => {
          tooltipRef.current = node
          if (typeof forwardRef === 'function') forwardRef(node)
        }}
        {...rest}
      />
      {useAriaLabel && (
        <VisuallyHidden role="tooltip" id={id}>
          {ariaLabel}
        </VisuallyHidden>
      )}
    </Fragment>
  )
})

/** End stolen code */

export const TooltipContent = styled(TooltipContentBase)`
  z-index: 1;
  pointer-events: none;
  position: absolute;
  padding: 16px;
  border-radius: 8px 8px 8px 8px;
  box-shadow: 0 9px 24px -8px ${p => p.theme.colors.callToAction};
  font-size: 15px;
  background: ${p => p.theme.colors.white};
  color: ${p => p.theme.colors.darkestContrast};
  border: 2px solid ${p => p.theme.colors.callToAction};
  box-sizing: border-box;
  overflow-wrap: break-word;

  ${maxWidth}
`

export const Tooltip = styled(TooltipBase)`
  ${margins}
`

export default Tooltip
