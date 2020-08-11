import { KeyboardEvent } from 'react'

export const isActionKey = (event: KeyboardEvent): boolean =>
  event.key === 'Enter' || event.key === ' '

export const keyPressAsClick = (event: KeyboardEvent): void => {
  if (isActionKey(event)) {
    event.preventDefault()
    const target = event.target as HTMLElement
    target.click && target.click()
  }
}
