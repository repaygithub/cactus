import { getScrollX, getScrollY } from './scrollOffset'

export interface PositionOptions {
  offset: number
  scrollbarWidth: number
}

const defOptions = (
  options?: Partial<PositionOptions>
): { offset: number; scrollbarWidth: number } => ({
  offset: 0,
  scrollbarWidth: 0,
  ...options,
})

function positionPortal(
  isOpen: boolean,
  triggerRect: ClientRect | undefined | null,
  portalRect: ClientRect | undefined | null,
  options?: Partial<PositionOptions>
): React.CSSProperties | undefined {
  if (!isOpen || triggerRect === undefined || triggerRect === null) {
    return { visibility: 'hidden', display: 'none', height: 0, width: 0 }
  }
  let { offset, scrollbarWidth } = defOptions(options)
  if (scrollbarWidth === undefined) {
    scrollbarWidth = 0
  }
  const scrollY = getScrollY()
  const scrollX = getScrollX()

  // default assumes no collisions bottom
  let style: React.CSSProperties = {
    top: scrollY + triggerRect.top + triggerRect.height + offset + 'px',
    left: scrollX + triggerRect.left + 'px',
    width: triggerRect.width + 'px',
  }

  if (portalRect === undefined || portalRect === null) {
    return style
  }

  const collisions = {
    top: triggerRect.top - portalRect.height - offset < 0,
    right: window.innerWidth < triggerRect.left + triggerRect.width,
    bottom: window.innerHeight < triggerRect.bottom + portalRect.height,
    left: triggerRect.left < 0,
  }
  if (collisions.right && window.innerWidth < triggerRect.width) {
    collisions.left = true
  }

  if (collisions.bottom && !collisions.top) {
    style.top = scrollY + triggerRect.top - portalRect.height - offset + 'px'
  } else if (collisions.top && collisions.bottom) {
    style.top = scrollY + 'px'
    style.maxHeight = window.innerHeight - scrollbarWidth + 'px'
  }
  if (collisions.right && !collisions.left) {
    style.left = window.innerWidth + scrollX - portalRect.width + 'px'
  } else if (collisions.left && !collisions.right) {
    style.left = scrollX + 'px'
  } else if (collisions.right && collisions.left) {
    style.left = scrollX + 'px'
    style.width = window.innerWidth - scrollbarWidth + 'px'
  }

  return style
}

export default positionPortal
