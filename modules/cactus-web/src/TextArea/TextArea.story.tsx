import React from 'react'

import { Flex, TextArea } from '../'
import { actions, HIDE_CONTROL, SPACE, Story, STRING } from '../helpers/storybook'

export default {
  title: 'TextArea',
  component: TextArea,
  argTypes: {
    margin: SPACE,
    height: STRING,
    width: STRING,
    resize: STRING,
    ...actions('onChange', 'onFocus', 'onBlur'),
  },
} as const

export const BasicUsage: Story<typeof TextArea> = (args) => <TextArea {...args} />
BasicUsage.argTypes = {
  status: { options: ['success', 'warning', 'error'] },
}
BasicUsage.args = { placeholder: 'Placeholder' }

export const TextAreaVariants: Story<typeof TextArea> = (args) => (
  <Flex alignItems="center" justifyContent="center">
    <TextArea {...args} placeholder="Success" status="success" m={2} />
    <TextArea {...args} placeholder="Warning" status="warning" m={2} />
    <TextArea {...args} placeholder="Error" status="error" m={2} />
    <TextArea {...args} disabled placeholder="Disabled" status="error" m={2} />
  </Flex>
)
TextAreaVariants.argTypes = { disabled: HIDE_CONTROL, status: HIDE_CONTROL }
TextAreaVariants.args = { resize: 'none' }
TextAreaVariants.storyName = 'Text Area with status'
