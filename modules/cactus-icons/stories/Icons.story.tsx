import React from 'react'

import * as icons from '../i'
import { CactusTheme, generateTheme } from '@repay/cactus-theme'
import { number, select } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'

type IconName = keyof typeof icons
const iconNames: IconName[] = Object.keys(icons) as IconName[]

storiesOf('Icons', module).add('All', () => {
  const iconName: IconName = select('icon', iconNames, 'ActionsAdd')
  const Icon = icons[iconName]
  const hue: number = number('hue', 210)
  const theme: CactusTheme = generateTheme({ primaryHue: hue })

  return <Icon style={{ fontSize: '40px', fill: theme.colors.callToAction }} />
})
