import { ReactNode, ReactPortal, useRef } from 'react'
import { createPortal } from 'react-dom'

const ID = 'cactus-portal-root'

export const getPortalRoot = (): HTMLElement => {
  let div = document.getElementById(ID)
  if (!div) {
    div = document.createElement('div')
    div.id = ID
    document.body.appendChild(div)
  }
  return div
}

export const usePortal = (contents: ReactNode, key?: string | null): ReactPortal | null => {
  const ref = useRef<HTMLElement>()
  if (!ref.current) {
    ref.current = getPortalRoot()
  }
  return contents ? createPortal(contents, ref.current, key) : null
}
