import { FieldOnBlurHandler, FieldOnFocusHandler } from '../types'

const handleEvent = (
  handler: FieldOnBlurHandler | FieldOnFocusHandler | undefined,
  fieldName: string
): void => {
  if (typeof handler === 'function') {
    handler(fieldName)
  }
}

export default handleEvent
