import observeRect from '@reach/observe-rect'
import { RefObject, useEffect, useRef } from 'react'

let supportsResizeObserver = true
try {
  ResizeObserver
} catch {
  supportsResizeObserver = false
}

declare interface ResizeObserver {
  observe(e: Element): void
  unobserve(e: Element): void
  disconnect(): void
}

declare let ResizeObserver: {
  prototype: ResizeObserver
  new (c: () => void): ResizeObserver
}

type Callback = (rect: DOMRect) => void

export function useSizeRef<T extends Element>(callback: Callback): RefObject<T> {
  const elementRef = useRef<T>(null)
  useEffect(() => {
    if (elementRef.current instanceof Element) {
      const element = elementRef.current
      if (supportsResizeObserver) {
        const observer = new ResizeObserver(() => callback(element.getBoundingClientRect()))
        observer.observe(element)
        return () => observer.disconnect()
      } else {
        const observer = observeRect(element, callback)
        observer.observe()
        return () => observer.unobserve()
      }
    }
  }, [elementRef, callback])
  return elementRef
}
