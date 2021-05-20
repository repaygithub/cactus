import isEqual from 'lodash/isEqual'
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

// A pure component is one whose output depends solely on props.
export function isPurelyEqual(left: React.ReactNode, right: React.ReactNode): boolean {
  const leftArray = React.Children.toArray(left) as React.ReactChild[]
  const rightArray = React.Children.toArray(right) as React.ReactChild[]
  if (leftArray.length === rightArray.length) {
    for (let i = 0; i < leftArray.length; i++) {
      if (!compareElements(leftArray[i], rightArray[i])) return false
    }
    return true
  }
  return false
}

function compareElements(left: React.ReactChild, right: React.ReactChild) {
  if (left === right) {
    return true
  } else if (typeof left === 'object' && typeof right === 'object') {
    if (left.type !== right.type || left.key !== right.key) return false
    const { children: lnodes, ...lprops } = left.props
    const { children: rnodes, ...rprops } = right.props
    return isEqual(lprops, rprops) && isPurelyEqual(lnodes, rnodes)
  }
  return false
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
export function useBox<T>(box: Partial<T>): T {
  const { current } = React.useRef<T>(box as T)
  if (box !== current) {
    for (const key of Object.keys(box) as (keyof T)[]) {
      current[key] = box[key] as T[keyof T]
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

const toggle = (x: boolean) => !x

export const useRenderTrigger = (): (() => void) => React.useReducer(toggle, false)[1]

type SemiControlProps<T extends React.ElementType> = {
  input: T
  value: unknown
  onChange: React.ChangeEventHandler<unknown>
} & Omit<React.ComponentProps<T>, 'as' | 'ref' | 'value' | 'onChange'>

interface ControlBox {
  value: unknown
  controlledValue: unknown
  isFocused: boolean
  onFocus?: React.FocusEventHandler<unknown>
  handleFocus: React.FocusEventHandler<unknown>
  onBlur?: React.FocusEventHandler<unknown>
  handleBlur: React.FocusEventHandler<unknown>
  onChange: React.ChangeEventHandler<unknown>
  handleChange: React.ChangeEventHandler<unknown>
}

// Use this to make an input "uncontrolled" while focused, but controlled otherwise;
// this is useful when valid values are limited but you don't want to interfere
// with user input by trying to normalize the value as they type.
export const SemiControlled = <T extends React.ElementType>(
  props: SemiControlProps<T>
): React.ReactElement => {
  const { input, value: controlledValue, onFocus, onBlur, onChange, ...rest } = props
  const trigger = useRenderTrigger()
  const vars = useBox<ControlBox>({ onFocus, onBlur, onChange, controlledValue })
  if (vars.isFocused === undefined) {
    vars.isFocused = false
    vars.handleFocus = (e: React.FocusEvent<unknown>) => {
      vars.isFocused = true
      vars.onFocus?.(e)
    }
    vars.handleBlur = (e: React.FocusEvent<unknown>) => {
      vars.isFocused = false
      vars.onBlur?.(e)
      trigger() // Now rerender with the parent's value.
    }
    vars.handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
      vars.value = e.target.value
      vars.onChange(e)
      trigger()
    }
  }
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
