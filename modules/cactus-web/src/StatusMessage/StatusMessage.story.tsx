import React from 'react'

import { Flex, StatusMessage } from '../'
import { HIDE_CONTROL, SPACE, Story } from '../helpers/storybook'

export default {
  title: 'StatusMessage',
  component: StatusMessage,
} as const

export const BasicUsage: Story<
  typeof StatusMessage,
  {
    error: string
    warning: string
    info: string
    success: string
  }
> = ({ error, warning, info, success, ...args }) => {
  return (
    <Flex flexDirection="column" width="35%">
      <StatusMessage {...args} status="error" marginY="5px">
        {error}
      </StatusMessage>
      <StatusMessage {...args} status="warning" marginY="5px">
        {warning}
      </StatusMessage>
      <StatusMessage {...args} status="success" marginY="5px">
        {success}
      </StatusMessage>
      <StatusMessage {...args} status="info" marginY="5px">
        {info}
      </StatusMessage>
    </Flex>
  )
}
BasicUsage.argTypes = {
  status: HIDE_CONTROL,
  marginX: SPACE,
  error: { name: 'error message' },
  warning: { name: 'warning message' },
  info: { name: 'info message' },
  success: { name: 'success message' },
}
BasicUsage.args = { error: 'Error', warning: 'Warning', info: 'Info', success: 'Success' }
