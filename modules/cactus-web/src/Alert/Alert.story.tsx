import { actions } from '@storybook/addon-actions'
import { select, text } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
import Alert, { Status, Type } from './Alert'
import React, { Component } from 'react'

const status: Status[] = ['error', 'warning', 'info', 'success']
const type: Type[] = ['general', 'push']
const eventLoggers = actions('onClick')

storiesOf('Alert', module).add('Basic Usage', () => {
  return (
    <Alert
      status={select('Status', status, 'error')}
      type={select('Type', type, 'general')}
      {...eventLoggers}
    >
      {text('Message', 'Message goes here')}
    </Alert>
  )
})
