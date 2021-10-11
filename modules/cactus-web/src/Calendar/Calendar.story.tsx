import { Page } from 'puppeteer'
import React from 'react'

import { Button, Calendar } from '../'
import { actions, HIDE_CONTROL, HIDE_STYLED, Story, STRING } from '../helpers/storybook'

export default {
  title: 'Calendar',
  component: Calendar,
  argTypes: {
    form: HIDE_CONTROL,
    defaultValue: HIDE_CONTROL,
    initialFocus: HIDE_CONTROL,
    isValidDate: HIDE_CONTROL,
    locale: HIDE_CONTROL,
    onChange: HIDE_CONTROL,
    onMonthChange: HIDE_CONTROL,
    ...HIDE_STYLED,
  },
} as const

// Fixed date so the snapshots don't change.
const INITIAL = new Date(2021, 9, 21)

export const BasicUsage: Story<typeof Calendar> = (args) => (
  <form>
    <Calendar initialFocus={INITIAL} defaultValue={INITIAL} {...args}>
      <Button type="reset" my={4} mx="auto">
        Reset
      </Button>
    </Calendar>
  </form>
)
BasicUsage.argTypes = {
  name: STRING,
  value: STRING,
  ...actions('onChange', 'onMonthChange'),
}
BasicUsage.args = { disabled: false, readOnly: false }
BasicUsage.parameters = {
  beforeScreenshot: (page: Page) => page.click('[aria-haspopup]'),
}

const selected = (function () {
  const date = new Date(INITIAL)
  const year = date.getFullYear()
  const month = date.getMonth() - 1
  const dates = []
  for (let i = 0; i < 3; i++) {
    date.setFullYear(year, month + i, 1)
    dates.push(new Date(date))
    date.setDate(0)
    dates.push(new Date(date))
  }
  return dates
})()

const isValid = (d: Date) => !!(d.getDate() % 10)
export const GridOnly: Story<typeof Calendar.Grid, { showHeader: boolean }> = ({
  showHeader,
  ...args
}) => (
  <Calendar.Grid
    {...args}
    isValidDate={isValid}
    labels={showHeader ? undefined : { weekdays: null }}
    initialFocus={INITIAL}
    selected={selected}
    aria-multiselectable
    aria-readonly
  />
)
GridOnly.argTypes = {
  name: HIDE_CONTROL,
  value: HIDE_CONTROL,
  multiple: HIDE_CONTROL,
  readOnly: HIDE_CONTROL,
  labels: HIDE_CONTROL,
} as any
GridOnly.args = { showHeader: true }
