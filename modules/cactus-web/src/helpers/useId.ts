import { useState } from 'react'
import generateId from './generateId'

const useId = (customId: string | undefined, prefix: string = 'rand'): string => {
  let componentId = customId ? customId : generateId(prefix)
  const [id] = useState(componentId)
  return id
}

export default useId
