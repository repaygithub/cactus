import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, text } from '@storybook/addon-knobs'
import RadioButtonField from './RadioButtonField'
import { actions } from '@storybook/addon-actions'

const radioButtonFieldStories = storiesOf('RadioButtonField', module)
const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

radioButtonFieldStories.add('Basic Usage', () => (
  <RadioButtonField
    id="my-id"
    name="rbf"
    label={text('label', 'A Label')}
    disabled={boolean('disabled', false)}
    {...eventLoggers}
  />
))

radioButtonFieldStories.add('Multiple RadioButton Fields', () => (
  <div>
    <RadioButtonField name="rbf" label="Label 1" {...eventLoggers} />
    <RadioButtonField name="rbf" label="Label 2" {...eventLoggers} />
    <RadioButtonField name="rbf" label="Label 3" {...eventLoggers} />
  </div>
))
