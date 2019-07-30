import { actions } from '@storybook/addon-actions'
import { Flex } from '@repay/cactus-web'
import { select, text } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
import Alert, { Status, Type } from './Alert'
import React from 'react'
import styled from 'styled-components'

const status: Status[] = ['error', 'warning', 'info', 'success']
const type: Type[] = ['general', 'push']
const eventLoggers = actions('onClose')

const ShadowFlex = styled(Flex)`
  box-shadow: 0 9px 24px ${p => p.theme.colors.callToAction};
  border-radius: 8px;
`

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
storiesOf('Alert', module).add('Small Push Alert', () => {
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
storiesOf('Alert', module).add('Push Alert With Shadow', () => {
  return (
    <ShadowFlex width="320px">
      <Alert
        status={select('Status', status, 'error')}
        type={select('Type', type, 'push')}
        {...eventLoggers}
      >
        {text('Message', 'Message goes here')}
      </Alert>
    </ShadowFlex>
  )
})
