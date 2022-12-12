import { getCollisions } from '@reach/popover'
import { RefObject, useLayoutEffect } from 'react'

type PRect = Partial<DOMRect> & {
  readonly bottom: number
  readonly height: number
  readonly left: number
  readonly right: number
  readonly top: number
  readonly width: number
}

export function getTopPosition(targetRect: PRect, popoverRect: PRect): { top: string } {
  const { directionUp } = getCollisions(targetRect, popoverRect)
  return {
    top: directionUp
      ? `${targetRect.top - popoverRect.height + window.pageYOffset}px`
      : `${targetRect.top + targetRect.height + window.pageYOffset}px`,
  }
}

type RefOrId = RefObject<HTMLElement | string | null>
export type PositionCallback = (elem: HTMLElement, anchor: HTMLElement | null) => void

const getElem = ({ current }: RefOrId): HTMLElement | null =>
  typeof current === 'string' ? document.getElementById(current) : current

interface UsePositioning {
  position: PositionCallback
  visible: boolean
  ref: RefOrId
  anchorRef?: RefOrId
  updateOnScroll?: boolean
}

export function usePositioning({
  position,
  visible,
  ref,
  anchorRef,
  updateOnScroll = false,
}: UsePositioning): void {
  useLayoutEffect(() => {
    if (visible && position && ref.current) {
      const elem = getElem(ref)
      if (elem) {
        const anchor = anchorRef ? getElem(anchorRef) : null
        position(elem, anchor)
        if (updateOnScroll) {
          return positionOnScroll(position, ref, anchorRef)
        }
      }
    }
  }, [visible, position, updateOnScroll, ref, anchorRef])
}

function positionOnScroll(position: PositionCallback, ref: RefOrId, anchorRef?: RefOrId) {
  let updating = false
  const listener = (e: Event) => {
    if (!updating) {
      updating = true
      const target = e.target as Node | null
      window.requestAnimationFrame(() => {
        const anchor = anchorRef ? getElem(anchorRef) : null
        if (!anchor || !target?.contains || target.contains(anchor)) {
          const elem = getElem(ref)
          if (elem) {
            position(elem, anchor)
          }
        }
        updating = false
      })
    }
  }
  window.addEventListener('scroll', listener, { passive: true, capture: true })
  return () => window.removeEventListener('scroll', listener, true)
}

const isScrollable = RegExp.prototype.test.bind(/(auto|hidden|scroll)/)

const getScrollParent = (popup: HTMLElement): Element | null => {
  for (let e: HTMLElement | null = popup; (e = e.parentElement); ) {
    const style = getComputedStyle(e)
    if (isScrollable(style.overflow + style.overflowX + style.overflowY)) {
      return e
    }
  }
  return null
}

export const positionDropDown: PositionCallback = (dd, button) => {
  if (!button) return
  const { left, right, top, bottom } = button.getBoundingClientRect()
  const view = getViewport() as Element
  const scrollParent = getScrollParent(dd) || view
  const scrollBox = scrollParent.getBoundingClientRect()
  const maxRight = Math.min(scrollBox.right, view.clientWidth)
  const maxBottom = Math.min(scrollBox.bottom, view.clientHeight)

  const visibleWidth = Math.min(scrollParent.clientWidth, view.clientWidth)
  const minWidth = Math.min(visibleWidth, button.offsetWidth)
  const maxWidth = Math.min(visibleWidth, minWidth * 2, minWidth + 400)
  const ddWidth = dd.offsetWidth
  const ddHeight = dd.offsetHeight + MARGIN
  const expectedWidth = Math.max(minWidth, Math.min(maxWidth, ddWidth))
  const adjustedLeft = Math.max(right, maxRight) - expectedWidth
  const availableBelow = maxBottom - bottom

  // Assumes fixed positioning.
  dd.style.left = `${Math.min(left, adjustedLeft)}px`
  if (availableBelow < ddHeight && availableBelow < top) {
    // Not enough space below, more space above: drop-down goes above the button.
    const maxHeight = top - MARGIN
    dd.style.top = `${top - Math.min(ddHeight, maxHeight)}px`
    dd.style.maxHeight = `${maxHeight}px`
  } else {
    dd.style.top = `${bottom + MARGIN}px`
    dd.style.maxHeight = `${availableBelow - MARGIN}px`
  }
  dd.style.minWidth = `${minWidth}px`
  dd.style.maxWidth = `${maxWidth}px`
  // Changing the width may change the positioning, so we call it again after the styles update.
  if (expectedWidth !== ddWidth) {
    window.requestAnimationFrame(() => positionDropDown(dd, button))
  }
}

const MARGIN = 8

export const getViewport = (): Element | null =>
  document.compatMode === 'BackCompat' ? document.querySelector('body') : document.documentElement
