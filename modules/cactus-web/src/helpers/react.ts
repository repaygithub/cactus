import React, { SetStateAction } from 'react'

type CloneFunc = (e: React.ReactElement, p?: Record<string, any>, ix?: number) => React.ReactElement

// This can also be used just to flatten the children, but cloning seems the more likely use case.
export function cloneAll(
  children: React.ReactNode,
  cloneProps?: Record<string, any>,
  makeClone: CloneFunc = React.cloneElement
): React.ReactChild[] {
  const hasKeyPrefix = cloneProps && (cloneProps.key || cloneProps.key === 0)
  const childArray = React.Children.toArray(children) as React.ReactChild[]
  return childArray.reduce((returnVal, child, index) => {
    if (!child || typeof child === 'string' || typeof child === 'number') {
      returnVal.push(child)
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
          returnVal.push(...cloneAll(child.props.children, props, makeClone))
        }
      } else {
        returnVal.push(makeClone(child, props, index))
      }
    }
    return returnVal
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

// An immutable container with mutable contents; basically, a self-updating ref.
export function useBox<T>(box: T): T {
  const { current } = React.useRef<T>(box)
  if (box !== current) {
    for (const key of Object.keys(box) as (keyof T)[]) {
      current[key] = box[key]
    }
  }
  return current
}

type StateSetterWithCallback<S> = (v: SetStateAction<S>, callback?: () => void) => void

const noop = () => undefined

export function useStateWithCallback<S>(
  initialState: S | (() => S)
): [S, StateSetterWithCallback<S>] {
  const [state, setState] = React.useState<S>(initialState)
  const storedCallback = React.useRef<() => void>(noop)

  const setStateWithCallback = React.useCallback<StateSetterWithCallback<S>>(
    (v, callback = noop) => {
      storedCallback.current = callback
      setState(v)
    },
    []
  )

  React.useEffect(() => {
    storedCallback.current()
    storedCallback.current = noop
  }, [state])

  return [state, setStateWithCallback]
}
