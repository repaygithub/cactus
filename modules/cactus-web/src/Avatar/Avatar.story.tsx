import { select } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import Avatar, { AvatarStatus, AvatarType } from './Avatar'
import React from 'react'

const avatarIcon: AvatarStatus[] = ['error', 'warning', 'info', 'success']
const avatarUse: AvatarType[] = ['alert', 'feedback']

storiesOf('Avatar', module).add('Basic Usage', () => {
  return (
    <Avatar
      type={select('usage', avatarUse, 'feedback')}
      status={select('icon', avatarIcon, 'error')}
    />
  )
})
