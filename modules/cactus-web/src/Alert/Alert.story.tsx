import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React, { ReactElement } from 'react'

import { Alert, Flex } from '../'
import { Status, Type } from './Alert'

const status: Status[] = ['error', 'warning', 'info', 'success']
const type: Type[] = ['general', 'push']
const onClose = () => console.log('CLOSE pressed')

export default {
  title: 'Alert',
  component: Alert,
} as Meta

export const BasicUsage = (): ReactElement => {
  return (
    <Flex flexDirection="column" alignItems="center" width="80%">
      <Alert
        status="error"
        type={select('Type', type, 'general')}
        shadow={boolean('Shadow', false)}
        marginY="5px"
      >
        {text('Message 1', 'Error')}
      </Alert>
      <Alert
        status="warning"
        type={select('Type', type, 'general')}
        shadow={boolean('Shadow', false)}
        marginY="5px"
      >
        {text('Message 2', 'Warning')}
      </Alert>
      <Alert
        status="info"
        type={select('Type', type, 'general')}
        shadow={boolean('Shadow', false)}
        marginY="5px"
      >
        {text('Message 3', 'Info')}
      </Alert>
      <Alert status="success" type={select('Type', type, 'general')} shadow marginY="5px">
        {text('Message 4', 'Success')}
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
        onClose={onClose}
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
        onClose={onClose}
      >
        {text('Message', 'Message goes here')}
      </Alert>
    </Flex>
  )
}
