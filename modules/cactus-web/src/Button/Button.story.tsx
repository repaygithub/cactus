import React from 'react'

import { Button, Flex } from '../'
import { actions, HIDE_CONTROL, Icon, ICON_ARG, Story } from '../helpers/storybook'

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    as: HIDE_CONTROL,
    children: { name: 'text' },
    variant: {
      options: ['standard', 'action', 'danger', 'warning', 'success'],
    },
    ...actions('onClick', 'onFocus', 'onBlur'),
  },
  args: {
    disabled: false,
    inverse: false,
    loading: false,
    loadingText: 'loading',
  },
} as const

export const BasicUsage: Story<typeof Button> = (args) => (
  <Flex>
    <Button {...args} variant="standard" margin="5px" />
    <Button {...args} variant="action" margin="5px">
      Action
    </Button>
    <Button {...args} variant="danger" margin="5px">
      Danger
    </Button>
    <Button {...args} variant="warning" margin="5px">
      Warning
    </Button>
    <Button {...args} variant="success" margin="5px">
      Success
    </Button>
    <Button {...args} disabled margin="5px">
      Disabled
    </Button>
  </Flex>
)
BasicUsage.parameters = { options: { showPanel: true } }
BasicUsage.args = { children: 'Standard' }
BasicUsage.argTypes = { disabled: HIDE_CONTROL, variant: HIDE_CONTROL }

export const WithIcon: Story<typeof Button, { Icon: Icon }> = (args) => {
  const { Icon, children, ...props } = args
  return (
    <Button {...props}>
      <Icon /> {children}
    </Button>
  )
}
WithIcon.argTypes = { Icon: ICON_ARG }
WithIcon.args = { children: 'Button' }

export const LoadingOnClick: Story<typeof Button> = (args) => {
  const [loading, setLoading] = React.useState(false)
  const onClick = () => {
    setLoading(true)
    setTimeout((): void => {
      setLoading(false)
    }, 1000)
  }
  return <Button {...args} loading={loading} onClick={onClick} />
}
LoadingOnClick.storyName = 'Loading on click'
LoadingOnClick.args = { children: 'Submit' }
LoadingOnClick.argTypes = { loading: HIDE_CONTROL }
LoadingOnClick.parameters = { storyshots: false }

export const AsLink: Story<typeof Button, { href: string }> = (args) => <Button {...args} as="a" />
AsLink.storyName = 'As Link'
AsLink.args = { children: 'Link Button', href: 'https://google.com' }
