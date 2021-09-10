import React from 'react'

import { ToggleField } from '../'
import { Action, actions, HIDE_CONTROL, Story, STRING } from '../helpers/storybook'

export default {
  title: 'ToggleField',
  component: ToggleField,
  argTypes: {
    label: STRING,
    checked: HIDE_CONTROL,
    ...actions('onChange', 'onFocus', 'onBlur'),
  },
  args: { name: 'tf', label: 'Boolean Field' },
} as const

type TFStory = Story<typeof ToggleField, { onChange: Action<React.ChangeEvent> }>
export const BasicUsage: TFStory = (args) => {
  const [checked, setChecked] = React.useState<boolean>(false)
  const onChange = args.onChange.wrap(setChecked, true)
  return (
    <div>
      <ToggleField {...args} checked={checked} onChange={onChange} />
      <ToggleField name="boolean_field_disabled" label="Disabled" disabled />
    </div>
  )
}
