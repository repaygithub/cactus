import { assign, noop } from 'lodash'
import React, { SetStateAction } from 'react'

export type CloneFunc = (
  e: React.ReactElement,
  p?: Record<string, any>,
  ix?: number
) => React.ReactElement

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
type HybridRef<T> = React.RefCallback<T> & React.RefObject<T>
type MutHybridRef<T> = React.RefCallback<T> & React.MutableRefObject<T>

// Keep in mind that unlike a normal ref, hybrid refs are not guaranteed to be stable.
export function useMergedRefs<T>(...refs: Ref<T>[]): HybridRef<T> {
  const refFunc: any = (value: T | null) => {
    if (!value) return
    hybridRef.current = value
    for (const ref of refs) {
      if (!ref) {
        continue
      } else if (typeof ref === 'function') {
        ref(value)
      } else {
        ref.current = value
      }
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const hybridRef = React.useCallback<MutHybridRef<T>>(refFunc, refs)
  if (hybridRef === refFunc) {
    Object.defineProperty(hybridRef, 'current', { writable: true, enumerable: true })
    Object.preventExtensions(hybridRef)
  }
  return hybridRef
}

type Func<R = any> = (...args: any[]) => R
type NotFunc<T> = T extends Func ? never : T

interface ValueHook {
  <T extends Func>(mkValue: T, args: Parameters<T>): ReturnType<T>
  <T extends Func, D = Parameters<T>>(
    mkValue: T,
    deps: D,
    compareDependencies: (prev: Parameters<T>, current: D) => Parameters<T>
  ): ReturnType<T>
  <T>(value: NotFunc<T>, deps: unknown[]): T
  <T, D>(value: NotFunc<T>, deps: D, compareDependencies: (prev: D, current: D) => D): T
}

interface Value<T> {
  value: T
  dependencies: unknown[]
}

const shallowCmp = (prev: any[], current: any[]): any[] => {
  if (prev.length !== current.length || !prev.every((d, i) => d === current[i])) {
    return current
  }
  return prev
}

// Similar to useMemo/useCallback except stability is guaranteed.
export const useValue: ValueHook = <T>(val: any, deps: any[], cmp = shallowCmp): T => {
  const ref = React.useRef(SENTINEL as Value<T>)
  let value = ref.current.value
  const prevDeps = ref.current.dependencies
  const dependencies = cmp(prevDeps, deps)
  if (dependencies !== prevDeps) {
    value = typeof val === 'function' ? val(...dependencies) : val
    ref.current = { value, dependencies }
  }
  return value
}
const SENTINEL: unknown = { dependencies: [Object.create(null)] }

interface UseBox {
  <T>(box: T): T
  // Mutable box + immutable initialization
  <M, I extends Func>(box: M, init: I, ...args: Parameters<I>): M & ReturnType<I>
}
type Obj = Record<string, any>

// An immutable container with mutable contents; basically, a self-updating ref.
export const useBox: UseBox = (box: Obj, init?: Func<Obj>, ...args: any[]): Obj => {
  const ref = React.useRef<Obj>()
  if (ref.current === undefined) {
    ref.current = init ? init(...args) : {}
  }
  return assign(ref.current, box)
}

type StateSetterWithCallback<S> = (v: SetStateAction<S>, callback?: () => void) => void

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

const inc = (x: number) => x + 1

export const useRenderTrigger = (): (() => void) => React.useReducer(inc, 0)[1]

type SemiControlProps<T extends React.ElementType> = {
  input: T
  value: unknown
  onChange: React.ChangeEventHandler<unknown>
} & Omit<React.ComponentProps<T>, 'as' | 'ref' | 'value' | 'onChange'>

interface ControlBox {
  value: unknown
  isFocused: boolean
  onFocus?: React.FocusEventHandler<unknown>
  handleFocus: React.FocusEventHandler<unknown>
  onBlur?: React.FocusEventHandler<unknown>
  handleBlur: React.FocusEventHandler<unknown>
  onChange: React.ChangeEventHandler<unknown>
  handleChange: React.ChangeEventHandler<unknown>
}

const initControlBox = (trigger: () => void): ControlBox => {
  const vars: ControlBox = {
    value: null,
    isFocused: false,
    onChange: noop,
    handleFocus: (e: React.FocusEvent<unknown>) => {
      vars.isFocused = true
      vars.onFocus?.(e)
    },
    handleBlur: (e: React.FocusEvent<unknown>) => {
      vars.isFocused = false
      vars.onBlur?.(e)
      trigger() // Now rerender with the parent's value.
    },
    handleChange: (e: React.ChangeEvent<{ value: unknown }>) => {
      vars.value = e.target.value
      vars.onChange(e)
      trigger()
    },
  }
  return vars
}

// Use this to make an input "uncontrolled" while focused, but controlled otherwise;
// this is useful when valid values are limited but you don't want to interfere
// with user input by trying to normalize the value as they type.
export const SemiControlled = <T extends React.ElementType>(
  props: SemiControlProps<T>
): React.ReactElement => {
  const { input, value: controlledValue, onFocus, onBlur, onChange, ...rest } = props
  const trigger = useRenderTrigger()
  const vars = useBox({ onFocus, onBlur, onChange, controlledValue }, initControlBox, trigger)
  if (!vars.isFocused) {
    vars.value = controlledValue
  }
  return React.createElement(input, {
    ...rest,
    onFocus: vars.handleFocus,
    onBlur: vars.handleBlur,
    onChange: vars.handleChange,
    value: vars.value,
  })
}
