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

export const positionDropDown: PositionCallback = (dd, button) => {
  if (!button) return
  const ddRect = dd.getBoundingClientRect()
  const { left, right, top, bottom } = button.getBoundingClientRect()
  const view = getViewport() as Element
  const maxRight = view.clientWidth
  const maxBottom = view.clientHeight

  const minWidth = Math.min(maxRight, Math.round(right - left))
  const maxWidth = Math.min(maxRight, minWidth + Math.min(minWidth, 400))
  const ddWidth = Math.round(ddRect.width)
  const ddHeight = Math.round(ddRect.height) + MARGIN
  const expectedWidth = Math.max(minWidth, Math.min(maxWidth, ddWidth))

  // Assumes fixed positioning.
  const expectedRight = left + expectedWidth
  if (expectedRight > maxRight) {
    dd.style.left = ''
    dd.style.right = `${Math.min(maxRight - right, 0)}px`
  } else {
    dd.style.right = ''
    dd.style.left = `${left}px`
  }

  const expectedBottom = bottom + ddHeight
  const availableBelow = maxBottom - bottom
  dd.style.maxHeight = `${Math.max(availableBelow, top) - MARGIN}px`
  if (expectedBottom > maxBottom && availableBelow < top) {
    dd.style.top = ''
    dd.style.bottom = `${maxBottom + MARGIN - top}px`
  } else {
    dd.style.bottom = ''
    dd.style.top = `${bottom + MARGIN}px`
  }

  dd.style.minWidth = `${minWidth}px`
  dd.style.maxWidth = `${maxWidth}px`
  // Changing the width will likely change the height, and therefore the positioning.
  if (expectedWidth !== ddWidth) {
    window.requestAnimationFrame(() => positionDropDown(dd, button))
  }
}

const MARGIN = 8

const getViewport = () =>
  document.compatMode === 'BackCompat' ? document.querySelector('body') : document.documentElement
