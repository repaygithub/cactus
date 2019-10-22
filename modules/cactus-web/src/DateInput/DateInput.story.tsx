import React, { Fragment } from 'react'

import { actions } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs'
import DateInput from './DateInput'
import FormHandler from '../storySupport/FormHandler'

const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

storiesOf('DateInput', module)
  .add(
    'Basic Usage',
    () => <DateInput id="date-input-uncontrolled" name="date" {...eventLoggers} />,
    {
      cactus: { overrides: { alignItems: 'start', paddingTop: '32px' } },
    }
  )
  .add(
    'Controlled with Date',
    () => (
      <FormHandler defaultValue={new Date()} onChange={(_, value: string | Date | null) => value}>
        {({ value, onChange }) => (
          <DateInput
            id="date-input-1"
            name={text('name', 'date-input')}
            value={value}
            onChange={onChange}
          />
        )}
      </FormHandler>
    ),
    { cactus: { overrides: { alignItems: 'start', paddingTop: '32px' } } }
  )
  .add(
    'Controlled with string',
    () => (
      <FormHandler defaultValue="2019-09-16" onChange={(_, value: string | Date | null) => value}>
        {({ value, onChange }) => (
          <DateInput
            id="date-input-with-string-value"
            name={text('name', 'date-input-with-string-value')}
            value={value}
            format="YYYY-MM-dd"
            onChange={onChange}
          />
        )}
      </FormHandler>
    ),
    { cactus: { overrides: { alignItems: 'start', paddingTop: '32px' } } }
  )
  .add('type="time"', () => <DateInput id="time-input" name="time" type="time" {...eventLoggers} />)
  .add('type="datetime"', () => (
    <DateInput id="datetime-input" name="datetime" type="datetime" {...eventLoggers} />
  ))
  .add('with isValidDate', () => (
    <div>
      <DateInput
        type="date"
        id="date-with-blackouts"
        name="date_with_blackouts"
        isValidDate={date => {
          const day = date.getDay()
          return day !== 0 && day !== 6
        }}
      />
      <p>Only business days are allowed.</p>
    </div>
  ))
