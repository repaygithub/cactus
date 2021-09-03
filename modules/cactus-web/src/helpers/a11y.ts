import React, { KeyboardEvent } from 'react'

import { useValue } from './react'

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

interface LiveProps {
  value: React.ReactChild
  changeKey: React.Key
  live?: React.AriaAttributes['aria-live']
  visible?: boolean
}

export const LiveRegion = (inProps: LiveProps): React.ReactElement => {
  const { value, changeKey, live = 'polite', visible = false } = inProps
  const style = visible ? undefined : INVISIBLE
  const props = { 'aria-live': live, style }
  const contents = useValue(value, [changeKey])
  return React.createElement('div', props, contents)
}
const INVISIBLE = { position: 'absolute', transform: 'scale(0)', zIndex: '-1' }
