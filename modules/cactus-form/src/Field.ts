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
import { FieldMetaState } from 'react-final-form'

import { FC, RenderFunc, RenderProps, UnknownProps } from './types'
import useField, { Config as UseFieldConfig } from './useField'

const FIELD_PROPS: (keyof UseFieldConfig)[] = [
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
  'value',
]

type ComponentMapper = (props: UnknownProps) => React.ElementType<any>
type PostProcessor = (props: UnknownProps, meta: FieldMetaState<unknown>) => UnknownProps

export interface CactusFieldConfig {
  subscription: FieldSubscription
  getFieldComponent: ComponentMapper
  processMeta: PostProcessor
}

export interface FieldProps extends UnknownProps, RenderProps, UseFieldConfig {
  name: string
  processMeta?: PostProcessor
  getFieldComponent?: ComponentMapper
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

interface FieldComponent extends FC<FieldProps> {
  configureDefaults: (config: Partial<CactusFieldConfig>) => CactusFieldConfig
  defaultConfig: () => CactusFieldConfig
}

const Field: FieldComponent = ({
  name,
  render,
  component,
  validateFields = [],
  subscription = CONFIG.subscription,
  processMeta = CONFIG.processMeta,
  getFieldComponent = CONFIG.getFieldComponent,
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
  const fieldConfig: UseFieldConfig = { component, subscription, validateFields }
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

Field.configureDefaults = (config: Partial<CactusFieldConfig>): CactusFieldConfig => {
  const prevConfig = { ...CONFIG }
  Object.assign(CONFIG, config)
  return prevConfig
}

Field.defaultConfig = (): CactusFieldConfig => ({
  subscription: DEFAULT_SUB,
  getFieldComponent: defaultFieldComponent,
  processMeta: addError,
})

Field.propTypes = { name: PropTypes.string.isRequired }
export default Field

const CONFIG = Field.defaultConfig()

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const validateRequired = (value: any): string | undefined => {
  if ((!value && value !== 0 && value !== false) || value?.length === 0) {
    return 'Missing required field'
  }
}
