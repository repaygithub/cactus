import React from 'react'
import { storiesOf } from '@storybook/react'
import { text, boolean, select } from '@storybook/addon-knobs/react'
import { actions } from '@storybook/addon-actions'
import Button, { ButtonVariants } from './Button'
import DarkMode from '../storySupport/DarkMode'
import * as icons from '@repay/cactus-icons'

type IconName = keyof typeof icons
const iconNames: IconName[] = Object.keys(icons) as IconName[]
const buttonVariants: ButtonVariants[] = ['standard', 'action']
const eventLoggers = actions('onClick', 'onFocus', 'onBlur')
const buttonStories = storiesOf('Button', module)

buttonStories.add(
  'Basic Usage',
  () => (
    <Button
      variant={select('variant', buttonVariants, 'standard')}
      disabled={boolean('disabled', false)}
      {...eventLoggers}
    >
      {text('children', 'A Button')}
    </Button>
  ),
  { options: { showPanel: true } }
)

buttonStories.add('Inverse Colors', () => (
  <DarkMode>
    <Button
      variant={select('variant', buttonVariants, 'standard')}
      disabled={boolean('disabled', false)}
      inverse={true}
      {...eventLoggers}
    >
      {text('children', 'An Inverse Button')}
    </Button>
  </DarkMode>
))

buttonStories.add('With Icon', () => {
  const iconName: IconName = select('icon', iconNames, 'ActionsAdd')
  const Icon = icons[iconName]
  return (
    <Button
      variant={select('variant', buttonVariants, 'standard')}
      disabled={boolean('disabled', false)}
      {...eventLoggers}
    >
      <Icon /> {text('children', 'Button')}
    </Button>
)})
