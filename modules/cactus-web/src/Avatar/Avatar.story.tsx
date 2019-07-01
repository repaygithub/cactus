import { select } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
import Avatar, { AvatarStatus, AvatarType } from './Avatar'
import React from 'react'

const avatarIcon: AvatarStatus[] = ['error', 'warning', 'info', 'success']
const avatarUse: AvatarType[] = ['alert', 'feedBack']

storiesOf('Avatar', module).add('Basic Usage', () => {
  return (
    <Avatar
      type={select('usage', avatarUse, 'feedBack')}
      status={select('icon', avatarIcon, 'error')}
    />
  )
})
