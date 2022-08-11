/* State that represents a value that may or may not be controlled by a prop.
 *
 * Uses `useRefState` for synchronous updates, so `onChange` events can be
 * raised with their original event objects (e.g. using `CactusChangeEvent`).
 *
 * When controlled, the prop value is always used for rendering but the state
 * isn't updated till rendering finishes to avoid concurrency issues (React 18).
 * State updates might operate on "old" state in the interim, but since such
 * updates generally arise from user input, and the users haven't even seen the
 * "new" state yet, this is probably the correct behavior.
 *
 * If the state DOES change during render, the controlled value is dropped
 * under the assumption that another render is already pending as a result
 * of the concurrent state change.
 */
import { Reducer, useEffect } from 'react'

import useRefState, { Initializer, SyncDispatch } from './useRefState'

export type Normalizer<P, S> = (props: P, lastState: S) => S

// Advanced mapping: drops any keys that don't map to values of the state type.
type Keyof<P, S> = keyof { [K in keyof P as S extends P[K] ? K : never]: unknown }

// Unlike `useRefState`, this requires an initializer because (presumably)
// the fact that it falls back to internal state if the prop is undefined
// means the value shouldn't be undefined (unless explicitly part of the type).
interface UseControllableValue {
  /* Simple version: pass the prop name to extract the value from props. */
  <S, P>(props: P, key: Keyof<P, S>, initArg: Initializer<S>): [S, SyncDispatch<S>]
  <S, P, A = void>(props: P, key: Keyof<P, S>, reducer: Reducer<S, A>, initial: S): [
    S,
    SyncDispatch<S, A>
  ]
  <S, P, I = S, A = void>(
    props: P,
    key: Keyof<P, S>,
    reducer: Reducer<S, A>,
    initArg: I,
    initializer: (i: I) => S
  ): [S, SyncDispatch<S, A>]

  /* Normalized version: pass a function that extracts the value from props. */
  <S, P>(props: P, normalize: Normalizer<P, S>, initArg: Initializer<S>): [S, SyncDispatch<S>]
  <S, P, A = void>(props: P, normalize: Normalizer<P, S>, reducer: Reducer<S, A>, initial: S): [
    S,
    SyncDispatch<S, A>
  ]
  <S, P, I = S, A = void>(
    props: P,
    normalize: Normalizer<P, S>,
    reducer: Reducer<S, A>,
    initArg: I,
    initializer: (i: I) => S
  ): [S, SyncDispatch<S, A>]
}

// Uses generic types externally, but concrete types internally to validate logic.
type Props = { value?: number }

// If the `props` object passed is mutable, the given key will be deleted after extraction.
const extractByKey = (props: Props, key: 'value', lastState: number) => {
  const value = props[key] ?? lastState
  try {
    delete props[key]
  } catch {}
  return value
}

const useControllableValue = (
  props: Props,
  key: 'value' | Normalizer<Props, number>,
  ...args: [Reducer<number, void>, string, (s: string) => number]
): [number, SyncDispatch<number, void>] => {
  const ref = useRefState(...args)
  const preRenderState = ref.current
  const value: number =
    typeof key === 'function'
      ? key(props, preRenderState)
      : extractByKey(props, key, preRenderState)

  useEffect(() => {
    // We just used this value, so don't need to trigger a re-render;
    // however, only update if nothing has changed since render started.
    if (ref.current === preRenderState) {
      ref.current = value
    }
  })

  return [value, ref.setState]
}
export default useControllableValue as UseControllableValue
