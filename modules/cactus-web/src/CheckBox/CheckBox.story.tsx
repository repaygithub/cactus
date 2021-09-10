import React from 'react'

import { CheckBox } from '../'
import { actions, HIDE_CONTROL, Story } from '../helpers/storybook'

export default {
  title: 'CheckBox',
  component: CheckBox,
  argTypes: {
    id: HIDE_CONTROL,
    ...actions('onChange', 'onFocus', 'onBlur'),
  },
  args: { id: 'test', disabled: false },
} as const

export const BasicUsage: Story<typeof CheckBox> = (args) => <CheckBox name="kaneki" {...args} />

export const ControllingValueThroughProps: Story<typeof CheckBox> = (args) => (
  <CheckBox name="touka" {...args} />
)
ControllingValueThroughProps.args = { checked: false }
ControllingValueThroughProps.parameters = { storyshots: false }
