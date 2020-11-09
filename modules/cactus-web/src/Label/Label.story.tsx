import { text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import Label from './Label'

export default {
  title: 'Label',
  component: Label,
} as Meta

export const BasicUsage = (): React.ReactElement => <Label>{text('label text', 'A Label')}</Label>
