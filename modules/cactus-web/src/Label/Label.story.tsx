import React from 'react'

import { Label } from '../'
import { HIDE_STYLED, Story } from '../helpers/storybook'

export default {
  title: 'Label',
  component: Label,
  argTypes: {
    children: { name: 'text' },
    ...HIDE_STYLED,
  },
} as const

export const BasicUsage: Story<typeof Label> = (args) => <Label {...args} />
BasicUsage.args = { children: 'A Label' }
