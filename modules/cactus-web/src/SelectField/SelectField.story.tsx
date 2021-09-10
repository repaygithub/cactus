import { Page } from 'puppeteer'
import React from 'react'

import { SelectField } from '../'
import { Action, FIELD_ARGS, HIDE_CONTROL, SPACE, Story, STRING } from '../helpers/storybook'
import { SelectValueType } from '../Select/Select'

export default {
  title: 'SelectField',
  component: SelectField,
  argTypes: {
    className: HIDE_CONTROL,
    ...FIELD_ARGS,
  },
  args: {
    label: `What's that in the sky?`,
    name: 'ufo',
    disabled: false,
    options: ['bird', 'plane', 'superman'],
    tooltip: 'Select what you think you see in the sky.',
  },
} as const

type SelectStory = Story<
  typeof SelectField,
  {
    options: string[]
    onChange: Action<React.ChangeEvent<{ value: SelectValueType | null }>>
  }
>

export const BasicUsage: SelectStory = (args) => (
  <div>
    <SelectField label="Disabled" name="disabled" options={[]} disabled tooltip="disabled" />
    <SelectField {...args} />
  </div>
)
BasicUsage.args = {
  label: `What's that in the sky?`,
  multiple: false,
  comboBox: false,
  canCreateOption: true,
}
BasicUsage.parameters = {
  beforeScreenshot: async (page: Page) => {
    await page.click('button[name="ufo"]')
  },
}

export const CustomStyles: SelectStory = (args) => <SelectField {...args} />
CustomStyles.argTypes = {
  width: STRING,
  margin: SPACE,
  success: HIDE_CONTROL,
  warning: HIDE_CONTROL,
  error: HIDE_CONTROL,
  tooltip: HIDE_CONTROL,
  disableTooltip: HIDE_CONTROL,
  autoTooltip: HIDE_CONTROL,
  alignTooltip: HIDE_CONTROL,
  labelProps: HIDE_CONTROL,
  id: HIDE_CONTROL,
  name: HIDE_CONTROL,
}
CustomStyles.args = {
  label: 'Who ya gonna call?',
  name: 'when_there_is_something_strange',
  options: ['Ray Parker Jr.', 'Me maybe?', 'Ghostbusters'],
  margin: '3',
  tooltip: '',
}
CustomStyles.parameters = { storyshots: false }

export const ControlledForm: SelectStory = ({ options, onChange, ...args }) => {
  const [value, setValue] = React.useState<SelectValueType>(null)
  return (
    <SelectField {...args} onChange={onChange.wrap(setValue, true)} value={value}>
      {options.map((val) => (
        <option value={val} key={val} />
      ))}
    </SelectField>
  )
}

ControlledForm.parameters = { storyshots: false }
