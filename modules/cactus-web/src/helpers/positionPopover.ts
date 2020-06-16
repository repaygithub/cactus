import { getCollisions } from '@reach/popover'

type PRect = Partial<DOMRect> & {
  readonly bottom: number
  readonly height: number
  readonly left: number
  readonly right: number
  readonly top: number
  readonly width: number
}

export function getTopPosition(targetRect: PRect, popoverRect: PRect) {
  const { directionUp } = getCollisions(targetRect, popoverRect)
  return {
    top: directionUp
      ? `${targetRect.top - popoverRect.height + window.pageYOffset}px`
      : `${targetRect.top + targetRect.height + window.pageYOffset}px`,
  }
}
