import React from 'react'

import * as icons from '../i'
import { CactusTheme, generateTheme } from '@repay/cactus-theme'
import { IconSizes } from '../src/Svg'
import { number, select } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'

type IconName = keyof typeof icons
const iconNames: IconName[] = Object.keys(icons) as IconName[]
const iconSizes: IconSizes[] = ['tiny', 'small', 'medium', 'large']

storiesOf('Icons', module).add('All', () => {
  const iconName: IconName = select('icon', iconNames, 'ActionsAdd')
  const Icon = icons[iconName]
  const hue: number = number('hue', 210)
  const theme: CactusTheme = generateTheme({ primaryHue: hue })

  return (
    <Icon
      iconSize={select('icon size', iconSizes, 'large')}
      style={{ fill: theme.colors.callToAction }}
    />
  )
})
