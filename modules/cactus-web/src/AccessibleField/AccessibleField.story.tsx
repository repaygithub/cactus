import React from 'react'

import { AccessibleField } from '../'
import { FIELD_ARGS, Story } from '../helpers/storybook'

export default {
  title: 'AccessibleField',
  component: AccessibleField,
} as const

export const BasicUsage: Story<typeof AccessibleField> = (args) => (
  <AccessibleField {...args}>
    <input style={{ minWidth: '300px' }} />
  </AccessibleField>
)
BasicUsage.argTypes = {
  ...FIELD_ARGS,
}
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
