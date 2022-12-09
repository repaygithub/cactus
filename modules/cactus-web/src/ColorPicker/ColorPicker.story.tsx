import { Page } from 'puppeteer'
import React, { useState } from 'react'

import { ColorPicker, Flex } from '../'
import { Action, actions, HIDE_CONTROL, Story, STRING } from '../helpers/storybook'

export default {
  title: 'ColorPicker',
  component: ColorPicker,
  argTypes: {
    value: HIDE_CONTROL,
    status: { options: ['success', 'warning', 'error'] },
    ...actions('onChange', 'onFocus', 'onBlur'),
  },
  args: {
    name: 'color',
    id: 'color-picker',
  },
  parameters: {
    cactus: { overrides: { alignItems: 'start', maxWidth: '500px' } },
  },
} as const

export const BasicUsage: Story<typeof ColorPicker> = (args) => (
  <Flex flexDirection="column">
    <ColorPicker id="disabled-picker" name="disabled" disabled />
    <ColorPicker mt={3} {...args} />
  </Flex>
)
BasicUsage.parameters = {
  beforeScreenshot: async (page: Page) => {
    await page.click('button[id="color-picker-button"]')
  },
}

export const Controlled: Story<
  typeof ColorPicker,
  {
    onChange: Action<React.ChangeEvent<any>>
  }
> = (args) => {
  const [state, setState] = useState({
    hsl: { h: 120, s: 1, l: 0.5 },
    hsv: { h: 120, s: 1, v: 1 },
    rgb: { r: 0, g: 255, b: 0 },
    hex: '#00FF00',
  })
  const controlledBy = args.format || 'hex'
  return (
    <ColorPicker
      {...args}
      value={state[controlledBy]}
      onChange={args.onChange.wrap((event) => {
        if (event.currentTarget.value) {
          setState((currentState) => ({
            ...currentState,
            [controlledBy]: event.currentTarget.value,
          }))
        }
      })}
    />
  )
}
Controlled.argTypes = { width: STRING }
Controlled.args = { width: '100%' }
Controlled.parameters = { storyshots: false }
