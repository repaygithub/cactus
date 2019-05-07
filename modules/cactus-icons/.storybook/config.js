import * as React from 'react'

import { addDecorator, addParameters, configure } from '@storybook/react'
import { ThemeProvider } from 'styled-components'
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
    <ThemeProvider theme={cactusTheme}>{story()}</ThemeProvider>
  </div>
))

configure(() => {
  require('../stories/Icons.story.tsx')
}, module)
