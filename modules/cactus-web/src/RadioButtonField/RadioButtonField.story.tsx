import React from 'react'

import { RadioButtonField } from '../'
import { actions, HIDE_CONTROL, Story, STRING } from '../helpers/storybook'

export default {
  title: 'RadioButtonField',
  component: RadioButtonField,
  argTypes: {
    label: STRING,
    ...actions('onChange', 'onFocus', 'onBlur'),
  },
  args: { name: 'rbf' },
} as const

export const BasicUsage: Story<typeof RadioButtonField> = (args) => (
  <div>
    <RadioButtonField {...args} />
    <RadioButtonField {...args} label="Disabled" disabled />
  </div>
)
BasicUsage.args = { label: 'A Label' }

type MultiStory = Story<typeof RadioButtonField, { buttons: string[] }>
export const MultipleRadioButtonFields: MultiStory = ({ buttons, ...args }) => (
  <div>
    {buttons.map((label, i) => (
      <RadioButtonField key={i} {...args} label={label} />
    ))}
  </div>
)
MultipleRadioButtonFields.argTypes = { label: HIDE_CONTROL }
MultipleRadioButtonFields.args = { buttons: ['Label 1', 'Label 2', 'Label 3'] }
MultipleRadioButtonFields.storyName = 'Multiple RadioButton Fields'
