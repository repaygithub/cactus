import { text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React, { ReactElement } from 'react'

import Link from './Link'

export default {
  title: 'Link',
  component: Link,
} as Meta

export const BasicUsage = (): ReactElement => (
  <Link to={text('to', 'https://repaygithub.github.io/cactus/')}>{text('text', 'Click me!')}</Link>
)

export const WithinABlockOfText = (): ReactElement => (
  <span>
    To review the cactus documentation site, click{' '}
    <Link to={text('to', 'https://repaygithub.github.io/cactus/')}>here</Link>.
  </span>
)

WithinABlockOfText.storyName = 'Within a block of text'

export const MultiLineLink = (): ReactElement => (
  <span style={{ width: '375px' }}>
    To review the cactus documentation site,{' '}
    <Link to={text('to', 'https://repaygithub.github.io/cactus/')}>click here</Link>.
  </span>
)

MultiLineLink.storyName = 'Multi-line link'
