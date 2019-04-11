import * as React from 'react'
import storybookTheme from './theme'
import { configure, addParameters, addDecorator } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

addParameters({
  options: {
    name: '@repay/cactus-icons',
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
