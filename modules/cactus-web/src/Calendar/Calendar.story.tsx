import { boolean, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import { Page } from 'puppeteer'
import React, { ReactElement } from 'react'

import { Button, Calendar } from '../'

const onChange = (e: any) => console.log(`onChange: ${e.target.value}`)

export default {
  title: 'Calendar',
  component: Calendar,
} as Meta

const INITIAL = new Date(2021, 9, 21)

export const BasicUsage = (): ReactElement => {
  const disabled = boolean('disabled', false)
  const readOnly = boolean('readonly', false)
  return (
    <form>
      <Calendar
        initialFocus={INITIAL}
        defaultValue={INITIAL}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
      >
        <Button type="reset" my={4} mx="auto">
          Reset
        </Button>
      </Calendar>
    </form>
  )
}
BasicUsage.paramaters = {
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

export const GridOnly = (): ReactElement => {
  const invalidDays = text('invalid days', '10, 20')
    .split(',')
    .map((x) => parseInt(x))
  const showHeader = boolean('show header', true)
  return (
    <Calendar.Grid
      isValidDate={(d: Date) => !invalidDays.includes(d.getDate())}
      labels={showHeader ? undefined : { weekdays: null }}
      initialFocus={INITIAL}
      selected={selected}
      aria-multiselectable
      aria-readonly
    />
  )
}
