import * as icons from '@repay/cactus-icons'
import { select, text } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
import Avatars, { AvatarColor, AvatarStep, AvatarUsage } from './Avatars'

import React from 'react'

const avatarIcon: AvatarColor[] = [
  'NotificationError',
  'NotificationAlert',
  'NotificationInfo',
  'StatusCheck',
]
const avatarSteps: AvatarStep[] = ['notDone', 'inProcess', 'done']
const avatarUse: AvatarUsage[] = ['alert', 'feedBack']

storiesOf('Avatars', module)
  .add('Icons', () => {
    const iconName: AvatarColor = select('icon', avatarIcon, 'NotificationError')
    const Icon = icons[iconName]
    return (
      <Avatars avatarUsage={select('usage', avatarUse, 'feedBack')} avatarColor={iconName}>
        <Icon iconSize="medium" style={{ padding: '5px 6px' }} />
      </Avatars>
    )
  })
  .add('Steps', () => {
    return (
      <Avatars avatarUsage="steps" avatarStep={select('current step', avatarSteps, 'notDone')}>
        {text('Step Number', '#')}
      </Avatars>
    )
  })
