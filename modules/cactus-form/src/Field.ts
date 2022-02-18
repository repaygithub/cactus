import {
  CheckBoxField,
  DateInputField,
  FileInputField,
  RadioButtonField,
  SelectField,
  TextInputField,
  ToggleField,
} from '@repay/cactus-web'
import { FieldSubscription } from 'final-form'
import PropTypes from 'prop-types'
import React from 'react'
import { FieldMetaState, useField, UseFieldConfig } from 'react-final-form'

import { makeConfigurableComponent } from './config'
import { RenderFunc, RenderProps, UnknownProps } from './types'

interface FieldConfig extends UseFieldConfig<unknown> {
  component?: React.ElementType<any>
}

const FIELD_PROPS: (keyof FieldConfig)[] = [
  'afterSubmit',
  'allowNull',
  'beforeSubmit',
  'data',
  'defaultValue',
  'format',
  'formatOnBlur',
  'initialValue',
  'isEqual',
  'multiple',
  'parse',
  'type',
  'validate',
  'validateFields',
  'value',
]

type ComponentMapper = (props: UnknownProps) => React.ElementType<any>
type PostProcessor = (props: UnknownProps, meta: FieldMetaState<unknown>) => UnknownProps

export interface FieldProps extends UnknownProps, RenderProps, FieldConfig {
  name: string
  getFieldComponent?: ComponentMapper
  processMeta?: PostProcessor
}

const DEFAULT_SUB: FieldSubscription = {
  value: true,
  error: true,
  touched: true,
  submitError: true,
  modifiedSinceLastSubmit: true as any,
}

const addError: PostProcessor = (props, meta) => {
  const error = (meta.touched && meta.error) || (!meta.modifiedSinceLastSubmit && meta.submitError)
  if (error && !props.error) {
    props.error = error
  }
  return props
}

const defaultFieldComponent: ComponentMapper = (props) => {
  const fieldType = popAttr(props, 'fieldType') || props.type
  switch (fieldType) {
    case 'boolean':
      props.type = 'checkbox'
      return ToggleField

    case 'checkbox':
      props.type = 'checkbox'
      return CheckBoxField

    case 'radio':
      props.type = 'radio'
      return RadioButtonField

    case 'select_multiple':
    case 'select-multiple':
    case 'multiSelect':
      props.multiple = true
      return SelectField
    case 'creatableDropdown':
    case 'select':
      props.comboBox = fieldType === 'creatableDropdown'
      return SelectField

    case 'date':
    case 'time':
    case 'datetime':
      props.type = fieldType
      return DateInputField

    case 'file':
      return FileInputField

    case 'hidden':
      props.type = fieldType
      return 'input'

    case 'number':
    case 'numeric':
      props.type = 'number'
      return TextInputField

    default:
      if (props.options) {
        return SelectField
      }
      return TextInputField
  }
}

const popAttr = (obj: UnknownProps, attr: string) => {
  const val = obj[attr]
  delete obj[attr]
  return val
}

const Field: RenderFunc<FieldProps> = ({
  name,
  render,
  component,
  subscription = DEFAULT_SUB,
  processMeta = addError,
  getFieldComponent = defaultFieldComponent,
  ...props
}) => {
  if (typeof props.children === 'function') {
    render = popAttr(props, 'children') as RenderFunc
  } else if (!component && !render) {
    if (props['as']) {
      component = popAttr(props, 'as') as React.ElementType<any>
    } else {
      component = getFieldComponent(props)
    }
  }
  const fieldConfig: FieldConfig = { component, subscription }
  // This removes `type` && `multiple` from props, but they're re-added by `useField`.
  for (const key of FIELD_PROPS) {
    if (key in props) {
      fieldConfig[key] = popAttr(props, key) as any
    } else if (component && (component as any)[key]) {
      // @ts-ignore For setting component defaults, useful for `format`/`parse`/`validate`.
      fieldConfig[key] = component[key]
    }
  }
  if (props.required && !fieldConfig.validate) {
    fieldConfig.validate = validateRequired
  }

  const field = useField(name, fieldConfig)
  const inputProps = Object.assign(field.input, props)
  const fieldProps = processMeta(inputProps, field.meta)
  if (render) {
    return render(fieldProps)
  } else if (component) {
    return React.createElement(component, fieldProps)
  }
  return null
}

;(Field as any).propTypes = { name: PropTypes.string.isRequired }
export default makeConfigurableComponent(Field, {
  subscription: DEFAULT_SUB,
  getFieldComponent: defaultFieldComponent,
  processMeta: addError,
})

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const validateRequired = (value: any): string | undefined => {
  if ((!value && value !== 0 && value !== false) || value?.length === 0) {
    return 'Missing required field'
  }
}
