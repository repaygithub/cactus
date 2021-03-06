import { RouteComponentProps } from '@reach/router'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import {
  Alert,
  Button,
  Card,
  CheckBoxField,
  Flex,
  RadioGroup,
  SelectField,
  Text,
  TextAreaField,
  TextInputField,
  ToggleField,
} from '@repay/cactus-web'
import React, { ReactElement } from 'react'

import Link from '../components/Link'

interface FieldsTypes {
  data: {
    textInput: string
    password: string
    checkbox: boolean
    radiobuttonGroup: string
    selectBox: string
    textarea: string
    togglefield: boolean
  }
  status: {
    error: boolean | undefined
    message: string
  }
}
const getInitialValues = (): FieldsTypes => ({
  data: {
    textInput: '',
    password: '',
    checkbox: true,
    radiobuttonGroup: '',
    selectBox: '',
    textarea: 'Some text for the text area',
    togglefield: false,
  },
  status: {
    error: undefined,
    message: '',
  },
})

const selectOptions = [
  { label: 'first option', value: 'first_option' },
  { label: 'second option', value: 'second_option' },
  { label: 'third option', value: 'third_option' },
  { label: 'fourth option', value: 'fourth_option' },
]
const post = (data: { [k: string]: any }): void => {
  ;(window as any).apiData = data
}

const FormExample: React.FC<RouteComponentProps> = (): ReactElement => {
  const [values, setValues] = React.useState<FieldsTypes>(getInitialValues)

  const onCheckboxChange = React.useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
      setValues((s) => ({ ...s, data: { ...s.data, [target.name]: target.checked } }))
    },
    [setValues]
  )

  const onChange = React.useCallback(
    (e: React.ChangeEvent<any>): void => {
      const { name, value } = e.target
      setValues((s) => ({ ...s, data: { ...s.data, [name]: value } }))
    },
    [setValues]
  )

  const formatKey = (key: string): string => {
    const words = key.replace('_', ' ').split(' ')
    const newWords: string[] = []

    words.forEach((word): void => {
      newWords.push(word.charAt(0).toUpperCase() + word.slice(1))
    })
    return newWords.join(' ')
  }

  const validate = (formData: typeof values.data): void => {
    let errorFound = false
    Object.keys(formData)
      .reverse()
      .forEach((key): void => {
        //@ts-ignore
        const value = formData[key]

        if (value === '') {
          errorFound = true
          setValues(
            (state): FieldsTypes => ({
              data: { ...state.data },
              status: { error: true, message: `${formatKey(key)} is empty.` },
            })
          )
          return
        }
      })

    if (errorFound === false) {
      setValues(
        (state): FieldsTypes => ({
          data: { ...state.data },
          status: { error: false, message: `Form successfully submitted` },
        })
      )
    }
  }

  const handleSubmit = (event: React.SyntheticEvent): void => {
    event.preventDefault()
    validate(values.data)
    post(values)
    console.log((window as any).apiData)
  }

  return (
    <div>
      <Link to="/">
        <NavigationChevronLeft />
        Back
      </Link>

      <Flex justifyContent="center" padding={4}>
        {values.status.error === true ? (
          <Alert status="error">{values.status.message}</Alert>
        ) : values.status.error === false ? (
          <Alert status="success"> {values.status.message} </Alert>
        ) : null}
        <Card as="form" onSubmit={handleSubmit}>
          <Text mt={0} mb={5} as="h1">
            Form Elements
          </Text>
          <TextInputField
            label="Text Input"
            name="textInput"
            value={values.data.textInput}
            onChange={onChange}
            tooltip="You can type some text in this field"
            mb={4}
          />
          <TextInputField
            label="Password Input"
            name="password"
            value={values.data.password}
            type="password"
            onChange={onChange}
            mb={4}
          />
          <CheckBoxField
            name="checkbox"
            label="CheckBox Field"
            checked={values.data.checkbox}
            onChange={onCheckboxChange}
          />
          <RadioGroup
            name="radiobuttonGroup"
            label="A set of Radio Buttons"
            my={4}
            onChange={onChange}
            value={values.data.radiobuttonGroup}
          >
            <RadioGroup.Button label="A Option" value="radio_a" />
            <RadioGroup.Button label="B Option" value="radio_b" />
            <RadioGroup.Button label="C Option" value="radio_c" />
            <RadioGroup.Button label="D Option" value="radio_d" />
          </RadioGroup>
          <SelectField
            label="Select Field"
            name="selectBox"
            value={values.data.selectBox}
            options={selectOptions}
            onChange={onChange}
          />
          <TextAreaField
            name="textarea"
            label="Text Area Field"
            value={values.data.textarea}
            onChange={onChange}
            mt={4}
          />
          <ToggleField
            mt={4}
            label="Toggle Field"
            name="togglefield"
            checked={values.data.togglefield}
            onChange={onCheckboxChange}
          />
          <Button mt={5} ml="25%" type="submit" variant="action">
            Submit
          </Button>
        </Card>
      </Flex>
    </div>
  )
}

export default FormExample
