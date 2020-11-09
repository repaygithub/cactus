import { actions } from '@storybook/addon-actions'
import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React, { ReactElement } from 'react'

import { Flex } from '../index'
import Alert, { Status, Type } from './Alert'

const status: Status[] = ['error', 'warning', 'info', 'success']
const type: Type[] = ['general', 'push']
const eventLoggers = actions('onClose')

export default {
  title: 'Alert',
  component: Alert,
} as Meta

export const BasicUsage = (): ReactElement => {
  return (
    <Flex width="80%">
      <Alert
        status={select('Status', status, 'error')}
        type={select('Type', type, 'general')}
        shadow={boolean('Shadow', false)}
      >
        {text('Message', 'Message goes here')}
      </Alert>
    </Flex>
  )
}

export const CloseButton = (): ReactElement => {
  return (
    <Flex width="80%">
      <Alert
        status={select('Status', status, 'error')}
        type={select('Type', type, 'general')}
        shadow={boolean('Shadow', false)}
        {...eventLoggers}
      >
        {text('Message', 'Message goes here')}
      </Alert>
    </Flex>
  )
}

export const SmallPushAlert = (): ReactElement => {
  return (
    <Flex width="320px">
      <Alert
        status={select('Status', status, 'error')}
        type={select('Type', type, 'push')}
        shadow={boolean('Shadow', false)}
        {...eventLoggers}
      >
        {text('Message', 'Message goes here')}
      </Alert>
    </Flex>
  )
}
