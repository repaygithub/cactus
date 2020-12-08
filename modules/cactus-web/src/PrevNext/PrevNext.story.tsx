import { action } from '@storybook/addon-actions'
import { text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import PrevNext from './PrevNext'

export default {
  title: 'PrevNext',
  component: PrevNext,
} as Meta

export const BasicUsage = (): React.ReactElement => (
  <div>
    <PrevNext
      onNavigate={action('PrevNext Navigate')}
      prevText={text('Prev Text', 'Prev')}
      nextText={text('Next Text', 'Next')}
    />
    <PrevNext
      disablePrev
      onNavigate={action('PrevNext Navigate')}
      prevText={text('Prev Text', 'Prev')}
      nextText={text('Next Text', 'Next')}
    />
    <PrevNext
      disableNext
      onNavigate={action('PrevNext Navigate')}
      prevText={text('Prev Text', 'Prev')}
      nextText={text('Next Text', 'Next')}
    />
    <PrevNext
      disablePrev
      disableNext
      onNavigate={action('PrevNext Navigate')}
      prevText={text('Prev Text', 'Prev')}
      nextText={text('Next Text', 'Next')}
    />
  </div>
)
