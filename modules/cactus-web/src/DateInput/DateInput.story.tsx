import { boolean, select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React, { ReactElement } from 'react'

import DateInput from './DateInput'

const eventLoggers = {
  onChange: (e: any) => console.log(`onChange '${e.target.name}': ${e.target.value}`),
  onFocus: (e: any) => console.log('onFocus:', e.target.name),
  onBlur: (e: any) => console.log('onBlur:', e.target.name),
}

storiesOf('DateInput', module)
  .add(
    'Basic Usage',
    (): ReactElement => (
      <DateInput
        id="date-input-uncontrolled"
        name="date"
        {...eventLoggers}
        disabled={boolean('disabled', false)}
      />
    ),
    {
      cactus: { overrides: { alignItems: 'start', paddingTop: '32px' } },
    }
  )
  .add(
    'Controlled with Date',
    (): ReactElement => {
      const [value, setValue] = React.useState<Date | string | null>(new Date('10/1/2020'))
      return (
        <DateInput
          disabled={boolean('disabled', false)}
          id="date-input-1"
          name={text('name', 'date-input')}
          type={select('type', ['date', 'datetime', 'time'], 'date')}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )
    },
    { cactus: { overrides: { alignItems: 'start', paddingTop: '32px' } } }
  )
  .add(
    'Controlled with string',
    (): ReactElement => {
      const [value, setValue] = React.useState<Date | string | null>('2019-09-16')
      return (
        <DateInput
          disabled={boolean('disabled', false)}
          id="date-input-with-string-value"
          name={text('name', 'date-input-with-string-value')}
          value={value}
          format="YYYY-MM-dd"
          onChange={(e) => setValue(e.target.value)}
        />
      )
    },
    { cactus: { overrides: { alignItems: 'start', paddingTop: '32px' } } }
  )
  .add(
    'type="time"',
    (): ReactElement => (
      <DateInput
        id="time-input"
        name="time"
        type="time"
        {...eventLoggers}
        disabled={boolean('disabled', false)}
      />
    )
  )
  .add(
    'type="datetime"',
    (): ReactElement => (
      <DateInput
        id="datetime-input"
        name="datetime"
        type="datetime"
        {...eventLoggers}
        disabled={boolean('disabled', false)}
      />
    )
  )
  .add(
    'with isValidDate',
    (): ReactElement => (
      <div>
        <DateInput
          disabled={boolean('disabled', false)}
          type="date"
          id="date-with-blackouts"
          name="date_with_blackouts"
          isValidDate={(date): boolean => {
            const day = date.getDay()
            return day !== 0 && day !== 6
          }}
        />
        <p>Only business days are allowed.</p>
      </div>
    )
  )
