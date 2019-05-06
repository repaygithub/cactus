import * as React from 'react'

import { addDecorator, addParameters, configure } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
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
    {story()}
  </div>
))

configure(() => {
  require('../stories/Icons.story.tsx')
}, module)
