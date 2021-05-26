import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { Flex, TextArea } from '../'
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

export const TextAreaVariants = (): React.ReactElement => (
  <Flex alignItems="center" justifyContent="center">
    <TextArea
      placeholder="Success"
      status="success"
      resize={boolean('resize', false)}
      m={2}
      {...eventLoggers}
    />
    <TextArea
      placeholder="Warning"
      status="warning"
      resize={boolean('resize', false)}
      m={2}
      {...eventLoggers}
    />
    <TextArea
      placeholder="Error"
      status="error"
      resize={boolean('resize', false)}
      m={2}
      {...eventLoggers}
    />
    <TextArea
      disabled
      placeholder="Disabled"
      status="error"
      resize={boolean('resize', false)}
      m={2}
      {...eventLoggers}
    />
  </Flex>
)

TextAreaVariants.storyName = 'Text Area with status'
