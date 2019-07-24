import { actions } from '@storybook/addon-actions'
import { Flex } from '@repay/cactus-web'
import { select, text } from '@storybook/addon-knobs/react'
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
        type={select('Type', type, 'push')}
        {...eventLoggers}
      >
        {text('Message', 'Message goes here')}
      </Alert>
    </Flex>
  )
})
storiesOf('Alert', module).add('Small Push', () => {
  return (
    <Flex width="320px">
      <Alert
        status={select('Status', status, 'error')}
        type={select('Type', type, 'push')}
        {...eventLoggers}
      >
        {text('Message', 'Message goes here')}
      </Alert>
    </Flex>
  )
})
