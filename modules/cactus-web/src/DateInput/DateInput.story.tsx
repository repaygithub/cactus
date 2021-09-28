import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import { Page } from 'puppeteer'
import React, { ReactElement, useState } from 'react'

import { DateInput, Flex, StatusMessage } from '../'

const eventLoggers = {
  onChange: (e: any) => console.log(`onChange '${e.target.name}': ${e.target.value}`),
  onFocus: (e: any) => console.log('onFocus:', e.target.name),
  onBlur: (e: any) => console.log('onBlur:', e.target.name),
}

export default {
  title: 'DateInput',
  component: DateInput,
} as Meta

export const BasicUsage = (): ReactElement => {
  const [invalidDate, setInvalidDate] = useState<boolean>(false)
  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <DateInput
        id="date-input-uncontrolled"
        name="date"
        {...eventLoggers}
        disabled={boolean('disabled', false)}
        onInvalidDate={(isDateInvalid) => setInvalidDate(isDateInvalid)}
        data-testid="testing"
      />
      {invalidDate && (
        <StatusMessage status="error" style={{ marginTop: '4px' }}>
          The date you've selected is invalid. Please pick another date.
        </StatusMessage>
      )}
    </Flex>
  )
}

BasicUsage.parameters = {
  cactus: { overrides: { alignItems: 'start', paddingTop: '32px' } },
}

export const ControlledWithDate = (): ReactElement => {
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
}

ControlledWithDate.storyName = 'Controlled with Date'
ControlledWithDate.parameters = {
  cactus: { overrides: { alignItems: 'start', paddingTop: '32px' } },
  beforeScreenshot: async (page: Page) => {
    await page.click('button')
  },
}

export const ControlledWithString = (): ReactElement => {
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
}

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

export const TypeDatetime = (): ReactElement => {
  const [invalidDate, setInvalidDate] = useState<boolean>(false)
  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <DateInput
        id="datetime-input"
        name="datetime"
        type="datetime"
        {...eventLoggers}
        disabled={boolean('disabled', false)}
        onInvalidDate={(isDateInvalid) => setInvalidDate(isDateInvalid)}
      />
      {invalidDate && (
        <StatusMessage status="error" style={{ marginTop: '4px' }}>
          The date you've selected is invalid. Please pick another date.
        </StatusMessage>
      )}
    </Flex>
  )
}

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
