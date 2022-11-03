import { AddContext } from '@storybook/addon-docs'
import React from 'react'

import { CheckBox } from '../'
import { Story } from '../helpers/storybook'
import DocsPage from './CheckBox.mdx'

const meta = {
  title: 'Cactus Web/Components/CheckBox',
  component: CheckBox,
  args: { disabled: false },
  parameters: {
    docs: {
      page: () => (
        <AddContext
          mdxComponentAnnotations={meta}
          mdxStoryNameToKey={{ 'Basic Usage': 'Basic Usage' }}
        >
          <DocsPage />
        </AddContext>
      ),
    },
  },
} as const
export default meta

export const BasicUsage: Story<typeof CheckBox> = (args) => <CheckBox name="kaneki" {...args} />

export const ControllingValueThroughProps: Story<typeof CheckBox> = (args) => (
  <CheckBox name="touka" {...args} />
)
ControllingValueThroughProps.args = { checked: false }
ControllingValueThroughProps.parameters = { storyshots: false }
