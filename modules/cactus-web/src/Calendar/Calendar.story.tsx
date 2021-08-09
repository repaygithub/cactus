import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import { Page } from 'puppeteer'
import React, { ReactElement, useState } from 'react'

import { Calendar } from '../'

const eventLoggers = {
  onChange: (e: any) => console.log(`onChange '${e.target.name}': ${e.target.value}`),
  onFocus: (e: any) => console.log('onFocus:', e.target.name),
  onBlur: (e: any) => console.log('onBlur:', e.target.name),
}

export default {
  title: 'Calendar',
  component: Calendar,
} as Meta

export const BasicUsage = (): ReactElement => {
  return <Calendar />
}

export const GridOnly = (): ReactElement => {
  return <Calendar.Grid />
}
