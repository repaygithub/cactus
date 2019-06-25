import { select } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
import Avatar, { AvatarType, AvatarUsage } from './Avatar'
import React from 'react'

const avatarIcon: AvatarType[] = ['error', 'warning', 'info', 'success']
const avatarUse: AvatarUsage[] = ['alert', 'feedBack']

storiesOf('Avatar', module).add('Basic Usage', () => {
  return (
    <Avatar
      avatarUsage={select('usage', avatarUse, 'feedBack')}
      avatarType={select('icon', avatarIcon, 'error')}
    />
  )
})
