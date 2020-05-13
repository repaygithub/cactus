import React from 'react'

import {
  Alert,
  Box,
  Button,
  Card,
  CheckBoxField,
  Flex,
  RadioButtonField,
  SelectField,
  Spinner,
  Text,
  TextAreaField,
  TextInputField,
  ToggleField,
} from '@repay/cactus-web'
import { RouteComponentProps } from '@reach/router'
import Link from '../components/Link'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'

interface FieldsTypes {
  data: {
    text_input: string
    password: string
    checkbox: boolean
    radiobutton_group: string
    select_box: string
    textarea: string
    togglefield: boolean
  }
  status: {
    error: boolean | undefined
    message: string
  }
}
const getInitialValues = () => ({
  data: {
    text_input: '',
    password: '',
    checkbox: true,
    radiobutton_group: '',
    select_box: '',
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
const post = (data: object) => {
  ;(window as any).apiData = data
}

const FormExample: React.FC<RouteComponentProps> = () => {
  const [values, setValues] = React.useState<FieldsTypes>(getInitialValues)

  const onChange = React.useCallback(
    (name: string, value: any) => {
      setValues(s => ({
        ...s,
        data: { ...s.data, [name]: value },
        status: { ...s.status },
      }))
    },
    [setValues]
  )

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    validate(values.data)
    post(values)
    console.log((window as any).apiData)
  }

  const formatKey = (key: string) => {
    const words = key.replace('_', ' ').split(' ')
    let newWords: Array<string> = []

    words.forEach(word => {
      newWords.push(word.charAt(0).toUpperCase() + word.slice(1))
    })
    return newWords.join(' ')
  }

  const validate = (formData: typeof values.data) => {
    let errorFound = false
    Object.keys(formData)
      .reverse()
      .forEach(key => {
        //@ts-ignore
        const value = formData[key]

        if (value === '') {
          errorFound = true
          setValues(state => ({
            data: { ...state.data },
            status: { error: true, message: `${formatKey(key)} is empty.` },
          }))
          return
        }
      })

    if (errorFound === false) {
      setValues(state => ({
        data: { ...state.data },
        status: { error: false, message: `Form successfully submitted` },
      }))
    }
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
            name="text_input"
            value={values.data.text_input}
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
            onChange={onChange}
          />
          <Box my={4}>
            <Text as="h4" mb={3}>
              A set of Radio Buttons
            </Text>
            <RadioButtonField
              name="radiobutton_group"
              label="A Option"
              value="radio_a"
              checked={values.data.radiobutton_group === 'radio_a'}
              onChange={onChange}
            />
            <RadioButtonField
              name="radiobutton_group"
              label="B Option"
              value="radio_b"
              checked={values.data.radiobutton_group === 'radio_b'}
              onChange={onChange}
            />
            <RadioButtonField
              name="radiobutton_group"
              label="C Option"
              value="radio_c"
              checked={values.data.radiobutton_group === 'radio_c'}
              onChange={onChange}
            />
            <RadioButtonField
              name="radiobutton_group"
              label="D Option"
              value="radio_d"
              checked={values.data.radiobutton_group === 'radio_d'}
              onChange={onChange}
            />
          </Box>
          <SelectField
            label="Select Field"
            name="select_box"
            value={values.data.select_box}
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
            value={values.data.togglefield}
            onChange={onChange}
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
