import React from 'react'

import * as icons from '@repay/cactus-icons/i'
import { actions } from '@storybook/addon-actions'
import { boolean, select } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
import DarkMode from '../storySupport/DarkMode'
import IconButton, { IconButtonSizes, IconButtonVariants } from './IconButton'

const iconButtonVariants: IconButtonVariants[] = ['standard', 'action']
const iconButtonSizes: IconButtonSizes[] = ['tiny', 'small', 'medium', 'large']
type IconName = keyof typeof icons
const iconNames: IconName[] = Object.keys(icons) as IconName[]
const eventLoggers = actions('onClick', 'onFocus', 'onBlur')
const iconButtonStories = storiesOf('IconButton', module)

iconButtonStories.add('Basic Usage', () => {
  const iconName: IconName = select('icon', iconNames, 'ActionsAdd')
  const Icon = icons[iconName]
  return (
    <IconButton
      variant={select('variant', iconButtonVariants, 'standard')}
      iconSize={select('size', iconButtonSizes, 'medium')}
      disabled={boolean('disabled', false)}
      label="add"
      {...eventLoggers}
    >
      <Icon />
    </IconButton>
  )
})

iconButtonStories.add('Inverse Colors', () => {
  const iconName: IconName = select('icon', iconNames, 'ActionsAdd')
  const Icon = icons[iconName]
  return (
    <DarkMode>
      <IconButton
        variant={select('variant', iconButtonVariants, 'standard')}
        iconSize={select('size', iconButtonSizes, 'medium')}
        disabled={boolean('disabled', false)}
        label="add"
        inverse
        {...eventLoggers}
      >
        <Icon />
      </IconButton>
    </DarkMode>
  )
})
