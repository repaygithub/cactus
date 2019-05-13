import React from 'react'

import { boolean, text } from '@storybook/addon-knobs'
import { Status } from '../TextInput/TextInput'
import { storiesOf } from '@storybook/react'
import TextInputField from './TextInputField'

const textInputFieldStories = storiesOf('TextInputField', module)

type StatusOptions = { [k in Status | 'none']: Status | null }

const statusOptions: StatusOptions = {
  none: null,
  success: 'success',
  warning: 'warning',
  error: 'error',
}

textInputFieldStories.add('Basic Usage', () => (
  <TextInputField
    label={text('label', 'Input Label')}
    placeholder={text('placeholder', 'Placeholder')}
    disabled={boolean('disabled', false)}
    success={text('success', '')}
    warning={text('warning', '')}
    error={text('error', '')}
    toolTip={text('toolTip', 'Enter some text')}
    name="input-1"
  />
))

textInputFieldStories.add('Fixed Width Container', () => (
  <div style={{ width: '235px' }}>
    <TextInputField
      label={text('label', 'Input Label')}
      placeholder={text('placeholder', 'Placeholder')}
      disabled={boolean('disabled', false)}
      error={text(
        'error',
        'The input you have entered is unequivocally invalid because we absolutely do not support the information you have provided.'
      )}
      toolTip={text('toolTip', 'Enter some text')}
      name="input-2"
    />
  </div>
))
