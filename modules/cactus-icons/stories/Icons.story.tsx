import React from 'react'
import { storiesOf } from '@storybook/react'
import { select, number } from '@storybook/addon-knobs/react'
import * as icons from '../i'
import { generateTheme, CactusTheme } from '@repay/cactus-theme'

type IconName = keyof typeof icons
const iconNames: IconName[] = Object.keys(icons) as IconName[]

storiesOf('Icons', module).add('All', () => {
  const iconName: IconName = select('icon', iconNames, 'ActionsAdd')
  const Icon = icons[iconName]
  const hue: number = number('hue', 210)
  const theme: CactusTheme = generateTheme({ primaryHue: hue })

  return <Icon style={{ fontSize: '40px', fill: theme.colors.callToAction }} />
})
