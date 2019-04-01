import React from 'react'
import { storiesOf } from '@storybook/react'
import { text, boolean, select } from '@storybook/addon-knobs/react'
import { actions } from '@storybook/addon-actions'
import Button, { ButtonVariants } from './Button'
import DarkMode from '../storySupport/DarkMode'

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

buttonStories.add(
  'Inverse Colors',
  () => (
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
  )
)
