import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react'

type StateSetterWithCallback<S> = (v: SetStateAction<S>, callback: () => void) => void

const noop = () => undefined

export const useStateWithSetterCallback = <S>(
  initialState: S | (() => S)
): [S, StateSetterWithCallback<S>] => {
  const [state, setState] = useState<S>(initialState)
  const storedCallback = useRef<() => void>(noop)

  const setStateWithCallback = useCallback((v: SetStateAction<S>, callback: () => void) => {
    storedCallback.current = callback
    setState(v)
  }, [])

  useEffect(() => {
    storedCallback.current()
    storedCallback.current = noop
  }, [state])

  return [state, setStateWithCallback]
}
