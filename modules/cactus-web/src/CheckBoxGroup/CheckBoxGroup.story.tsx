import React, { useState } from 'react'

import { CheckBoxGroup, Flex } from '../'
import { FIELD_ARGS, HIDE_CONTROL, Story } from '../helpers/storybook'

export default {
  title: 'CheckBoxGroup',
  component: CheckBoxGroup,
  argTypes: {
    required: HIDE_CONTROL,
    checked: HIDE_CONTROL,
    ...FIELD_ARGS,
  },
} as const

export const BasicUsage: Story<typeof CheckBoxGroup> = (args) => (
  <CheckBoxGroup id="cbg" {...args}>
    <CheckBoxGroup.Item name="option-1" label="Option 1" />
    <CheckBoxGroup.Item name="option-2" label="Option 2" />
    <CheckBoxGroup.Item name="option-3" label="Option 3" />
  </CheckBoxGroup>
)
BasicUsage.args = {
  label: 'My Label',
  disabled: false,
  tooltip: 'Check some boxes',
  autoTooltip: true,
  name: 'checkboxes',
}
BasicUsage.parameters = { cactus: { overrides: { maxWidth: '500px' } } }

export const WithValues = (): React.ReactElement => {
  const [value, setValue] = useState<{
    'option-1': boolean
    'option-2': boolean
    'option-3': boolean
  }>({ 'option-1': true, 'option-2': false, 'option-3': false })
  return (
    <Flex>
      <CheckBoxGroup
        name="controller"
        label="Controller"
        checked={value}
        onChange={({ target }: any) =>
          setValue((existingValue) => ({ ...existingValue, [target.name]: target.checked }))
        }
      >
        <CheckBoxGroup.Item name="option-1" label="Option 1" />
        <CheckBoxGroup.Item name="option-2" label="Option 2" />
        <CheckBoxGroup.Item name="option-3" label="Option 3" />
      </CheckBoxGroup>
      <CheckBoxGroup name="follower" label="Follower" onChange={noop} m={0}>
        <CheckBoxGroup.Item checked={value['option-1']} name="option-4" label="Option 4" />
        <CheckBoxGroup.Item checked={value['option-2']} name="option-5" label="Option 5" />
        <CheckBoxGroup.Item checked={value['option-3']} name="option-6" label="Option 6" />
      </CheckBoxGroup>
    </Flex>
  )
}
WithValues.parameters = { controls: { disable: true } }
const noop = () => undefined // Fix propTypes warning.
