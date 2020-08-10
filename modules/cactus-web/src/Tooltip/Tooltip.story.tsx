import { NotificationInfo } from '@repay/cactus-icons'
import { boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Tooltip from './Tooltip'

const tooltipStories = storiesOf('Tooltip', module)

tooltipStories
  .add(
    'Basic Usage',
    (): React.ReactElement => (
      <Tooltip
        label={text('label', 'Some tooltip text here')}
        disabled={boolean('disabled', false)}
      >
        <NotificationInfo />
      </Tooltip>
    )
  )
  .add(
    'Collision Detection',
    (): React.ReactElement => (
      <Tooltip label={text('label', 'Some tooltip text here')}>
        <NotificationInfo />
      </Tooltip>
    ),
    { cactus: { overrides: { height: '200vh', width: '200vw' } } }
  )
