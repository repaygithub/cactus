import defaultTheme, { generateTheme } from '@repay/cactus-theme'
import addons from '@storybook/addons'
import { addDecorator, addParameters } from '@storybook/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import storybookTheme from './theme'

addons.setConfig({
  theme: storybookTheme,
})

addParameters({ layout: 'fullscreen' })

const useTheme = (hue) => {
  const ref = React.useRef(defaultTheme)
  if (ref.current.hue !== hue) {
    ref.current = generateTheme({ primaryHue: hue })
  }
  return ref.current
}

addDecorator((Story, context) => (
  <ThemeProvider theme={useTheme(context.args.hue)}>
    <Story />
  </ThemeProvider>
))
