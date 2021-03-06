import cactusTheme, { CactusTheme, generateTheme } from '@repay/cactus-theme'
import { number, select, text } from '@storybook/addon-knobs'
import React, { ReactElement } from 'react'

import * as icons from '../i'

type IconName = keyof typeof icons
const iconNames: IconName[] = Object.keys(icons) as IconName[]

export default {
  title: 'Icons',
  component: icons as any,
}

export const One = (): ReactElement => {
  const iconName: IconName = select('icon', iconNames, 'ActionsAdd')
  const Icon = icons[iconName]
  const hue: number = number('hue', 210)
  const theme: CactusTheme = generateTheme({ primaryHue: hue })

  return <Icon iconSize={text('iconSize', 'large')} style={{ color: theme.colors.callToAction }} />
}

export const All = (): ReactElement => {
  const size = text('iconSize', 'large')
  return (
    <div
      style={{
        color: cactusTheme.colors.callToAction,
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: '16px',
      }}
    >
      {Object.entries(icons)
        .filter(([name]): boolean => name !== 'iconSizes')
        .map(
          ([name, Icon]): ReactElement => (
            <Icon key={name} iconSize={size} />
          )
        )}
    </div>
  )
}
