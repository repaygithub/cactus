import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, select } from '@storybook/addon-knobs/react'
import { actions } from '@storybook/addon-actions'
import IconButton, { IconButtonVariants, IconButtonSizes } from './IconButton'
import Add from '@repay/cactus-icons/i/actions-add'
import NavLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import Trophy from '@repay/cactus-icons/i/status-trophy'
import DarkMode from '../storySupport/DarkMode'

const iconButtonVariants: IconButtonVariants[] = ['standard', 'action']
const iconButtonSizes: IconButtonSizes[] = ['tiny', 'small', 'medium', 'large']
const eventLoggers = actions('onClick', 'onFocus', 'onBlur')
const iconButtonStories = storiesOf('IconButton', module)

iconButtonStories.add('Add Button', () => (
  <IconButton
    variant={select('variant', iconButtonVariants, 'standard')}
    iconSize={select('size', iconButtonSizes, 'medium')}
    disabled={boolean('disabled', false)}
    label="add"
    {...eventLoggers}
  >
    <Add />
  </IconButton>
))

iconButtonStories.add('Inverse Add Button', () => (
  <DarkMode>
    <IconButton
      variant={select('variant', iconButtonVariants, 'standard')}
      iconSize={select('size', iconButtonSizes, 'medium')}
      disabled={boolean('disabled', false)}
      label="add"
      inverse
      {...eventLoggers}
    >
      <Add />
    </IconButton>
  </DarkMode>
))

iconButtonStories.add('Nav Left Button', () => (
  <IconButton
    variant={select('variant', iconButtonVariants, 'standard')}
    iconSize={select('size', iconButtonSizes, 'medium')}
    disabled={boolean('disabled', false)}
    label="back"
    {...eventLoggers}
  >
    <NavLeft />
  </IconButton>
))

iconButtonStories.add('Inverse Nav Left Button', () => (
  <DarkMode>
    <IconButton
      variant={select('variant', iconButtonVariants, 'standard')}
      iconSize={select('size', iconButtonSizes, 'medium')}
      disabled={boolean('disabled', false)}
      label="back"
      inverse
      {...eventLoggers}
    >
      <NavLeft />
    </IconButton>
  </DarkMode>
))

iconButtonStories.add('Trophy Button', () => (
  <IconButton
    variant={select('variant', iconButtonVariants, 'standard')}
    iconSize={select('size', iconButtonSizes, 'medium')}
    disabled={boolean('disabled', false)}
    label="you win"
    {...eventLoggers}
  >
    <Trophy />
  </IconButton>
))

iconButtonStories.add('Inverse Trophy Button', () => (
  <DarkMode>
    <IconButton
      variant={select('variant', iconButtonVariants, 'standard')}
      iconSize={select('size', iconButtonSizes, 'medium')}
      disabled={boolean('disabled', false)}
      label="you win"
      inverse
      {...eventLoggers}
    >
      <Trophy />
    </IconButton>
  </DarkMode>
))
