import cactusTheme from '@repay/cactus-theme'
import { select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { Spinner } from '../'

type IconSize = 'tiny' | 'small' | 'medium' | 'large'
const iconSizes: IconSize[] = ['tiny', 'small', 'medium', 'large']
const colors = Object.keys(cactusTheme.colors)

export default {
  title: 'Spinner',
  component: Spinner,
} as Meta

export const BasicUsage = (): React.ReactElement => (
  <Spinner
    iconSize={select('iconSize', iconSizes, 'large')}
    color={select('color', colors, 'darkestContrast')}
  />
)

export const CustomSizing = (): React.ReactElement => (
  <Spinner iconSize={text('iconSize', '64px')} />
)

export const UsingSpacing = (): React.ReactElement => (
  <React.Fragment>
    <Spinner m={text('m', '0 auto')} />
  </React.Fragment>
)

UsingSpacing.storyName = 'using spacing'
