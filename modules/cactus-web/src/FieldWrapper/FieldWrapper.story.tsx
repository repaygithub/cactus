import React, { ReactElement, useReducer } from 'react'

import {
  Box,
  CheckBoxField,
  FileInputField,
  RadioButtonField,
  SelectField,
  TextAreaField,
  TextInputField,
  ToggleField,
} from '../'
import { Action, actions, HIDE_CONTROL, SPACE, Story } from '../helpers/storybook'
import { OptionType } from '../Select/Select'

type FieldTypes = 'text' | 'textarea' | 'select' | 'file' | 'toggle' | 'checkbox' | 'radio'

type FieldStatus = ['error' | 'warning' | 'success', string]

type FieldValidatorFunc = (field: FieldTypeObjects, value: any) => FieldStatus | null

type FieldTypeObjects = {
  label: string
  name: string
  tooltip?: string
  validator?: FieldValidatorFunc
} & (
  | { type: 'text' | 'textarea' | 'toggle' }
  | { type: 'select'; options: OptionType[] | string[] }
  | { type: 'file'; accept?: string[] }
  | { type: 'checkbox'; value?: string | number }
  | { type: 'radio'; value: string }
)

const fieldTypeMap: { [k in FieldTypes]: React.ComponentType<any> } = {
  text: TextInputField,
  textarea: TextAreaField,
  select: SelectField,
  file: FileInputField,
  toggle: ToggleField,
  checkbox: CheckBoxField,
  radio: RadioButtonField,
}

const isRequired: FieldValidatorFunc = (field, value): FieldStatus | null => {
  return Boolean(value) ? null : ['error', `This field is required.`]
}

const fields: FieldTypeObjects[] = [
  {
    type: 'text',
    label: 'Field 1',
    name: 'input',
    validator: isRequired,
  },
  {
    type: 'textarea',
    label: 'Field 2',
    name: 'textArea',
    validator: (_, value): FieldStatus | null =>
      typeof value === 'string' && value.length < 300
        ? ['warning', 'Recommended length of at least 300.']
        : null,
  },
  {
    type: 'select',
    label: 'Field 3 (Select)',
    name: 'select',
    options: ['option 1', 'option 2'],
    validator: (_, value): FieldStatus | null =>
      Boolean(value) ? ['success', 'Always successful.'] : null,
  },
  {
    type: 'file',
    label: 'Field 4 (File)',
    name: 'fileInput',
    accept: ['.txt'],
    tooltip: 'Accepts text files only.',
  },
  {
    type: 'toggle',
    label: 'Field 5 (Toggle)',
    name: 'toggle',
  },
  {
    type: 'checkbox',
    label: 'Field 6',
    name: 'cb1',
  },
  {
    type: 'checkbox',
    label: 'Field 7',
    name: 'cb2',
  },
  {
    type: 'radio',
    label: 'Field 7',
    name: 'rb',
    value: 'a',
  },
  {
    type: 'radio',
    label: 'Field 8',
    name: 'rb',
    value: 'b',
  },
]

interface FormState {
  values: { [k: string]: any }
  statuses: { [k: string]: null | FieldStatus }
}

interface FormAction {
  type: 'change' | 'blur'
  name: string
  value?: any
}

const initForm = (): FormState => ({
  values: {
    input: '',
    textArea: '',
    select: '',
    fileInput: undefined,
    toggle: false,
    cb1: false,
    cb2: false,
    rb: undefined,
  },
  statuses: {
    input: ['error', 'This field is required.'],
    textArea: ['warning', 'Recommended length of at least 300.'],
    select: ['success', 'Always successful'],
  },
})

const formReducer = (state: FormState, action: FormAction): FormState | never => {
  switch (action.type) {
    case 'change': {
      return {
        ...state,
        values: { ...state.values, [action.name]: action.value },
      }
    }
    case 'blur': {
      const field = fields.find((f): boolean => f.name === action.name)
      if (field && typeof field.validator === 'function') {
        return {
          ...state,
          statuses: {
            ...state.statuses,
            [action.name]: field.validator(field, state.values[action.name]),
          },
        }
      }
    }
  }

  return state
}

const ExampleForm: Story<{
  withValidations: boolean
  fullWidth: boolean
  marginOverride: string
  onChange: Action<React.ChangeEvent>
  onBlur: Action<React.FocusEvent>
}> = ({ withValidations, fullWidth, marginOverride, onChange, onBlur }) => {
  const [{ values, statuses }, dispatch] = useReducer(formReducer, null, initForm)
  const handleChange = onChange.wrap(({ target }: any) => {
    const value = target.type === 'checkbox' ? target.checked : target.value
    dispatch({ type: 'change', name: target.name, value })
  })

  const handleBlur = onBlur.wrap((e: any) => dispatch({ type: 'blur', name: e.target.name }))

  return (
    <Box overflowY="auto" height="100vh" width="100vw">
      <Box
        as="form"
        width={fullWidth ? '100vw' : '50vw'}
        minWidth="350px"
        margin="0 auto"
        py={5}
        onSubmit={(event: React.FormEvent<HTMLFormElement>): void => event.preventDefault()}
      >
        {fields.map((field): ReactElement => {
          const Field = fieldTypeMap[field.type]
          const { validator, ...rest } = field
          const props = rest as React.ComponentPropsWithoutRef<typeof Field>
          props.value = values[field.name]
          props.onChange = handleChange
          props.onBlur = handleBlur
          props.margin = marginOverride
          switch (field.type) {
            case 'radio': {
              props.value = field.value
              props.checked = field.value === values[field.name]
              break
            }
            case 'checkbox': {
              props.checked = values[field.name]
              break
            }
          }
          if (withValidations && Array.isArray(statuses[field.name])) {
            const [status, message] = statuses[field.name] as FieldStatus
            props[status] = message
          }
          return <Field key={field.type + field.label} {...props} />
        })}
      </Box>
    </Box>
  )
}

export default {
  title: 'FormField',
  argTypes: { marginOverride: SPACE, ...actions('onChange', 'onBlur') },
  args: { fullWidth: false },
} as const

export const BasicUsage = ExampleForm.bind(null)
export const WithStatuses = ExampleForm.bind(null)
WithStatuses.argTypes = { withValidations: HIDE_CONTROL }
WithStatuses.args = { withValidations: true }
