import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { TextArea } from '../'
import actions from '../helpers/storybookActionsWorkaround'
import { Status } from '../StatusMessage/StatusMessage'

type StatusOptions = { [k in Status | 'none']: Status | null }
const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

const statusOptions: StatusOptions = {
  none: null,
  success: 'success',
  warning: 'warning',
  error: 'error',
}

export default {
  title: 'TextArea',
  component: TextArea,
} as Meta

export const BasicUsage = (): React.ReactElement => (
  <TextArea
    disabled={boolean('disabled', false)}
    placeholder={text('placeholder', 'Placeholder')}
    status={select('status', statusOptions, statusOptions.none)}
    resize={boolean('resize', false)}
    {...eventLoggers}
  />
)
