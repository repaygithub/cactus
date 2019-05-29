import React from 'react'

import * as icons from '@repay/cactus-icons'
import { actions } from '@storybook/addon-actions'
import { boolean, select, text } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
import TextButton, { TextButtonVariants } from './TextButton'

const textButtonVariants: TextButtonVariants[] = ['standard', 'action', 'danger']
type IconName = keyof typeof icons
const iconNames: IconName[] = Object.keys(icons) as IconName[]
const eventLoggers = actions('onClick', 'onFocus', 'onBlur')

storiesOf('TextButton', module)
  .add('Basic Usage', () => (
    <TextButton
      variant={select('variant', textButtonVariants, 'danger')}
      disabled={boolean('disabled', false)}
      inverse={boolean('inverse', false)}
      m={text('m', '')}
      {...eventLoggers}
    >
      {text('children', 'Cancel')}
    </TextButton>
  ))
  .add('Multiple', () => (
    <p>
      <TextButton
        variant={select('variant', textButtonVariants, 'standard', 'First')}
        disabled={boolean('disabled', false, 'First')}
        inverse={boolean('inverse', false, 'First')}
        m={text('m', '', 'First')}
      >
        {text('children', 'Add')}
      </TextButton>
      {' | '}
      <TextButton
        variant={select('variant', textButtonVariants, 'danger', 'Second')}
        disabled={boolean('disabled', false, 'Second')}
        inverse={boolean('inverse', false, 'Second')}
        m={text('m', '', 'Second')}
      >
        {text('children', 'Remove')}
      </TextButton>
    </p>
  ))
  .add('With Icon', () => {
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
