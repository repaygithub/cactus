import { action } from '@storybook/addon-actions'
import { boolean, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import PrevNext from './PrevNext'

export default {
  title: 'PrevNext',
  component: PrevNext,
} as Meta

export const BasicUsage = (): React.ReactElement => (
  <PrevNext
    disablePrev={boolean('Disable Prev', false)}
    disableNext={boolean('Disable Next', false)}
    onNavigate={action('PrevNext Navigate')}
    prevText={text('Prev Text', 'Prev')}
    nextText={text('Next Text', 'Next')}
  />
)
