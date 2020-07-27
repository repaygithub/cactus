import { select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Grid from '../Grid/Grid'
import { AvatarStep, StepAvatar } from './StepAvatar'

const avatarSteps: AvatarStep[] = ['notDone', 'inProcess', 'done']

const StepManager = (props: {
  children: (state: { currentStep: number; setStep: (step: number) => void }) => React.ReactNode
}) => {
  const [currentStep, setStep] = React.useState(2)

  return <>{props.children({ currentStep, setStep })}</>
}

storiesOf('StepAvatar', module)
  .add('Basic Usage', () => {
    return (
      <StepAvatar status={select('current step', avatarSteps, 'inProcess')}>
        {text('Step Number', '#')}
      </StepAvatar>
    )
  })
  .add('Basic Example Horizontal', () => {
    return (
      <Grid justify="center">
        <Grid.Item tiny={2} />
        <Grid.Item tiny={2}>
          <StepAvatar status="done">1</StepAvatar>
        </Grid.Item>
        <Grid.Item tiny={2}>
          <StepAvatar status="done">2</StepAvatar>
        </Grid.Item>
        <Grid.Item tiny={2}>
          <StepAvatar status="inProcess">3</StepAvatar>
        </Grid.Item>
        <Grid.Item tiny={2}>
          <StepAvatar status="notDone">4</StepAvatar>
        </Grid.Item>
        <Grid.Item tiny={2} />
      </Grid>
    )
  })
  .add('Basic Example Vertical', () => {
    return (
      <Grid justify="center">
        <Grid.Item tiny={12}>
          <StepAvatar status="done">1</StepAvatar>
        </Grid.Item>

        <Grid.Item tiny={12} />
        <Grid.Item tiny={12} />

        <Grid.Item tiny={12}>
          <StepAvatar status="done">2</StepAvatar>
        </Grid.Item>

        <Grid.Item tiny={12} />
        <Grid.Item tiny={12} />

        <Grid.Item tiny={12}>
          <StepAvatar status="inProcess">3</StepAvatar>
        </Grid.Item>

        <Grid.Item tiny={12} />
        <Grid.Item tiny={12} />

        <Grid.Item tiny={12}>
          <StepAvatar status="notDone">4</StepAvatar>
        </Grid.Item>

        <Grid.Item tiny={12} />
        <Grid.Item tiny={12} />
      </Grid>
    )
  })
  .add('Interactive Example', () => {
    function getType(currentStep: number, step: number) {
      if (currentStep < step) {
        return 'notDone'
      } else if (currentStep === step) {
        return 'inProcess'
      } else {
        return 'done'
      }
    }

    return (
      <StepManager>
        {({ currentStep, setStep }) => (
          <Grid justify="center" style={{ maxWidth: '800px' }}>
            <Grid.Item tiny={3}>
              <StepAvatar as="button" onClick={() => setStep(1)} status={getType(currentStep, 1)}>
                1
              </StepAvatar>
            </Grid.Item>
            <Grid.Item tiny={3}>
              <StepAvatar as="button" onClick={() => setStep(2)} status={getType(currentStep, 2)}>
                2
              </StepAvatar>
            </Grid.Item>
            <Grid.Item tiny={3}>
              <StepAvatar as="button" onClick={() => setStep(3)} status={getType(currentStep, 3)}>
                3
              </StepAvatar>
            </Grid.Item>
            <Grid.Item tiny={3}>
              <StepAvatar as="button" onClick={() => setStep(4)} status={getType(currentStep, 4)}>
                4
              </StepAvatar>
            </Grid.Item>
          </Grid>
        )}
      </StepManager>
    )
  })
