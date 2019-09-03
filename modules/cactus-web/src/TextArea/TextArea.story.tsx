import React from 'react'

import { actions } from '@storybook/addon-actions'
import { boolean, select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import TextArea, { Status } from './TextArea'

type StatusOptions = { [k in Status | 'none']: Status | null }
const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

const statusOptions: StatusOptions = {
  none: null,
  success: 'success',
  warning: 'warning',
  error: 'error',
}

storiesOf('TextArea', module).add('Basic Usage', () => (
  <TextArea
    disabled={boolean('disabled', false)}
    placeholder={text('placeholder', 'Placeholder')}
    status={select('status', statusOptions, statusOptions.none)}
    resize={boolean('resize', false)}
    {...eventLoggers}
  />
))
