import { select } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
import Avatars, { AvatarType, AvatarUsage } from './Avatars'
import React from 'react'

const avatarIcon: AvatarType[] = ['error', 'warning', 'info', 'success']
const avatarUse: AvatarUsage[] = ['alert', 'feedBack']

storiesOf('Avatars', module).add('Basic Usage', () => {
  return (
    <Avatars
      avatarUsage={select('usage', avatarUse, 'feedBack')}
      avatarType={select('icon', avatarIcon, 'error')}
    />
  )
})
