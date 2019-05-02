import { useRef } from 'react'
import generateId from './generateId'

const useId = (customId: string | undefined, prefix: string = 'rand'): string => {
  const idRef = useRef<string | null>(customId || null)
  if (idRef.current === null) {
    idRef.current = generateId(prefix)
  }
  return idRef.current
}

export default useId
