import React from 'react'

import { RangeField } from '../'
import { FIELD_ARGS, Story, STRING } from '../helpers/storybook'

export default {
  title: 'RangeField',
  component: RangeField,
  argTypes: {
    ...FIELD_ARGS,
    showValue: {
      options: ['hover', 'focus', 'both', 'neither'],
      mapping: { both: true, neither: false },
    },
    min: STRING,
    max: STRING,
    step: STRING,
  },
  args: {
    label: 'Range Label',
    name: 'range-field',
    tooltip: 'Enter some text',
  },
  parameters: { cactus: { overrides: { maxWidth: '500px' } } },
} as const

export const BasicUsage: Story<typeof RangeField> = (args) => (
  <>
    <RangeField {...args} />
    <RangeField label="Range Disabled" tooltip="T" disabled name="disabled" disableTooltip />
  </>
)
