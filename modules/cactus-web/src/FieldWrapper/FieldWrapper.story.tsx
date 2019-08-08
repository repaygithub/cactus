import React, { useState } from 'react'

import { storiesOf } from '@storybook/react'
import CheckBoxField from '../CheckBoxField/CheckBoxField'
import FileInputField from '../FileInputField/FileInputField'
import RadioButtonField from '../RadioButtonField/RadioButtonField'
import SelectField from '../SelectField/SelectField'
import TextAreaField from '../TextAreaField/TextAreaField'
import TextInputField from '../TextInputField/TextInputField'
import ToggleField from '../ToggleField/ToggleField'

const ExampleForm = () => {
  const [state, setState] = useState({
    input: '',
    textArea: '',
    select: '',
    fileInput: undefined,
    toggle: false,
    cb1: false,
    cb2: false,
    rb: undefined,
  })

  const handleChange = (name: string, value: any) => {
    setState(state => ({ ...state, [name]: value }))
  }

  return (
    <form style={{ width: '50%' }}>
      <TextInputField label="Field 1" name="input" onChange={handleChange} value={state.input} />
      <TextAreaField
        label="Field 2"
        name="textArea"
        onChange={handleChange}
        value={state.textArea}
      />
      <SelectField
        label="Field 3"
        name="select"
        onChange={handleChange}
        options={['option 1', 'option 2']}
        value={state.select}
      />
      <FileInputField
        label="Field 4"
        name="fileInput"
        onChange={handleChange}
        accept={['.txt']}
        width="30%"
        value={state.fileInput}
      />
      <ToggleField label="Field 5" name="toggle" onChange={handleChange} value={state.toggle} />
      <CheckBoxField label="Field 6" name="cb1" onChange={handleChange} checked={state.cb1} />
      <CheckBoxField label="Field 7" name="cb2" onChange={handleChange} checked={state.cb2} />
      <RadioButtonField
        label="Field 8"
        name="rb"
        onChange={handleChange}
        value="8"
        checked={state.rb === '8'}
      />
      <RadioButtonField
        label="Field 9"
        name="rb"
        onChange={handleChange}
        value="9"
        checked={state.rb === '9'}
      />
    </form>
  )
}

storiesOf('FormField', module).add('Basic Usage', () => <ExampleForm />)
