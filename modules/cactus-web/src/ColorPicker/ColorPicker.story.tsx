import { select } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React, { useState } from 'react'

import ColorPicker from './ColorPicker'

export default {
  title: 'ColorPicker',
  component: ColorPicker,
} as Meta

const storyParams = {
  cactus: { overrides: { alignItems: 'start', paddingTop: '32px' } },
}

const eventLoggers = {
  onChange: (e: any) => {
    console.log(`onChange '${e.target.name}':`)
    console.log(e.target.value)
  },
  onFocus: (e: any) => console.log('onFocus:', e.target.name),
  onBlur: (e: any) => console.log('onBlur:', e.target.name),
}

export const BasicUsage = (): React.ReactElement => (
  <ColorPicker id="color-picker" name="color" {...eventLoggers} />
)

BasicUsage.parameters = storyParams

export const Controlled = (): React.ReactElement => {
  const [state, setState] = useState({
    hsl: { h: 120, s: 1, l: 0.5 },
    hsv: { h: 120, s: 1, v: 1 },
    rgb: { r: 0, g: 255, b: 0 },
    hex: '00FF00',
  })
  const controlledBy = select('controlled by', ['hsl', 'hsv', 'rgb', 'hex'], 'hsl')
  return (
    <ColorPicker
      id="color-picker"
      name="color"
      value={state[controlledBy]}
      {...eventLoggers}
      onChange={(event) => {
        if (event.currentTarget.value) {
          setState(event.currentTarget.value)
          console.log(`onChange: ${event.currentTarget.name}:`)
          console.log(event.currentTarget.value)
        }
      }}
    />
  )
}

Controlled.parameters = storyParams

export const Disabled = (): React.ReactElement => (
  <ColorPicker id="color-picker" name="disabled" disabled />
)
