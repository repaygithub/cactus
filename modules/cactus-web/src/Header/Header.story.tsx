import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import Header from './Header'

export default {
  title: 'Header',
  component: Header,
} as Meta

export const BasicUsage = (): React.ReactElement => <Header />
