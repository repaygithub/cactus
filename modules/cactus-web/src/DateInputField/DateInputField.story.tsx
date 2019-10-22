import React from 'react'

import { select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import DateInputField from './DateInputField'

const dateInputTypes: ('date' | 'datetime' | 'time')[] = ['date', 'datetime', 'time']

storiesOf('DateInputField', module)
  .add('Default Usage', () => (
    <DateInputField
      label={text('label', 'Date Input Field')}
      name={text('name', 'date_input_field')}
      type={select('type?', dateInputTypes, 'date')}
    />
  ))
  .add('extended props', () => (
    <DateInputField
      label={text('label', 'Time field')}
      name={text('name', 'date_input_field')}
      type={select('type?', dateInputTypes, 'date')}
      tooltip={text('tooltip?', '')}
      error={text('error?', '')}
      success={text('success?', '')}
      warning={text('warning?', '')}
    />
  ))
