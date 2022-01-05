import React from 'react'

import { RadioButton } from '../'
import { actions, Story, STRING } from '../helpers/storybook'

export default {
  title: 'RadioButton',
  component: RadioButton,
  argTypes: {
    id: STRING,
    ...actions('onChange', 'onFocus', 'onBlur'),
  },
  args: { name: 'radio', disabled: false },
} as const

export const BasicUsage: Story<typeof RadioButton> = (args) => <RadioButton {...args} />

type MultiStory = Story<typeof RadioButton, { values: string[] }>
export const MultipleRadioButtons: MultiStory = ({ id, values, ...args }) => (
  <div>
    {values.map((value, i) => (
      <div key={i}>
        <RadioButton {...args} value={value} id={id && id + i} />
      </div>
    ))}
  </div>
)
MultipleRadioButtons.args = { values: ['one', 'two'] }
