import React from 'react'

import * as icons from '@repay/cactus-icons'
import { actions } from '@storybook/addon-actions'
import { boolean, select, text } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
import DarkMode from '../storySupport/DarkMode'
import TextButton, { TextButtonVariants } from './TextButton'

const textButtonVariants: TextButtonVariants[] = ['standard', 'action', 'danger']
type IconName = keyof typeof icons
const iconNames: IconName[] = Object.keys(icons) as IconName[]
const eventLoggers = actions('onClick', 'onFocus', 'onBlur')
const textButtonStories = storiesOf('TextButton', module)
const textIconButtonStories = storiesOf('Text+Icon Button', module)

textIconButtonStories.add('Basic Usage', () => {
  const iconName: IconName = select('icon', iconNames, 'ActionsAdd')
  const Icon = icons[iconName]
  return (
    <TextButton
      variant={select('variant', textButtonVariants, 'standard')}
      disabled={boolean('disabled', false)}
      inverse={boolean('inverse', false)}
      {...eventLoggers}
    >
      <Icon />
      {text('children', 'Add')}
    </TextButton>
  )
})
