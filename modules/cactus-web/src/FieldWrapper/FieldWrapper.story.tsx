import { Meta } from '@storybook/react/types-6-0'
import React, { ReactElement, useCallback, useReducer } from 'react'

import Box from '../Box/Box'
import CheckBoxField from '../CheckBoxField/CheckBoxField'
import FileInputField from '../FileInputField/FileInputField'
import RadioButtonField from '../RadioButtonField/RadioButtonField'
import { OptionType } from '../Select/Select'
import SelectField from '../SelectField/SelectField'
import TextAreaField from '../TextAreaField/TextAreaField'
import TextInputField from '../TextInputField/TextInputField'
import ToggleField from '../ToggleField/ToggleField'

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

const ExampleForm = ({ withValidations }: { withValidations?: boolean }): ReactElement => {
  const [{ values, statuses }, dispatch] = useReducer(formReducer, null, initForm)

  const handleChange = useCallback(
    (name: string, value: any): void => {
      dispatch({ type: 'change', name, value })
    },
    [dispatch]
  )

  const handleBlur = useCallback(
    (name): void => {
      console.log(`onBlur(${name})`)
      dispatch({ type: 'blur', name })
    },
    [dispatch]
  )

  return (
    <div
      style={{
        overflowY: 'auto',
        height: '100vh',
        width: '100vw',
        boxSizing: 'border-box',
      }}
    >
      <Box
        as="form"
        width="50vw"
        minWidth="350px"
        margin="0 auto"
        py={5}
        onSubmit={(event: React.FormEvent<HTMLFormElement>): void => event.preventDefault()}
      >
        {fields.map(
          (field): ReactElement => {
            const Field = fieldTypeMap[field.type]
            const { validator, ...rest } = field
            const props = rest as React.ComponentPropsWithoutRef<typeof Field>
            props.value = values[field.name]
            props.onChange = handleChange
            props.onBlur = handleBlur
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
          }
        )}
      </Box>
    </div>
  )
}

export default {
  title: 'FormField',
} as Meta

export const BasicUsage = (): ReactElement => <ExampleForm />
export const WithStatuses = (): ReactElement => <ExampleForm withValidations />
