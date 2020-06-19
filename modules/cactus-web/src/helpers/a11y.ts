import { KeyboardEvent } from 'react'

export const keyPressAsClick = (onClick: () => void) => {
  return (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }
}
