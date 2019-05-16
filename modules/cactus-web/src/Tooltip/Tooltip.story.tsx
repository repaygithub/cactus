import React from 'react'

import { NotificationInfo } from '@repay/cactus-icons'
import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs'
import Tooltip from './Tooltip'

const tooltipStories = storiesOf('Tooltip', module)

tooltipStories.add('Basic Usage', () => (
  <Tooltip label={text('label', 'Some tooltip text here')}>
    <NotificationInfo />
  </Tooltip>
))
