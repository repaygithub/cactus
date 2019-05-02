import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, text } from '@storybook/addon-knobs'
import CheckBoxField from './CheckBoxField'

const checkBoxFieldStories = storiesOf('CheckBoxField', module)

checkBoxFieldStories.add('Basic Usage', () => (
  <CheckBoxField
    name={text('name', 'CheckBoxFormField')}
    id={text('id', 'checkbox-1')}
    label={text('label', 'A Label')}
    disabled={boolean('disabled', false)}
  />
))

checkBoxFieldStories.add('Multiple CheckBox Fields', () => (
  <div>
    <CheckBoxField name="CheckBoxFormField" label="Label 1" />
    <CheckBoxField name="CheckBoxFormField" label="Label 2" />
    <CheckBoxField name="CheckBoxFormField" label="Label 3" />
  </div>
))
