import * as React from 'react'

import { addDecorator, addParameters, configure } from '@storybook/react'
import { StyleProvider } from '../src/StyleProvider/StyleProvider'
import { withKnobs } from '@storybook/addon-knobs'
import cactusTheme from '@repay/cactus-theme'
import storybookTheme from './theme'

addParameters({
  options: {
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
    <StyleProvider global>
      {story()}
    </StyleProvider>
  </div>
))

function requireAll(req) {
  req.keys().forEach(filename => req(filename))
}

const componentStories = require.context('../src', true, /\.(story|stories)\.(j|t)sx?$/)

configure(() => {
  requireAll(componentStories)
}, module)
