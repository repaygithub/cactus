import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs'
import Link from './Link'
import React from 'react'

storiesOf('Link', module)
  .add('Basic Usage', () => (
    <Link to={text('to', 'https://repaygithub.github.io/cactus/')}>
      {text('text', 'Click me!')}
    </Link>
  ))
  .add('Within a block of text', () => (
    <span>
      To review the cactus documentation site, click{' '}
      <Link to="https://repaygithub.github.io/cactus/">here</Link>.
    </span>
  ))
  .add('Multi-line link', () => (
    <span style={{ width: '375px' }}>
      To review the cactus documentation site,{' '}
      <Link to="https://repaygithub.github.io/cactus/">click here</Link>.
    </span>
  ))
