import * as icons from '../../../../modules/cactus-icons'
import { select } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
import Avatars, { AvatarType, AvatarUsage } from './Avatars'

import React from 'react'

const avatarIcon: AvatarType[] = [
  'NotificationError',
  'NotificationAlert',
  'NotificationInfo',
  'StatusCheck',
]

const avatarUse: AvatarUsage[] = ['alert', 'feedBack']

storiesOf('Avatars', module).add('Icons', () => {
  const iconName: AvatarType = select('icon', avatarIcon, 'NotificationError')
  const Icon = icons[iconName]
  return (
    <Avatars avatarUsage={select('usage', avatarUse, 'feedBack')} avatarType={iconName}>
      <Icon iconSize="medium" style={{ padding: '5px 6px' }} />
    </Avatars>
  )
})
