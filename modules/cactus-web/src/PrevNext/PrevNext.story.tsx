import React from 'react'

import { PrevNext } from '../'
import { actions, HIDE_CONTROL, Story, STRING } from '../helpers/storybook'

export default {
  title: 'PrevNext',
  component: PrevNext,
  argTypes: {
    linkAs: HIDE_CONTROL,
    prevText: STRING,
    nextText: STRING,
    ...actions('onNavigate'),
  },
} as const

export const BasicUsage: Story<typeof PrevNext> = (args): React.ReactElement => (
  <div>
    <PrevNext {...args} />
    <PrevNext {...args} disablePrev />
    <PrevNext {...args} disableNext />
    <PrevNext {...args} disablePrev disableNext />
  </div>
)
