import * as React from 'react'

import { FieldOnChangeHandler } from '../types'

interface FormHandlerProps<Value = any> {
  defaultValue?: Value
  onChange: (name: string, value: Value) => Value
  children: (state: FormHandlerState<Value>) => React.ReactNode
}

export interface FormHandlerState<Value> {
  value?: Value
  onChange: FieldOnChangeHandler<Value>
}

/**
 * Helper for Field component stories to manage value via onChange handler
 */
function FormHandler<Value>(props: FormHandlerProps<Value>): React.ReactElement {
  const { defaultValue, onChange: providedOnChange, children } = props
  const [value, setValue] = React.useState(defaultValue)
  const onChange = React.useCallback(
    (name: string, value: Value): void => {
      setValue(providedOnChange(name, value))
    },
    [providedOnChange, setValue]
  )
  return <>{children({ onChange, value })}</>
}

export default FormHandler
