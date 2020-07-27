import { KeyboardEvent } from 'react'

export const isActionKey = (event: KeyboardEvent) => event.key === 'Enter' || event.key === ' '

export const keyPressAsClick = (onClick: () => void) => {
  return (event: KeyboardEvent) => {
    if (isActionKey(event)) {
      event.preventDefault()
      onClick()
    }
  }
}
