import { array, boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { SelectValueType } from '../Select/Select'
import FormHandler from '../storySupport/FormHandler'
import SelectField from './SelectField'

export default {
  title: 'SelectField',
  component: SelectField,
} as Meta

export const BasicUsage = (): React.ReactElement => (
  <SelectField
    label={text('label', `What's that in the sky?`)}
    name={text('name', 'ufo')}
    options={array('options', ['bird', 'plane', 'superman'])}
    disabled={boolean('disabled', false)}
    tooltip={text('tooltip', 'Select what you think you see in the sky.')}
    success={text('success', '')}
    warning={text('warning', '')}
    error={text('error', '')}
    autoTooltip={boolean('autoTooltip', true)}
    comboBox={boolean('comboBox', false)}
    canCreateOption={boolean('canCreateOption', true)}
    disableTooltip={select('disableTooltip', [false, true, undefined], false)}
  />
)

BasicUsage.parameters = { knobs: { escapeHTML: false } }

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

export const ControlledForm = (): React.ReactElement => (
  <FormHandler onChange={(name: string, value: SelectValueType): SelectValueType => value}>
    {({ value, onChange }): React.ReactElement => (
      <SelectField
        label={text('label', `What's that in the sky?`)}
        name={text('name', 'ufo')}
        options={array('options', ['bird', 'plane', 'superman'])}
        disabled={boolean('disabled', false)}
        tooltip={text('tooltip', 'Select what you think you see in the sky.')}
        success={text('success', '')}
        warning={text('warning', '')}
        error={text('error', '')}
        onChange={onChange}
        value={value}
      />
    )}
  </FormHandler>
)

ControlledForm.parameters = { knobs: { escapeHTML: false } }
