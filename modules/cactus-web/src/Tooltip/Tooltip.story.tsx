import { boolean, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import Tooltip from './Tooltip'

export default {
  title: 'Tooltip',
  component: Tooltip,
} as Meta

export const BasicUsage = (): React.ReactElement => (
  <Tooltip label={text('label', 'Some tooltip text here')} disabled={boolean('disabled', false)} />
)

export const CollisionDetection = (): React.ReactElement => (
  <Tooltip label={text('label', 'Some tooltip text here')} />
)

CollisionDetection.parameters = {
  cactus: { overrides: { height: '200vh', width: '200vw' } },
  storyshots: false,
}
