import { Page } from 'puppeteer'
import React, { useState } from 'react'

import { ColorPicker } from '../'
import { Action, actions, HIDE_CONTROL, Story } from '../helpers/storybook'

export default {
  title: 'ColorPicker',
  component: ColorPicker,
  argTypes: {
    value: HIDE_CONTROL,
    ...actions('onChange', 'onFocus', 'onBlur'),
  },
  args: {
    name: 'color',
    id: 'color-picker',
  },
  parameters: {
    cactus: { overrides: { alignItems: 'start' } },
  },
} as const

export const BasicUsage: Story<typeof ColorPicker> = (args) => (
  <div>
    <ColorPicker id="disabled-picker" name="disabled" disabled />
    <ColorPicker mt={3} {...args} />
  </div>
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

Controlled.parameters = { storyshots: false }
