/* A `useState`/`useReducer` replacement featuring a constant,
 * mutable state object and synchronous state updates.
 *
 * Note the return value isn't an array; I figured since we already have
 * a stable object with both the value & dispatcher attached, might as
 * well just return it instead of initializing an array.
 *
 * Just like regular refs or state, you should treat it as immutable in the
 * body of render functions, and only change the value in events/effect hooks.
 * You generally shouldn't pass the ref itself to child components, only the value.
 *
 * I got the idea for this kind of semi-mutable state from the `useSyncExternalStore` shim.
 */
import { Reducer, SetStateAction, useReducer } from 'react'

export type Initializer<T> = T | (() => T)

// Unlike normal dispatch, this returns the next state; because of the
// synchronous guarantee, the dev may want to do something with it.
export type SyncDispatch<S, A = SetStateAction<S>> = (action: A) => S

export interface RefState<State, Action = SetStateAction<State>> {
  current: State
  setState: SyncDispatch<State, Action>
}

interface UseRefState {
  <S>(initial: Initializer<S>): RefState<S>
  <S = undefined>(): RefState<S | undefined>
  <S, A = void>(reducer: Reducer<S, A>, initial: S): RefState<S, A>
  <S, I = S, A = void>(reducer: Reducer<S, A>, initArg: I, initializer: (i: I) => S): RefState<S, A>
  <S = undefined, A = void>(reducer: Reducer<S | undefined, A>): RefState<S | undefined, A>
}

// Uses generic types externally, but concrete types internally to validate logic.
type StateType = string
type ActionType = SetStateAction<StateType>
type InitArgType = 'init'
type InitializerFunc = (initArg: InitArgType) => StateType

type StateHookArgs = [Initializer<StateType>]
type ReducerHookArgs = [Reducer<StateType, ActionType>, InitArgType, InitializerFunc?]

type HookArgs = StateHookArgs | ReducerHookArgs
type InnerState = { ref: RefState<StateType, ActionType> }

const reduceRef = (state: InnerState): InnerState => ({ ...state })

const initializeRef = (args: HookArgs): InnerState => {
  let current: StateType
  if (isReducer(args)) {
    current = args[1]
    if (typeof args[2] === 'function') {
      current = args[2](args[1])
    }
  } else if (typeof args[0] === 'function') {
    current = args[0]()
  } else {
    current = args[0]
  }
  // TS appeasement; define the real thing in the hook body.
  const setState: SyncDispatch<StateType, ActionType> = false as any
  return { ref: { current, setState } }
}

// `useState` only takes one arg, and if it's a function it shouldn't have any params.
const isReducer = (args: HookArgs): args is ReducerHookArgs =>
  args.length > 1 || (typeof args[0] === 'function' && args[0].length > 0)

// This is basically what the real `useState` does behind the scenes.
const genericReducer = (state: StateType, action: ActionType) =>
  typeof action === 'function' ? action(state) : action

const useRefState = (...args: HookArgs): RefState<StateType, ActionType> => {
  const [{ ref }, triggerRender] = useReducer(reduceRef, args, initializeRef)
  if (!ref.setState) {
    const reducer: Reducer<StateType, ActionType> = isReducer(args) ? args[0] : genericReducer
    ref.setState = (action: ActionType): StateType => {
      const nextState = reducer(ref.current, action)
      if (nextState !== ref.current) {
        ref.current = nextState
        triggerRender()
      }
      return nextState
    }
  }
  return ref
}

export default useRefState as UseRefState
