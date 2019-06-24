import React from 'react'

import {
  Box,
  Card,
  CheckBoxField,
  Flex,
  RadioButtonField,
  SelectField,
  Text,
  TextAreaField,
  TextInputField,
  ToggleField,
} from '@repay/cactus-web'
import { RouteComponentProps } from '@reach/router'
import Link from '../components/Link'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'

const getInitialValues = () => ({
  a_text_input: '',
  a_password: '',
  a_checkbox: true,
  radiobutton_group: '',
  a_select_box: '',
  a_textarea: 'Some text for the text area',
  a_togglefield: false,
})

const selectOptions = [
  { label: 'first option', value: 'first_option' },
  { label: 'second option', value: 'second_option' },
  { label: 'third option', value: 'third_option' },
  { label: 'fourth option', value: 'fourth_option' },
]

const FormExample: React.FC<RouteComponentProps> = props => {
  const [values, setValues] = React.useState(getInitialValues)
  const onChange = React.useCallback(
    (name: string, value: any) => {
      setValues(s => ({ ...s, [name]: value }))
    },
    [setValues]
  )

  return (
    <div>
      <Link to="/">
        <NavigationChevronLeft />
        Back
      </Link>
      <Flex justifyContent="center" padding={4}>
        <Card as="form">
          <Text mt={0} mb={5} as="h1">
            Form Elements
          </Text>
          <TextInputField
            label="Text Input"
            name="a_text_input"
            value={values.a_text_input}
            onChange={onChange}
            tooltip="You can type some text in this field"
            mb={4}
          />
          <TextInputField
            label="Password Input"
            name="a_password"
            value={values.a_password}
            type="password"
            onChange={onChange}
            mb={4}
          />
          <CheckBoxField
            name="a_checkbox"
            label="CheckBox Field"
            checked={values.a_checkbox}
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
              checked={values.radiobutton_group === 'radio_a'}
              onChange={onChange}
            />
            <RadioButtonField
              name="radiobutton_group"
              label="B Option"
              value="radio_b"
              checked={values.radiobutton_group === 'radio_b'}
              onChange={onChange}
            />
            <RadioButtonField
              name="radiobutton_group"
              label="C Option"
              value="radio_c"
              checked={values.radiobutton_group === 'radio_c'}
              onChange={onChange}
            />
            <RadioButtonField
              name="radiobutton_group"
              label="D Option"
              value="radio_d"
              checked={values.radiobutton_group === 'radio_d'}
              onChange={onChange}
            />
          </Box>
          <SelectField
            label="Select Field"
            name="a_select_box"
            value={values.a_select_box}
            options={selectOptions}
            onChange={onChange}
          />
          <TextAreaField
            name="a_textarea"
            label="Text Area Field"
            value={values.a_textarea}
            onChange={onChange}
            mt={4}
          />
          <ToggleField
            mt={4}
            label="Toggle Field"
            name="a_togglefield"
            value={values.a_togglefield}
            onChange={onChange}
          />
        </Card>
      </Flex>
    </div>
  )
}

export default FormExample
