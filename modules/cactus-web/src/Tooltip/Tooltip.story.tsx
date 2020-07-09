import React from 'react'

import { boolean, text } from '@storybook/addon-knobs'
import { NotificationInfo } from '@repay/cactus-icons'
import { storiesOf } from '@storybook/react'
import Tooltip from './Tooltip'

const tooltipStories = storiesOf('Tooltip', module)

tooltipStories
  .add('Basic Usage', () => (
    <Tooltip label={text('label', 'Some tooltip text here')} disabled={boolean('disabled', false)}>
      <NotificationInfo />
    </Tooltip>
  ))
  .add(
    'Collision Detection',
    () => (
      <Tooltip label={text('label', 'Some tooltip text here')}>
        <NotificationInfo />
      </Tooltip>
    ),
    { cactus: { overrides: { height: '200vh', width: '200vw' } } }
  )
