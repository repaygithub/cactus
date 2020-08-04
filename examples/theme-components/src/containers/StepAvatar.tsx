import { RouteComponentProps } from '@reach/router'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import { Button, Flex, Grid, StepAvatar, Text } from '@repay/cactus-web'
import React, { ReactElement } from 'react'

import Link from '../components/Link'

const StepAvatarExample: React.FC<RouteComponentProps> = (): ReactElement => {
  const StepManager = (props: {
    children: (state: {
      currentStep: number
      changeStep: (step: number) => void
    }) => React.ReactNode
  }): ReactElement => {
    const [currentStep, setStep] = React.useState(2)

    const changeStep = (val: number): void => {
      if (val > 0 && val < 5) {
        setStep(val)
      }
    }

    return <>{props.children({ currentStep, changeStep })}</>
  }

  const getType = (currentStep: number, step: number): 'notDone' | 'inProcess' | 'done' => {
    if (currentStep < step) {
      return 'notDone'
    } else if (currentStep === step) {
      return 'inProcess'
    } else {
      return 'done'
    }
  }
  return (
    <div>
      <Link to="/">
        <NavigationChevronLeft />
        Back
      </Link>
      <Text as="h1" textAlign="center">
        Step Avatar
      </Text>
      <Flex justifyContent="center">
        <StepManager>
          {({ currentStep, changeStep }): ReactElement => (
            <Grid justify="center" style={{ maxWidth: '800px' }}>
              <Grid.Item tiny={3}>
                <StepAvatar as="button" status={getType(currentStep, 1)}>
                  1
                </StepAvatar>
              </Grid.Item>
              <Grid.Item tiny={3}>
                <StepAvatar as="button" status={getType(currentStep, 2)}>
                  2
                </StepAvatar>
              </Grid.Item>
              <Grid.Item tiny={3}>
                <StepAvatar as="button" status={getType(currentStep, 3)}>
                  3
                </StepAvatar>
              </Grid.Item>
              <Grid.Item tiny={3}>
                <StepAvatar as="button" status={getType(currentStep, 4)}>
                  4
                </StepAvatar>
              </Grid.Item>
              <Grid.Item tiny={6}>
                <Button onClick={(): void => changeStep(currentStep - 1)}>Previous step</Button>
              </Grid.Item>
              <Grid.Item tiny={6}>
                <Button onClick={(): void => changeStep(currentStep + 1)}>Next step</Button>
              </Grid.Item>
            </Grid>
          )}
        </StepManager>
      </Flex>
    </div>
  )
}
export default StepAvatarExample
