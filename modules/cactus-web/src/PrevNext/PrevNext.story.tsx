import { action } from '@storybook/addon-actions'
import { boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import PrevNext from './PrevNext'

storiesOf('PrevNext', module).add(
  'Basic Usage',
  (): React.ReactElement => (
    <PrevNext
      disablePrev={boolean('Disable Prev', false)}
      disableNext={boolean('Disable Next', false)}
      onNavigate={action('PrevNext Navigate')}
      prevText={text('Prev Text', 'Prev')}
      nextText={text('Next Text', 'Next')}
    />
  )
)
