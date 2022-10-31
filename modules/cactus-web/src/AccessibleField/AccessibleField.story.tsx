import React from 'react'

import { AccessibleField } from '../'
import { Story } from '../helpers/storybook'
import docsMeta from './AccessibleField.story.mdx'

delete docsMeta.includeStories
export default {
  title: 'Cactus Web/Components/AccessibleField',
  ...docsMeta,
  parameters: {
    ...docsMeta.parameters,
    cactus: { overrides: { maxWidth: '500px' } },
  },
} as const

export const BasicUsage: Story<typeof AccessibleField> = (args) => (
  <AccessibleField {...args}>
    <input style={{ minWidth: '300px' }} />
  </AccessibleField>
)
BasicUsage.args = {
  name: 'field_name',
  label: 'Field Label',
  tooltip: 'Will only show a tooltip when text is provided.',
  disabled: false,
}

export const DifferentVariants = (): React.ReactElement => (
  <div>
    <AccessibleField disabled label="Disabled" name="field_name">
      <input style={{ minWidth: '300px' }} />
    </AccessibleField>
    <AccessibleField error="Error message" label="Error Message" name="field_name">
      <input style={{ minWidth: '300px' }} />
    </AccessibleField>
    <AccessibleField success="Success message" label="Success Message" name="field_name">
      <input style={{ minWidth: '300px' }} />
    </AccessibleField>
    <AccessibleField warning="Warning message" label="warning Message" name="field_name">
      <input style={{ minWidth: '300px' }} />
    </AccessibleField>
  </div>
)
DifferentVariants.parameters = { controls: { disable: true } }
