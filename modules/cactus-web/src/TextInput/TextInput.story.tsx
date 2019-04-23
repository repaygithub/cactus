import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, text, select } from '@storybook/addon-knobs/react'
import { actions } from '@storybook/addon-actions'
import TextInput, { Status } from './TextInput'

const textInputStories = storiesOf('TextInput', module)
const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

type StatusOptions = { [k in Status | 'none']: Status | null }

const statusOptions: StatusOptions = {
  none: null,
  success: 'success',
  invalid: 'invalid',
  error: 'error',
}

textInputStories.add('Basic Usage', () => (
  <TextInput
    disabled={boolean('disabled', false)}
    placeholder={text('placeholder', 'Placeholder')}
    status={select('status', statusOptions, statusOptions.none)}
    {...eventLoggers}
  />
))
