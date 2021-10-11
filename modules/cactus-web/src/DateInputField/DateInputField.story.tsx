import React from 'react'

import { Box, DateInputField } from '../'
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
} as const

export const DefaultUsage: Story<typeof DateInputField> = (args) => (
  <Box width="350px">
    <DateInputField {...args} />

    <DateInputField {...args} disabled label="Date Input Field Disabled" />
  </Box>
)
