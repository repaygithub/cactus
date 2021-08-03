import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import { Page } from 'puppeteer'
import React, { ReactElement, useState } from 'react'

// TODO Switch to global import
import { CalendarGrid } from './Grid'

const eventLoggers = {
  onChange: (e: any) => console.log(`onChange '${e.target.name}': ${e.target.value}`),
  onFocus: (e: any) => console.log('onFocus:', e.target.name),
  onBlur: (e: any) => console.log('onBlur:', e.target.name),
}

export default {
  title: 'Calendar',
  component: CalendarGrid,
} as Meta

export const BasicUsage = (): ReactElement => {
  return (<CalendarGrid month={1} year={2021} />)
}
