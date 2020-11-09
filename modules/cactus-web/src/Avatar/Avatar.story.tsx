import { boolean, select } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import Avatar, { AvatarStatus, AvatarType } from './Avatar'

const avatarIcon: AvatarStatus[] = ['error', 'warning', 'info', 'success']
const avatarUse: AvatarType[] = ['alert', 'feedback']

export default {
  title: 'Avatar',
  component: Avatar,
} as Meta

export const BasicUsage = (): React.ReactElement => {
  return (
    <Avatar
      type={select('usage', avatarUse, 'feedback')}
      status={select('icon', avatarIcon, 'error')}
      disabled={boolean('disabled', false)}
    />
  )
}
