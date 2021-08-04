import { MutableRefObject, useRef } from 'react'

import generateId from './generateId'

const useId = (customId?: string | undefined, prefix = 'rand'): string => {
  const idRef = useRef<string | null>(customId || null)
  if (idRef.current === null) {
    idRef.current = generateId(prefix)
  }
  return idRef.current
}

export default useId

export const useRefWithId = <T>(id?: string | undefined, prefix = 'rand'): MutableRefObject<T> => {
  const ref = useRef() as MutableRefObject<T>
  if (ref.current === undefined) {
    ref.current = { id: id || generateId(prefix) } as any
  }
  return ref
}
