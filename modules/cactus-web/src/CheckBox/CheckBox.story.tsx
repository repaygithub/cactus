import { boolean } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import actions from '../helpers/storybookActionsWorkaround'
import CheckBox from './CheckBox'

const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

export default {
  title: 'CheckBox',
  component: CheckBox,
} as Meta

export const BasicUsage = (): React.ReactElement => (
  <CheckBox id="test" name="kaneki" disabled={boolean('disabled', false)} {...eventLoggers} />
)

export const ControllingValueThroughProps = (): React.ReactElement => (
  <CheckBox
    id="test"
    name="touka"
    disabled={boolean('disabled', false)}
    checked={boolean('checked', false)}
    {...eventLoggers}
  />
)
