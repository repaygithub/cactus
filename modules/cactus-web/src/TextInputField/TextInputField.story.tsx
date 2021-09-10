import React from 'react'

import { TextInputField } from '../'
import { FIELD_ARGS, Story } from '../helpers/storybook'
import { textStyles } from '../TextInput/TextInput'

export default {
  title: 'TextInputField',
  component: TextInputField,
  argTypes: {
    ...FIELD_ARGS,
    textStyle: { options: textStyles },
  },
  args: {
    label: 'Input Label',
    name: 'tif',
    tooltip: 'Enter some text',
    placeholder: 'Placeholder',
  },
} as const

export const BasicUsage: Story<typeof TextInputField> = (args) => (
  <div>
    <TextInputField {...args} />
    <TextInputField
      label="Input Label Disabled"
      placeholder="Placeholder"
      disabled
      tooltip="Enter some text"
      name="input-1"
      disableTooltip
    />
  </div>
)
BasicUsage.args = { placeholder: 'Placeholder' }

export const FixedWidthContainer: Story<typeof TextInputField> = (args) => (
  <div style={{ width: '235px' }}>
    <TextInputField {...args} />
  </div>
)
FixedWidthContainer.args = {
  error:
    'The input you have entered is unequivocally invalid because we absolutely do not support the information you have provided.',
}
