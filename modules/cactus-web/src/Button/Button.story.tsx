import React from 'react'
import { storiesOf } from '@storybook/react'
import { text, boolean, select } from '@storybook/addon-knobs/react'
import { actions } from '@storybook/addon-actions'
import Button, { ButtonVariants } from './Button'

const buttonVariants: ButtonVariants[] = ['standard', 'action']
const eventLoggers = actions('onClick', 'onFocus', 'onBlur')

storiesOf('Button', module).add(
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
