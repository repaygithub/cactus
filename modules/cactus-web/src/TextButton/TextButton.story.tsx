import React from 'react'
import { storiesOf } from '@storybook/react'
import { text, boolean, select } from '@storybook/addon-knobs/react'
import { actions } from '@storybook/addon-actions'
import TextButton, { TextButtonVariants } from './TextButton'
import DarkMode from '../storySupport/DarkMode'
import Add from '@repay/cactus-icons/i/actions-add'
import NavLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import Trophy from '@repay/cactus-icons/i/status-trophy'

const textButtonVariants: TextButtonVariants[] = ['standard', 'action']
const eventLoggers = actions('onClick', 'onFocus', 'onBlur')
const textButtonStories = storiesOf('TextButton', module)
const textIconButtonStories = storiesOf('Text+Icon Button', module)

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

textIconButtonStories.add('Add Button', () => (
  <TextButton
    variant={select('variant', textButtonVariants, 'standard')}
    disabled={boolean('disabled', false)}
    {...eventLoggers}
  >
    <Add />
    {text('children', 'Add')}
  </TextButton>
))

textIconButtonStories.add('Inverse Add Button', () => (
  <DarkMode>
    <TextButton
      variant={select('variant', textButtonVariants, 'standard')}
      disabled={boolean('disabled', false)}
      inverse
      {...eventLoggers}
    >
      <Add />
      {text('children', 'Add')}
    </TextButton>
  </DarkMode>
))

textIconButtonStories.add('Back Button', () => (
  <TextButton
    variant={select('variant', textButtonVariants, 'standard')}
    disabled={boolean('disabled', false)}
    {...eventLoggers}
  >
    <NavLeft />
    {text('children', 'Back')}
  </TextButton>
))

textIconButtonStories.add('Inverse Back Button', () => (
  <DarkMode>
    <TextButton
      variant={select('variant', textButtonVariants, 'standard')}
      disabled={boolean('disabled', false)}
      inverse
      {...eventLoggers}
    >
      <NavLeft />
      {text('children', 'Back')}
    </TextButton>
  </DarkMode>
))

textIconButtonStories.add('Trophy Button', () => (
  <TextButton
    variant={select('variant', textButtonVariants, 'standard')}
    disabled={boolean('disabled', false)}
    {...eventLoggers}
  >
    <Trophy />
    {text('children', 'You win!')}
  </TextButton>
))

textIconButtonStories.add('Inverse Trophy Button', () => (
  <DarkMode>
    <TextButton
      variant={select('variant', textButtonVariants, 'standard')}
      disabled={boolean('disabled', false)}
      inverse
      {...eventLoggers}
    >
      <Trophy />
      {text('children', 'You win!')}
    </TextButton>
  </DarkMode>
))
