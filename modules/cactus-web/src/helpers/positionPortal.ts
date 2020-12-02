const MARGIN = 8

function positionPortal(portal: HTMLElement, trigger: HTMLElement | null): void {
  if (!trigger) return
  const portalRect = portal.getBoundingClientRect()
  const triggerRect = trigger.getBoundingClientRect()

  // default assumes no collisions bottom
  const style: React.CSSProperties = {
    top: triggerRect.top + triggerRect.height + MARGIN + 'px',
    left: triggerRect.left + 'px',
  }

  const collisions = {
    top: triggerRect.top - portalRect.height - MARGIN < 0,
    right: window.innerWidth < triggerRect.left + portalRect.width,
    bottom: window.innerHeight < triggerRect.bottom + portalRect.height,
    left: triggerRect.left < 0,
  }
  if (collisions.right && window.innerWidth < portalRect.width) {
    collisions.left = true
  }

  if (collisions.bottom && !collisions.top) {
    style.top = triggerRect.top - portalRect.height - MARGIN + 'px'
  } else if (collisions.top && collisions.bottom) {
    style.top = '0px'
  }
  if (collisions.right && !collisions.left) {
    style.left = window.innerWidth - portalRect.width + 'px'
  } else if (collisions.left && !collisions.right) {
    style.left = '0px'
  } else if (collisions.right && collisions.left) {
    style.left = '0px'
  }

  for (const key of Object.keys(style)) {
    // @ts-ignore
    portal.style[key] = style[key]
  }
}

export default positionPortal
