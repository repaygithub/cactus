import { actions } from '@storybook/addon-actions'
import { boolean, select, text } from '@storybook/addon-knobs/react'
import { Flex } from '../index'
import { storiesOf } from '@storybook/react'
import Alert, { Status, Type } from './Alert'
import React from 'react'

const status: Status[] = ['error', 'warning', 'info', 'success']
const type: Type[] = ['general', 'push']
const eventLoggers = actions('onClose')

storiesOf('Alert', module).add('Basic Usage', () => {
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
})

storiesOf('Alert', module).add('Close Button', () => {
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
})
storiesOf('Alert', module).add('Small Push Alert', () => {
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
})
