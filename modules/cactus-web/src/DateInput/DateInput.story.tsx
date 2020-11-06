import { actions } from '@storybook/addon-actions'
import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React, { ReactElement } from 'react'

import FormHandler from '../storySupport/FormHandler'
import DateInput from './DateInput'

const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

export default {
  title: 'DateInput',
  component: DateInput,
} as Meta

export const BasicUsage = (): ReactElement => (
  <DateInput
    id="date-input-uncontrolled"
    name="date"
    {...eventLoggers}
    disabled={boolean('disabled', false)}
  />
)

BasicUsage.parameters = {
  cactus: { overrides: { alignItems: 'start', paddingTop: '32px' } },
}

export const ControlledWithDate = (): ReactElement => (
  <FormHandler
    defaultValue={new Date('10/1/2020')}
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
)

ControlledWithDate.storyName = 'Controlled with Date'
ControlledWithDate.parameters = {
  cactus: { overrides: { alignItems: 'start', paddingTop: '32px' } },
}

export const ControlledWithString = (): ReactElement => (
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
)

ControlledWithString.storyName = 'Controlled with string'
ControlledWithString.parameters = {
  cactus: { overrides: { alignItems: 'start', paddingTop: '32px' } },
}

export const TypeTime = (): ReactElement => (
  <DateInput
    id="time-input"
    name="time"
    type="time"
    {...eventLoggers}
    disabled={boolean('disabled', false)}
  />
)

TypeTime.storyName = 'type="time"'

export const TypeDatetime = (): ReactElement => (
  <DateInput
    id="datetime-input"
    name="datetime"
    type="datetime"
    {...eventLoggers}
    disabled={boolean('disabled', false)}
  />
)

TypeDatetime.storyName = 'type="datetime"'

export const WithIsValidDate = (): ReactElement => (
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

WithIsValidDate.storyname = 'with isValidDate'
