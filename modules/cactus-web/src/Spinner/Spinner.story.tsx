import cactusTheme from '@repay/cactus-theme'
import React from 'react'

import { Spinner } from '../'
import { SPACE, Story, STRING } from '../helpers/storybook'

type IconSize = 'tiny' | 'small' | 'medium' | 'large'
const iconSizes: IconSize[] = ['tiny', 'small', 'medium', 'large']
const colors = Object.keys(cactusTheme.colors)

export default {
  title: 'Spinner',
  component: Spinner,
  argTypes: {
    iconSize: STRING,
    color: { options: colors },
  },
} as const

export const BasicUsage: Story<typeof Spinner> = (args): React.ReactElement => <Spinner {...args} />
BasicUsage.argTypes = { iconSize: { options: iconSizes } }
BasicUsage.args = { iconSize: 'large', color: 'darkestContrast' }

export const CustomSizing = BasicUsage.bind(null)
CustomSizing.args = { iconSize: '64px' }

export const UsingSpacing = BasicUsage.bind(null)
UsingSpacing.argTypes = { margin: SPACE }
UsingSpacing.args = { margin: '0 auto' }
