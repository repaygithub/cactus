import React from 'react'

import { CheckBox } from '../'
import { Story } from '../helpers/storybook'

const meta = {
  title: 'Cactus Web/Components/CheckBox',
  component: CheckBox,
  args: { disabled: false },
  parameters: {
    docsPath: 'CheckBox/CheckBox.mdx',
  },
} as const
export default meta

export const BasicUsage: Story<typeof CheckBox> = (args) => <CheckBox name="kaneki" {...args} />

export const ControllingValueThroughProps: Story<typeof CheckBox> = (args) => (
  <CheckBox name="touka" {...args} />
)
ControllingValueThroughProps.args = { checked: false }
ControllingValueThroughProps.parameters = { storyshots: false }
