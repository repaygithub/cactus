import * as icons from '@repay/cactus-icons'
import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import actions from '../helpers/storybookActionsWorkaround'
import TextButton, { TextButtonVariants } from './TextButton'

const textButtonVariants: TextButtonVariants[] = ['standard', 'action', 'danger']
type IconName = keyof typeof icons
const iconNames: IconName[] = Object.keys(icons) as IconName[]
const eventLoggers = actions('onClick', 'onFocus', 'onBlur')

export default {
  title: 'TextButton',
  component: TextButton,
} as Meta

export const BasicUsage = (): React.ReactElement => (
  <div>
    <TextButton
      variant="standard"
      inverse={boolean('inverse', false)}
      m={text('m', '')}
      {...eventLoggers}
    >
      {text('children', 'Cancel')}
    </TextButton>
    <TextButton
      variant="danger"
      inverse={boolean('inverse', false)}
      m={text('m', '')}
      {...eventLoggers}
    >
      {text('children', 'Cancel')}
    </TextButton>
    <TextButton
      variant="action"
      inverse={boolean('inverse', false)}
      m={text('m', '')}
      {...eventLoggers}
    >
      {text('children', 'Cancel')}
    </TextButton>
    <TextButton
      variant="standard"
      disabled
      inverse={boolean('inverse', false)}
      m={text('m', '')}
      {...eventLoggers}
    >
      {text('children', 'Cancel')}
    </TextButton>
  </div>
)

export const Multiple = (): React.ReactElement => (
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
)

export const WithIcon = (): React.ReactElement => {
  const iconName: IconName = select('icon', iconNames, 'ActionsAdd')
  const Icon = icons[iconName] as React.ComponentType<any>
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
}
