import { FieldOnBlurHandler, FieldOnFocusHandler } from '../types'

const handleEvent = (
  handler: FieldOnBlurHandler | FieldOnFocusHandler | undefined,
  fieldName: string
) => {
  if (typeof handler === 'function') {
    handler(fieldName)
  }
}

export default handleEvent
