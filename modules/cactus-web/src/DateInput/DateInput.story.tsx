import { Page } from 'puppeteer'
import React, { useState } from 'react'

import { DateInput, Flex, StatusMessage } from '../'
import { Action, actions, HIDE_CONTROL, HIDE_STYLED, Story, STRING } from '../helpers/storybook'

export default {
  title: 'DateInput',
  component: DateInput,
  argTypes: {
    ...HIDE_STYLED,
    locale: HIDE_CONTROL,
    isValidDate: HIDE_CONTROL,
    defaultValue: HIDE_CONTROL,
    value: { control: 'text', mapping: STRING.mapping },
    type: { options: ['date', 'time', 'datetime'] },
    name: STRING,
    status: { options: ['success', 'error', 'warning'] },
    id: STRING,
    ...actions('onChange', 'onFocus', 'onBlur', 'onInvalidDate'),
  },
  args: {
    id: 'date-input',
    type: 'date',
    disabled: false,
  },
} as const

type DateStory = Story<
  typeof DateInput,
  {
    onInvalidDate: Action<boolean>
    onChange: Action<React.ChangeEvent<any>>
    // In these stories, type always has a value.
    type: 'date' | 'time' | 'datetime'
  }
>

export const BasicUsage: DateStory = (args) => {
  const [invalidDate, setInvalidDate] = useState<boolean>(false)
  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <DateInput
        {...args}
        name={args.name || args.type}
        onInvalidDate={args.onInvalidDate.wrap(setInvalidDate)}
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

export const ControlledWithDate: DateStory = (args) => {
  const [value, setValue] = React.useState<Date | string | null>(new Date('10/1/2020'))
  return (
    <DateInput
      {...args}
      name={args.name || args.type}
      value={value}
      onChange={args.onChange.wrap(setValue, true)}
    />
  )
}
ControlledWithDate.argTypes = { value: HIDE_CONTROL }
ControlledWithDate.storyName = 'Controlled with Date'
ControlledWithDate.parameters = {
  cactus: { overrides: { alignItems: 'start', paddingTop: '32px' } },
  beforeScreenshot: async (page: Page) => {
    await page.click('button')
  },
}

export const ControlledWithString: DateStory = (args) => {
  const [value, setValue] = React.useState<Date | string | null>('2019-09-16')
  return (
    <DateInput
      {...args}
      name={args.name || args.type}
      value={value}
      onChange={args.onChange.wrap(setValue, true)}
    />
  )
}
ControlledWithString.argTypes = { value: HIDE_CONTROL }
ControlledWithString.args = { format: 'YYYY-MM-dd' }
ControlledWithString.storyName = 'Controlled with string'
ControlledWithString.parameters = {
  cactus: { overrides: { alignItems: 'start', paddingTop: '32px' } },
}

export const TypeTime: DateStory = (args) => <DateInput {...args} name={args.name || args.type} />
TypeTime.args = { type: 'time' }
TypeTime.storyName = 'type="time"'

export const TypeDatetime: DateStory = (args) => {
  const [invalidDate, setInvalidDate] = useState<boolean>(false)
  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <DateInput
        {...args}
        name={args.name || args.type}
        onInvalidDate={args.onInvalidDate.wrap(setInvalidDate)}
      />
      {invalidDate && (
        <StatusMessage status="error" style={{ marginTop: '4px' }}>
          The date you've selected is invalid. Please pick another date.
        </StatusMessage>
      )}
    </Flex>
  )
}
TypeDatetime.args = { type: 'datetime' }
TypeDatetime.storyName = 'type="datetime"'

export const WithIsValidDate: DateStory = (args) => (
  <div>
    <DateInput
      {...args}
      name={args.name || args.type}
      isValidDate={(date): boolean => {
        const day = date.getDay()
        return day !== 0 && day !== 6
      }}
    />
    <p>Only business days are allowed.</p>
  </div>
)

WithIsValidDate.storyName = 'with isValidDate'
