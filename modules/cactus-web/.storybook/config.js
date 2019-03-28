import * as React from 'react'
import { configure, addParameters, addDecorator } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { withInfo } from '@storybook/addon-info'

addParameters({
  options: {
    name: '@repay/cactus-web',
    url: 'https://github.com/repaygithub/cactus/tree/master/modules/cactus-web',
  },
  info: false,
})
addDecorator(withInfo())
addDecorator(withKnobs)
addDecorator(story => (
  <div
    style={{
      fontFamily: 'Helvetica, sans serif',
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

function loadStories() {
  require('../stories/Web.stories.tsx')
}

configure(loadStories, module)
