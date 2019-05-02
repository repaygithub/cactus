import * as React from 'react'
import { FieldOnChangeHandler } from '../types'

interface FormHandlerProps<Element extends HTMLElement, Value> {
  defaultValue: Value
  onChange: (name: string, value: Value) => Value
  children: (state: FormHandlerState<Element, Value>) => React.ReactNode
}

export interface FormHandlerState<Element extends HTMLElement, Value> {
  value: Value
  onChange: FieldOnChangeHandler<Value>
}

/**
 * Helper for Field component stories to manage value via onChange handler
 */
const FormHandler = <Element extends HTMLElement, Value>(
  props: FormHandlerProps<Element, Value>
) => {
  const { defaultValue, onChange: providedOnChange, children } = props
  const [value, setValue] = React.useState(defaultValue)
  const onChange = React.useCallback(
    (name: string, value: Value) => {
      setValue(providedOnChange(name, value))
    },
    [providedOnChange, setValue]
  )
  return <>{children({ onChange, value })}</>
}

export default FormHandler
