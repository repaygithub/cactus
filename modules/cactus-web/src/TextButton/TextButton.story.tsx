import React from 'react'
import { storiesOf } from '@storybook/react'
import { text, boolean, select } from '@storybook/addon-knobs/react'
import { actions } from '@storybook/addon-actions'
import TextButton, { TextButtonVariants } from './TextButton'
import DarkMode from '../storySupport/DarkMode'

const textButtonVariants: TextButtonVariants[] = ['standard', 'action']
const eventLoggers = actions('onClick', 'onFocus', 'onBlur')
const textButtonStories = storiesOf('TextButton', module)

textButtonStories.add('Basic Usage', () => (
  <TextButton
    variant={select('variant', textButtonVariants, 'standard')}
    disabled={boolean('disabled', false)}
    {...eventLoggers}
  >
    {text('children', 'A Text Button')}
  </TextButton>
))

textButtonStories.add('Inverse Colors', () => (
  <DarkMode>
    <TextButton
      variant={select('variant', textButtonVariants, 'standard')}
      disabled={boolean('disabled', false)}
      inverse={true}
      {...eventLoggers}
    >
      {text('children', 'An Inverse Text Button')}
    </TextButton>
  </DarkMode>
))
