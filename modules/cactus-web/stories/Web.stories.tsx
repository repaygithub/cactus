import * as React from 'react'
import { storiesOf } from '@storybook/react'

const stories = storiesOf('Component Library', module)

stories.add('Button', () => <div>test</div>, {
  options: { showAddonPanel: false },
  info: {
    header: false,
    inline: true,
    source: true,
  },
})
