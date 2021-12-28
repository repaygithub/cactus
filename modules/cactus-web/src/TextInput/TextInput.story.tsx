import React from 'react'

import { Flex, TextInput } from '../'
import { actions, HIDE_CONTROL, Story, STRING } from '../helpers/storybook'

export default {
  title: 'TextInput',
  component: TextInput,
  argTypes: {
    width: STRING,
    status: { options: ['success', 'warning', 'error'] },
    ...actions('onChange', 'onFocus', 'onBlur'),
  },
} as const

export const BasicUsage: Story<typeof TextInput> = (args) => <TextInput {...args} />
BasicUsage.args = { placeholder: 'Placeholder' }

export const TextInputStatus: Story<typeof TextInput> = (args) => (
  <Flex justifyContent="center">
    <TextInput {...args} placeholder="Success" status="success" m={2} />
    <TextInput {...args} placeholder="Warning" status="warning" m={2} />
    <TextInput {...args} placeholder="Error" status="error" m={2} />
    <TextInput {...args} disabled placeholder="Disabled" status="error" m={2} />
  </Flex>
)
TextInputStatus.argTypes = { status: HIDE_CONTROL, disabled: HIDE_CONTROL }
TextInputStatus.storyName = 'Text Input with status'
