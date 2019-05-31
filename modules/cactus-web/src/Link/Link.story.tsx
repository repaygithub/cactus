import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs'
import Link from './Link'
import React from 'react'

storiesOf('Link', module).add('Basic Usage', () => (
  <Link to={text('to', 'https://repaygithub.github.io/cactus/')}>{text('text', 'Click me!')}</Link>
))
