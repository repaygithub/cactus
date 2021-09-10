import React from 'react'

import { Alert, Flex } from '../'
import { actions, HIDE_CONTROL, Story } from '../helpers/storybook'

export default {
  title: 'Alert',
  component: Alert,
} as const

export const BasicUsage: Story<
  typeof Alert,
  {
    error: string
    warning: string
    info: string
    success: string
  }
> = ({ error, warning, info, success, ...args }) => {
  return (
    <Flex flexDirection="column" alignItems="center" width="80%">
      <Alert {...args} status="error" marginY="5px">
        {error}
      </Alert>
      <Alert {...args} status="warning" marginY="5px">
        {warning}
      </Alert>
      <Alert {...args} status="info" marginY="5px">
        {info}
      </Alert>
      <Alert shadow {...args} status="success" marginY="5px">
        {success}
      </Alert>
    </Flex>
  )
}
BasicUsage.argTypes = {
  status: HIDE_CONTROL,
  onClose: HIDE_CONTROL,
  closeLabel: HIDE_CONTROL,
  error: { name: 'error message' },
  warning: { name: 'warning message' },
  info: { name: 'info message' },
  success: { name: 'success message' },
}
BasicUsage.args = { error: 'Error', warning: 'Warning', info: 'Info', success: 'Success' }

export const CloseButton: Story<typeof Alert> = (args) => (
  <Flex width="80%">
    <Alert {...args} />
  </Flex>
)
CloseButton.argTypes = { children: { name: 'message' }, ...actions('onClose') }
CloseButton.args = { children: 'Message goes here', status: 'error' }

export const SmallPushAlert: Story<typeof Alert> = (args) => (
  <Flex width="320px">
    <Alert {...args} />
  </Flex>
)
SmallPushAlert.argTypes = { children: { name: 'message' }, ...actions('onClose') }
SmallPushAlert.args = { children: 'Message goes here', type: 'push', status: 'error' }
