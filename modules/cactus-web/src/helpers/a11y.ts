import { KeyboardEvent } from 'react'

export const keyPressAsClick = (onClick: () => void): ((e: React.KeyboardEvent) => void) => {
  return (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }
}
