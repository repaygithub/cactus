import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { TextInput } from '../'
import actions from '../helpers/storybookActionsWorkaround'
import { Status } from '../StatusMessage/StatusMessage'
import { textStyles } from './TextInput'

export default {
  title: 'TextInput',
  component: TextInput,
} as Meta

const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

type StatusOptions = { [k in Status | 'none']: Status | null }

const statusOptions: StatusOptions = {
  none: null,
  success: 'success',
  warning: 'warning',
  error: 'error',
}

const sizeOptions = [undefined, ...textStyles]

export const BasicUsage = (): React.ReactElement => (
  <TextInput
    disabled={boolean('disabled', false)}
    placeholder={text('placeholder', 'Placeholder')}
    status={select('status', statusOptions, statusOptions.none)}
    textStyle={select('text size', sizeOptions, undefined)}
    {...eventLoggers}
  />
)
