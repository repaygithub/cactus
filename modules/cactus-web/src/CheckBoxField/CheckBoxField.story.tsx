import React from 'react'

import { CheckBoxField } from '../'
import { HIDE_CONTROL, Story, STRING } from '../helpers/storybook'

export default {
  title: 'CheckBoxField',
  component: CheckBoxField,
  argTypes: { labelProps: HIDE_CONTROL },
  args: { disabled: false, name: 'CheckBoxFormField' },
} as const

export const BasicUsage: Story<typeof CheckBoxField> = (args) => (
  <div>
    <CheckBoxField {...args} />
    <CheckBoxField name="CheckBoxFormFieldDisabled" label="Disabled" disabled />
  </div>
)
BasicUsage.argTypes = { label: STRING }
BasicUsage.args = {
  label: 'A Label',
  id: 'checkbox-1',
  disabled: false,
}

export const MultipleCheckBoxFields: Story<
  typeof CheckBoxField,
  {
    checkboxes: string[]
  }
> = ({ checkboxes, ...args }) => (
  <div>
    {checkboxes.map((label, ix) => (
      <CheckBoxField {...args} key={ix} label={label} />
    ))}
  </div>
)
MultipleCheckBoxFields.argTypes = {
  label: HIDE_CONTROL,
  id: HIDE_CONTROL,
}
MultipleCheckBoxFields.args = { checkboxes: ['Label 1', 'Label 2', 'Label 3'] }
MultipleCheckBoxFields.storyName = 'Multiple CheckBox Fields'
