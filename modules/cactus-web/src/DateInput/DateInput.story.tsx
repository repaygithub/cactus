import { actions } from '@storybook/addon-actions'
import { boolean, select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React, { ReactElement } from 'react'

import FormHandler from '../storySupport/FormHandler'
import DateInput from './DateInput'

const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

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
    (): ReactElement => (
      <FormHandler
        defaultValue={new Date()}
        onChange={(_, value: string | Date | null): string | Date | null => value}
      >
        {({ value, onChange }): ReactElement => (
          <DateInput
            disabled={boolean('disabled', false)}
            id="date-input-1"
            name={text('name', 'date-input')}
            type={select('type', ['date', 'datetime', 'time'], 'date')}
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
    (): ReactElement => (
      <FormHandler
        defaultValue="2019-09-16"
        onChange={(_, value: string | Date | null): string | Date | null => value}
      >
        {({ value, onChange }): ReactElement => (
          <DateInput
            disabled={boolean('disabled', false)}
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
