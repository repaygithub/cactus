import * as icons from '../../../../modules/cactus-icons'
import { select } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
import Avatars, { AvatarType, AvatarUsage } from './Avatars'

import React from 'react'

const avatarIcon: AvatarType[] = ['error', 'warning', 'info', 'success']

const avatarUse: AvatarUsage[] = ['alert', 'feedBack']

storiesOf('Avatars', module).add('Basic Usage', () => {
  const iconName: AvatarType = select('icon', avatarIcon, 'error')
  var Icon = icons['NotificationError']

  switch (iconName) {
    case 'warning':
      Icon = icons['NotificationAlert']
      break
    case 'info':
      Icon = icons['NotificationInfo']
      break
    case 'success':
      Icon = icons['StatusCheck']
      break
  }

  return (
    <Avatars avatarUsage={select('usage', avatarUse, 'feedBack')} avatarType={iconName}>
      <Icon iconSize="medium" style={{ padding: '5px 6px' }} />
    </Avatars>
  )
})
