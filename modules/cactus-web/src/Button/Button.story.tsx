import * as icons from '@repay/cactus-icons'
import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React, { ReactElement } from 'react'

import actions from '../helpers/storybookActionsWorkaround'
import { Flex } from '../index'
import Button, { ButtonVariants } from './Button'
type IconName = keyof typeof icons
const iconNames: IconName[] = Object.keys(icons) as IconName[]
const buttonVariants: ButtonVariants[] = ['standard', 'action', 'danger', 'warning', 'success']
const eventLoggers = actions('onClick', 'onFocus', 'onBlur')

export default {
  title: 'Button',
  component: Button,
} as Meta

export const BasicUsage = (): ReactElement => (
  <Flex justifyContent="space-around">
    <Button
      variant="standard"
      loading={boolean('loading', false)}
      inverse={boolean('inverse', false)}
      loadingText={text('loadingText?', 'loading')}
      margin="5px"
      {...eventLoggers}
    >
      {text('Text', 'Standard')}
    </Button>
    <Button
      variant="action"
      loading={boolean('loading', false)}
      inverse={boolean('inverse', false)}
      loadingText={text('loadingText?', 'loading')}
      margin="5px"
      {...eventLoggers}
    >
      Action
    </Button>
    <Button
      variant="danger"
      loading={boolean('loading', false)}
      inverse={boolean('inverse', false)}
      loadingText={text('loadingText?', 'loading')}
      margin="5px"
      {...eventLoggers}
    >
      Danger
    </Button>
    <Button
      variant="warning"
      loading={boolean('loading', false)}
      inverse={boolean('inverse', false)}
      loadingText={text('loadingText?', 'loading')}
      margin="5px"
      {...eventLoggers}
    >
      Warning
    </Button>

    <Button
      variant="success"
      loading={boolean('loading', false)}
      inverse={boolean('inverse', false)}
      loadingText={text('loadingText?', 'loading')}
      margin="5px"
      {...eventLoggers}
    >
      Success
    </Button>
    <Button
      variant="standard"
      disabled
      loading={boolean('loading', false)}
      inverse={boolean('inverse', false)}
      loadingText={text('loadingText?', 'loading')}
      margin="5px"
      {...eventLoggers}
    >
      Disabled
    </Button>
  </Flex>
)

BasicUsage.parameters = { options: { showPanel: true } }

export const WithIcon = (): ReactElement => {
  const iconName: IconName = select('icon', iconNames, 'ActionsAdd')
  const Icon = icons[iconName] as React.ComponentType<any>
  return (
    <Button
      variant={select('variant', buttonVariants, 'standard')}
      disabled={boolean('disabled', false)}
      loading={boolean('loading', false)}
      inverse={boolean('inverse', false)}
      {...eventLoggers}
    >
      <Icon /> {text('children', 'Button')}
    </Button>
  )
}

interface TimedLoadingProps {
  children: (state: { loading: boolean; onClick: any }) => React.ReactElement<any>
}

const TimedLoading: React.FC<TimedLoadingProps> = ({ children }): ReactElement => {
  const [loading, setLoading] = React.useState(false)
  const onClick = React.useCallback((): void => {
    setLoading(true)
    setTimeout((): void => {
      setLoading(false)
    }, 1000)
  }, [setLoading])

  return children({ loading, onClick })
}

export const LoadingOnClick = (): ReactElement => {
  return (
    <TimedLoading>
      {({ loading, onClick }): ReactElement => (
        <Button
          variant={select('variant', buttonVariants, 'standard')}
          disabled={boolean('disabled', false)}
          inverse={boolean('inverse', false)}
          loading={loading}
          onClick={onClick}
        />
      )}
    </TimedLoading>
  )
}

LoadingOnClick.storyName = 'Loading on click'
LoadingOnClick.parameters = { storyshots: false }

export const AsLink = (): ReactElement => (
  <Button
    variant={select('variant', buttonVariants, 'standard')}
    disabled={boolean('disabled', false)}
    as="a"
    href="https://google.com"
  >
    Link Button
  </Button>
)

AsLink.storyName = 'As Link'
