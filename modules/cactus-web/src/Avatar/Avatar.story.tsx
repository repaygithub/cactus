import { boolean, select } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Avatar, { AvatarStatus, AvatarType } from './Avatar'

const avatarIcon: AvatarStatus[] = ['error', 'warning', 'info', 'success']
const avatarUse: AvatarType[] = ['alert', 'feedback']

storiesOf('Avatar', module).add(
  'Basic Usage',
  (): React.ReactElement => {
    return (
      <Avatar
        type={select('usage', avatarUse, 'feedback')}
        status={select('icon', avatarIcon, 'error')}
        disabled={boolean('disabled', false)}
      />
    )
  }
)
