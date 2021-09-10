import React from 'react'

import { Toggle } from '../'
import { Action, actions, HIDE_CONTROL, Story } from '../helpers/storybook'

export default {
  title: 'Toggle',
  component: Toggle,
  argTypes: { checked: HIDE_CONTROL, ...actions('onChange', 'onFocus', 'onBlur') },
} as const

type TStory = Story<typeof Toggle, { onChange: Action<React.ChangeEvent> }>
export const BasicUsage: TStory = (args) => {
  const [checked, setChecked] = React.useState<boolean>(false)
  const onChange = args.onChange.wrap(setChecked, true)
  return <Toggle {...args} checked={checked} onChange={onChange} />
}
BasicUsage.args = { name: 'toggle' }
