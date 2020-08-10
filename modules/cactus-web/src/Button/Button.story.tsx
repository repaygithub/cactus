import * as icons from '@repay/cactus-icons'
import { actions } from '@storybook/addon-actions'
import { boolean, select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React, { ReactElement } from 'react'

import Button, { ButtonVariants } from './Button'

type IconName = keyof typeof icons
const iconNames: IconName[] = Object.keys(icons) as IconName[]
const buttonVariants: ButtonVariants[] = ['standard', 'action', 'danger', 'warning', 'success']
const eventLoggers = actions('onClick', 'onFocus', 'onBlur')
const buttonStories = storiesOf('Button', module)

buttonStories.add(
  'Basic Usage',
  (): ReactElement => (
    <Button
      variant={select('variant', buttonVariants, 'standard')}
      disabled={boolean('disabled', false)}
      loading={boolean('loading', false)}
      inverse={boolean('inverse', false)}
      loadingText={text('loadingText?', 'loading')}
      {...eventLoggers}
    >
      {text('children', 'A Button')}
    </Button>
  ),
  { options: { showPanel: true } }
)

buttonStories.add(
  'With Icon',
  (): ReactElement => {
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
)

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

buttonStories.add(
  'Loading on click',
  (): ReactElement => {
    return (
      <TimedLoading>
        {({ loading, onClick }): ReactElement => (
          <Button
            variant={select('variant', buttonVariants, 'standard')}
            disabled={boolean('disabled', false)}
            inverse={boolean('inverse', false)}
            loading={loading}
            onClick={onClick}
          >
            {text('children', 'Submit')}
          </Button>
        )}
      </TimedLoading>
    )
  }
)
