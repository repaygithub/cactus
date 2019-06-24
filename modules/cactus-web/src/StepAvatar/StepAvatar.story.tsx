import { AvatarStep, StepAvatar } from './StepAvatar'
import { select, text } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
import React from 'react'

const avatarSteps: AvatarStep[] = ['notDone', 'inProcess', 'done']

storiesOf('StepAvatar', module).add('Steps', () => {
  return (
    <StepAvatar stepType={select('current step', avatarSteps, 'inProcess')}>
      {text('Step Number', '#')}
    </StepAvatar>
  )
})
