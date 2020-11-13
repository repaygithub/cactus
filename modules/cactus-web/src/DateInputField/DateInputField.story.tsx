import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import DateInputField from './DateInputField'

const dateInputTypes: ('date' | 'datetime' | 'time')[] = ['date', 'datetime', 'time']

export default {
  title: 'DateInputField',
  component: DateInputField,
} as Meta

export const DefaultUsage = (): React.ReactElement => (
  <DateInputField
    disabled={boolean('disabled', false)}
    label={text('label', 'Date Input Field')}
    name={text('name', 'date_input_field')}
    type={select('type?', dateInputTypes, 'date')}
    width="350px"
  />
)

export const ExtendedProps = (): React.ReactElement => (
  <DateInputField
    disabled={boolean('disabled', false)}
    label={text('label', 'Time field')}
    name={text('name', 'date_input_field')}
    type={select('type?', dateInputTypes, 'date')}
    tooltip={text('tooltip?', '')}
    error={text('error?', '')}
    success={text('success?', '')}
    warning={text('warning?', '')}
    autoTooltip={boolean('autoTooltip', true)}
    disableTooltip={select('disableTooltip', [false, true, undefined], false)}
  />
)

ExtendedProps.storyName = 'extended props'
