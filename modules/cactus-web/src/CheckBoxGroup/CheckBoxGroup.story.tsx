import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React, { useState } from 'react'

import { CheckBoxGroup, Flex } from '../'

export default {
  title: 'CheckBoxGroup',
  component: CheckBoxGroup,
} as Meta

export const BasicUsage = (): React.ReactElement => (
  <CheckBoxGroup
    name="checkboxes"
    id="cbg"
    label={text('label', 'My Label')}
    disabled={boolean('disabled', false)}
    onChange={(e: any) => console.log(`'${e.target.name}' changed: ${e.target.checked}`)}
    onFocus={(e) => console.log(`'${e.target.name}' focused`)}
    onBlur={(e) => console.log(`'${e.target.name}' blurred`)}
    tooltip={text('tooltip', 'Check some boxes')}
    autoTooltip={boolean('autoTooltip', true)}
    error={text('error', '')}
    success={text('success', '')}
    warning={text('warning', '')}
    disableTooltip={select('disableTooltip', [false, true, undefined], false)}
    alignTooltip={select('alignTooltip', ['left', 'right'], 'right')}
  >
    <CheckBoxGroup.Item name="option-1" label="Option 1" />
    <CheckBoxGroup.Item name="option-2" label="Option 2" />
    <CheckBoxGroup.Item name="option-3" label="Option 3" />
  </CheckBoxGroup>
)

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
      <CheckBoxGroup name="follower" label="Follower">
        <CheckBoxGroup.Item checked={value['option-1']} name="option-4" label="Option 4" />
        <CheckBoxGroup.Item checked={value['option-2']} name="option-5" label="Option 5" />
        <CheckBoxGroup.Item checked={value['option-3']} name="option-6" label="Option 6" />
      </CheckBoxGroup>
    </Flex>
  )
}
