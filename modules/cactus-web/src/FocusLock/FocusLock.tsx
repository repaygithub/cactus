import React from 'react'

import { getFocusable } from '../helpers/focus'

function handleGuardFocus(event: React.FocusEvent<HTMLDivElement>) {
  const { currentTarget } = event
  const root = currentTarget.parentElement || currentTarget.parentNode
  if (root instanceof HTMLDivElement) {
    const focusableList = getFocusable(root).filter(
      (el) => !el.hasAttribute('data-cactus-focus-guard')
    )
    if (focusableList.length) {
      const guardType = currentTarget.getAttribute('data-cactus-focus-guard')
      // if the focused guard is at the start then well focus on that last item
      const index = guardType === 'start' ? focusableList.length - 1 : 0
      const el = focusableList[index]
      // @ts-ignore
      if (el && el.focus) el.focus()
      event.stopPropagation()
      event.preventDefault()
    }
  }
}

export const FocusLock = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function (props, forwardRef) {
    const { children, ...rest } = props
    return (
      <div ref={forwardRef} {...rest}>
        <div data-cactus-focus-guard="start" tabIndex={0} onFocus={handleGuardFocus} />
        {children}
        <div data-cactus-focus-guard="end" tabIndex={0} onFocus={handleGuardFocus} />
      </div>
    )
  }
)

export default FocusLock
