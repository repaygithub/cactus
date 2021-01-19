import { KeyboardEvent } from 'react'

export const isActionKey = (event: KeyboardEvent): boolean =>
  event.key === 'Enter' || event.key === ' '

// Some elements automatically trigger a click event on `keyup` events,
// so combine `keyDownAsClick` with `onKeyUp={preventAction}` to stop duplicate clicks.
export const preventAction = (event: KeyboardEvent): void => {
  if (isActionKey(event)) {
    event.preventDefault()
  }
}

export const keyDownAsClick = (event: KeyboardEvent): void => {
  if (isActionKey(event)) {
    event.preventDefault()
    const target = event.target as HTMLElement
    target.click && target.click()
  }
}
