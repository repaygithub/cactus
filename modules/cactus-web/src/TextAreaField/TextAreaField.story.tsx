import React from 'react'

import { TextAreaField } from '../'
import { FIELD_ARGS, HIDE_CONTROL, Story } from '../helpers/storybook'

export default {
  title: 'TextAreaField',
  component: TextAreaField,
  argTypes: {
    resize: { control: 'boolean' },
    ...FIELD_ARGS,
  },
  args: {
    label: 'Field Label',
    name: 'taf',
    placeholder: 'Placeholder',
  },
} as const

export const BasicUsage: Story<typeof TextAreaField> = (args) => (
  <div>
    <TextAreaField {...args} />
    <TextAreaField
      label="Field Label Disabled"
      name="taf-1-diabled"
      placeholder="Placeholder"
      disabled
      tooltip="Some tooltip text"
      disableTooltip
    />
  </div>
)
BasicUsage.args = { tooltip: 'Some tooltip text' }

export const FixedWidthContainer: Story<typeof TextAreaField> = (args) => (
  <div style={{ width: '336px' }}>
    <TextAreaField {...args} />
  </div>
)
FixedWidthContainer.argTypes = { warning: HIDE_CONTROL, success: HIDE_CONTROL }
FixedWidthContainer.args = {
  tooltip: 'Enter some text',
  error:
    'The input you have entered is unequivocally invalid because we absolutely do not support the information you have provided.',
}
