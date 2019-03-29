import * as React from 'react'
import { ThemeProvider } from 'styled-components'
import cactusTheme from '@repay/cactus-theme'
import storybookTheme from './theme'
import { configure, addParameters, addDecorator } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

addParameters({
  options: {
    name: '@repay/cactus-web',
    theme: storybookTheme,
  },
})
addDecorator(withKnobs)
addDecorator(story => (
  <div
    style={{
      fontFamily: 'Helvetica, Arial, sans serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      flexDirection: 'column',
      marginTop: '20px',
    }}
  >
    <ThemeProvider theme={cactusTheme}>{story()}</ThemeProvider>
  </div>
))

function requireAll(req) {
  req.keys().forEach(filename => req(filename))
}

const componentStories = require.context('../src', true, /\.(story|stories)\.(j|t)sx?$/)
const metaStories = require.context('../stories', true, /\.(story|stories)\.(j|t)sx?$/)

configure(() => {
  requireAll(componentStories)
  requireAll(metaStories)
}, module)
