import { actions } from '@storybook/addon-actions'
import { boolean, select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import { Status } from '../StatusMessage/StatusMessage'
import TextInput from './TextInput'

const textInputStories = storiesOf('TextInput', module)
const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

type StatusOptions = { [k in Status | 'none']: Status | null }

const statusOptions: StatusOptions = {
  none: null,
  success: 'success',
  warning: 'warning',
  error: 'error',
}

textInputStories.add(
  'Basic Usage',
  (): React.ReactElement => (
    <TextInput
      disabled={boolean('disabled', false)}
      placeholder={text('placeholder', 'Placeholder')}
      status={select('status', statusOptions, statusOptions.none)}
      {...eventLoggers}
    />
  )
)
