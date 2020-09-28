import React from 'react'

type CloneFunc = (e: React.ReactElement, p?: Record<string, any>) => React.ReactElement

// This can also be used just to flatten the children, but cloning seems the more likely use case.
export function cloneAll(
  children: React.ReactNode,
  cloneProps?: Record<string, any>,
  makeClone: CloneFunc = React.cloneElement
): React.ReactChild[] {
  const hasKeyPrefix = cloneProps && (cloneProps.key || cloneProps.key === 0)
  const childArray = React.Children.toArray(children) as React.ReactChild[]
  return childArray.reduce((children, child) => {
    if (!child || typeof child === 'string' || typeof child === 'number') {
      children.push(child)
    } else {
      const key = hasKeyPrefix ? `${cloneProps?.key}${child.key}` : child.key
      let props: Record<string, any> | undefined
      if (cloneProps) {
        props = { ...cloneProps, key }
      } else if (hasKeyPrefix) {
        props = { key }
      }
      if (child.type === React.Fragment) {
        if (child.props.children) {
          children.push(...cloneAll(child.props.children, props, makeClone))
        }
      } else {
        children.push(makeClone(child, props))
      }
    }
    return children
  }, [] as React.ReactChild[])
}

type Ref<T> = React.RefCallback<T> | React.MutableRefObject<T> | null | undefined

export function useMergedRefs<T>(...refs: Ref<T>[]): React.RefCallback<T> {
  return React.useCallback(
    (value: T | null) => {
      for (const ref of refs) {
        if (!ref || !value) {
          continue
        } else if (typeof ref === 'function') {
          ref(value)
        } else {
          ref.current = value
        }
      }
    },
    [refs]
  )
}

// Similar to useMemo/useCallback except stability is guaranteed.
export function useValue<T>(value: T, dependencies: any[]): T {
  const valueRef = React.useRef<T>(value)
  const depRef = React.useRef<any[]>(dependencies)
  const length = Math.max(dependencies.length, depRef.current.length)
  for (let i = 0; i < length; i++) {
    if (depRef.current[i] !== dependencies[i]) {
      depRef.current = dependencies
      valueRef.current = value
      break
    }
  }
  return valueRef.current
}
