import React from 'react'

import { DateInputField } from '../'
import { FIELD_ARGS, HIDE_CONTROL, Story, STRING } from '../helpers/storybook'

export default {
  title: 'DateInputField',
  component: DateInputField,
  argTypes: {
    className: HIDE_CONTROL,
    id: HIDE_CONTROL,
    invalidDateLabel: STRING,
    type: { options: ['date', 'datetime', 'time'] },
    ...FIELD_ARGS,
  },
  args: { label: 'Date Input Field', name: 'date-field', type: 'date', disabled: false },
  parameters: { cactus: { overrides: { maxWidth: '500px' } } },
} as const

export const DefaultUsage: Story<typeof DateInputField> = (args) => (
  <>
    <DateInputField {...args} />

    <DateInputField {...args} disabled label="Date Input Field Disabled" />
  </>
)
