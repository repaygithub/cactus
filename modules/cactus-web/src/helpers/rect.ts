import observeRect from '@reach/observe-rect'
import { RefObject, useEffect, useRef } from 'react'

const supportsResizeObserver: boolean = (function () {
  try {
    ResizeObserver
  } catch {
    return false
  }
  return true
})()

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
      return observeSize(elementRef.current, callback)
    }
  }, [elementRef, callback])
  return elementRef
}

export function observeSize(element: Element, callback: Callback): () => void {
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
