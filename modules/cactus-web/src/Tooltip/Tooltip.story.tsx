import cactusTheme from '@repay/cactus-theme'
import React from 'react'

import { Flex, Tooltip } from '../'
import { HIDE_CONTROL, Story, STRING } from '../helpers/storybook'

const themeColors = Object.keys(cactusTheme.colors)

export default {
  title: 'Tooltip',
  component: Tooltip,
  argTypes: {
    color: { options: themeColors },
    label: STRING,
    ariaLabel: HIDE_CONTROL,
    position: HIDE_CONTROL,
    maxWidth: HIDE_CONTROL,
  },
  args: { label: 'Some tooltip text here' },
} as const

export const BasicUsage: Story<typeof Tooltip> = (args) => (
  <Flex flexDirection="column" alignItems="flex-start">
    <Tooltip {...args} />
    <Tooltip disabled label="disabled" />
  </Flex>
)

export const CollisionDetection: Story<typeof Tooltip> = (args) => <Tooltip {...args} />

CollisionDetection.parameters = {
  cactus: {
    overrides: {
      height: '200vh',
      width: '200vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  storyshots: false,
}
