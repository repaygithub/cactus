import { array, boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import { Page } from 'puppeteer'
import React from 'react'

import { SelectValueType } from '../Select/Select'
import SelectField from './SelectField'

export default {
  title: 'SelectField',
  component: SelectField,
} as Meta

export const BasicUsage = (): React.ReactElement => (
  <div>
    <SelectField
      label="Disabled"
      name="disabled"
      options={array('options', ['bird', 'plane', 'superman'])}
      disabled
      tooltip="Select what you think you see in the sky."
    />
    <SelectField
      label={text('label', `What's that in the sky?`)}
      name={text('name', 'ufo')}
      options={array('options', ['bird', 'plane', 'superman'])}
      tooltip={text('tooltip', 'Select what you think you see in the sky.')}
      success={text('success', '')}
      warning={text('warning', '')}
      error={text('error', '')}
      autoTooltip={boolean('autoTooltip', true)}
      multiple={boolean('multiple', false)}
      comboBox={boolean('comboBox', false)}
      canCreateOption={boolean('canCreateOption', true)}
      disableTooltip={select('disableTooltip', [false, true, undefined], false)}
      alignTooltip={select('alignTooltip', ['left', 'right'], 'right')}
    />
  </div>
)

BasicUsage.parameters = {
  knobs: { escapeHTML: false },
  beforeScreenshot: async (page: Page) => {
    await page.click('button[name="ufo"]')
  },
}

export const CustomStyles = (): React.ReactElement => (
  <SelectField
    label="Who ya gonna call?"
    name="when_there_is_something_strange"
    options={['Ray Parker Jr.', 'Me maybe?', 'Ghostbusters']}
    width={text('width', '')}
    margin={text('margin', '3')}
  />
)
CustomStyles.parameters = { storyshots: false }

export const ControlledForm = (): React.ReactElement => {
  const [value, setValue] = React.useState<SelectValueType>(null)
  const opts = array('options', ['bird', 'plane', 'superman'])
  return (
    <SelectField
      label={text('label', `What's that in the sky?`)}
      name={text('name', 'ufo')}
      disabled={boolean('disabled', false)}
      tooltip={text('tooltip', 'Select what you think you see in the sky.')}
      success={text('success', '')}
      warning={text('warning', '')}
      error={text('error', '')}
      onChange={(e) => setValue(e.target.value)}
      value={value}
    >
      {opts.map((val) => (
        <option value={val} key={val} />
      ))}
    </SelectField>
  )
}

ControlledForm.parameters = { knobs: { escapeHTML: false } }
ControlledForm.parameters = { storyshots: false }
