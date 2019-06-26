import { AvatarStep, StepAvatar } from './StepAvatar'
import { select, text } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
import Grid from '../Grid/Grid'
import React from 'react'

const avatarSteps: AvatarStep[] = ['notDone', 'inProcess', 'done']

storiesOf('StepAvatar', module)
  .add('Basic Usage', () => {
    return (
      <StepAvatar type={select('current step', avatarSteps, 'inProcess')}>
        {text('Step Number', '#')}
      </StepAvatar>
    )
  })
  .add('Basic Example Horizontal', () => {
    return (
      <Grid justify="center">
        <Grid.Item tiny={2} />
        <Grid.Item tiny={2}>
          <StepAvatar type="done">1</StepAvatar>
        </Grid.Item>
        <Grid.Item tiny={2}>
          <StepAvatar type="done">2</StepAvatar>
        </Grid.Item>
        <Grid.Item tiny={2}>
          <StepAvatar type="inProcess">3</StepAvatar>
        </Grid.Item>
        <Grid.Item tiny={2}>
          <StepAvatar type="notDone">4</StepAvatar>
        </Grid.Item>
        <Grid.Item tiny={2} />
      </Grid>
    )
  })
  .add('Basic Example Vertical', () => {
    return (
      <Grid justify="center">
        <Grid.Item tiny={12}>
          <StepAvatar type="done">1</StepAvatar>
        </Grid.Item>

        <Grid.Item tiny={12} />
        <Grid.Item tiny={12} />

        <Grid.Item tiny={12}>
          <StepAvatar type="done">2</StepAvatar>
        </Grid.Item>

        <Grid.Item tiny={12} />
        <Grid.Item tiny={12} />

        <Grid.Item tiny={12}>
          <StepAvatar type="inProcess">3</StepAvatar>
        </Grid.Item>

        <Grid.Item tiny={12} />
        <Grid.Item tiny={12} />

        <Grid.Item tiny={12}>
          <StepAvatar type="notDone">4</StepAvatar>
        </Grid.Item>

        <Grid.Item tiny={12} />
        <Grid.Item tiny={12} />
      </Grid>
    )
  })
