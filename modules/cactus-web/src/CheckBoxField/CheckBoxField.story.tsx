import { boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import CheckBoxField from './CheckBoxField'

const checkBoxFieldStories = storiesOf('CheckBoxField', module)

checkBoxFieldStories.add(
  'Basic Usage',
  (): React.ReactElement => (
    <CheckBoxField
      name={text('name', 'CheckBoxFormField')}
      id={text('id', 'checkbox-1')}
      label={text('label', 'A Label')}
      disabled={boolean('disabled', false)}
    />
  )
)

checkBoxFieldStories.add(
  'Multiple CheckBox Fields',
  (): React.ReactElement => (
    <div>
      <CheckBoxField name="CheckBoxFormField" label="Label 1" />
      <CheckBoxField name="CheckBoxFormField" label="Label 2" />
      <CheckBoxField name="CheckBoxFormField" label="Label 3" />
    </div>
  )
)
