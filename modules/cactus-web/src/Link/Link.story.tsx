import React from 'react'

import { Flex, Link } from '../'
import { HIDE_CONTROL, Story } from '../helpers/storybook'

export default {
  title: 'Link',
  component: Link,
  args: { to: 'https://repaygithub.github.io/cactus/' },
} as const

export const BasicUsage: Story<typeof Link> = ({ children, to }) => (
  <Flex flexDirection="column">
    <Link href={to}>{children}</Link>
    <Link variant="dark" href={to}>
      I'm a dark link!
    </Link>
  </Flex>
)
BasicUsage.argTypes = { variant: HIDE_CONTROL, children: { name: 'text' } }
BasicUsage.args = { children: 'Click me!' }

export const WithinABlockOfText: Story<typeof Link> = (args) => (
  <span>
    To review the cactus documentation site, click <Link {...args}>here</Link>.
  </span>
)

WithinABlockOfText.storyName = 'Within a block of text'

export const MultiLineLink: Story<typeof Link> = (args) => (
  <span style={{ width: '375px', display: 'block' }}>
    To review the cactus documentation site, <Link {...args}>click here</Link>.
  </span>
)

MultiLineLink.storyName = 'Multi-line link'
