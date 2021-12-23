import React from 'react'

import { TextButton } from '../'
import { actions, HIDE_CONTROL, Icon, ICON_ARG, SPACE, Story } from '../helpers/storybook'

export default {
  title: 'TextButton',
  component: TextButton,
  argTypes: {
    variant: { options: ['standard', 'action', 'danger', 'dark'] },
    disabled: { control: 'boolean' },
    children: { name: 'button text' },
    ...actions('onClick', 'onFocus', 'onBlur'),
  },
} as const

export const BasicUsage: Story<typeof TextButton> = (args) => (
  <div>
    <TextButton {...args} variant="standard" />
    <TextButton variant="danger" {...args} inverse={false}>
      Danger
    </TextButton>
    <TextButton {...args} variant="action">
      Action
    </TextButton>
    <TextButton {...args} variant="dark">
      Dark
    </TextButton>
    <TextButton {...args} variant="standard" disabled>
      Disabled
    </TextButton>
  </div>
)
BasicUsage.argTypes = {
  variant: HIDE_CONTROL,
  disabled: HIDE_CONTROL,
  margin: SPACE,
}
BasicUsage.args = { children: 'Standard' }

export const Multiple: Story<typeof TextButton> = (args) => (
  <p>
    <TextButton {...args} />
    {' | '}
    <TextButton {...args} />
  </p>
)
Multiple.args = { children: 'Add', variant: 'action' }

export const WithIcon: Story<typeof TextButton, { Icon: Icon }> = ({
  Icon: IconComponent,
  children,
  ...args
}) => {
  return (
    <TextButton {...args}>
      <IconComponent />
      {children}
    </TextButton>
  )
}
WithIcon.argTypes = { Icon: ICON_ARG }
WithIcon.args = { children: 'Add' }
