import React from 'react'

import { actions } from '@storybook/addon-actions'
import { boolean, select, text } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
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
