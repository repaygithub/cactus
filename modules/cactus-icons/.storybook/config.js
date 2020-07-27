import { StyleProvider } from '@repay/cactus-web'
import { withKnobs } from '@storybook/addon-knobs'
import { addDecorator, addParameters, configure } from '@storybook/react'
import * as React from 'react'

import storybookTheme from './theme'

addParameters({
  options: {
    theme: storybookTheme,
  },
})
addDecorator(withKnobs)
addDecorator((story) => (
  <div
    style={{
      fontFamily: 'Helvetica, Arial, sans serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 'calc(100vw - 16px)',
      flexDirection: 'column',
      marginTop: '20px',
    }}
  >
    <StyleProvider>{story()}</StyleProvider>
  </div>
))

configure(() => {
  require('../stories/Icons.story.tsx')
}, module)
