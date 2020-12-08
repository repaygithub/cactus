import { number, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import Footer from './Footer'

const LINK_TEXT = [
  'Static',
  'Unchanging',
  'Privacy Policy',
  'Merchant Login',
  'Follow You',
  'Another Link',
  'The Ghost',
  'Tsushima',
  'Interstellar',
  'The League of Rockets',
]

const LINKS = ['repay.com', 'google.com', 'microsoft.com']
const LOGO =
  'https://repay-merchant-resources.s3.amazonaws.com/staging/24bd1970-a677-4ca7-a4d2-e328ddd4691b/repay_logo_new.jpg'

export default {
  title: 'Footer',
  component: Footer,
} as Meta

export const BasicUsage = (): React.ReactElement => {
  const customContent = text('custom content', 'Some Custom Footer Content')
  const numLinks = number('number of links', 2)

  const makeLinks = (numLinks: number) => {
    const links = []
    for (let i = 0; i < numLinks; i++) {
      // Keep the values the same for the default links to match the storyshot.
      const textIndex = i < 2 ? i : Math.floor(Math.random() * LINK_TEXT.length)
      const linkIndex = i < 2 ? i : Math.floor(Math.random() * LINKS.length)
      links.push(
        <Footer.Link key={i} to={`https://${LINKS[linkIndex]}`}>
          {LINK_TEXT[textIndex]}
        </Footer.Link>
      )
    }
    return links
  }

  return (
    <div>
      With logo links and custom content
      <Footer key={`${customContent}-${numLinks}`} logo={LOGO}>
        {customContent !== '' ? customContent : null}
        {makeLinks(numLinks)}
      </Footer>
      <div style={{ marginTop: '20px' }}>
        Without logo and custom content
        <Footer key={`${customContent}-${numLinks}`} logo={undefined}>
          {makeLinks(numLinks)}
        </Footer>
      </div>
      <div style={{ marginTop: '20px' }}>
        Without custom content
        <Footer key={`${customContent}-${numLinks}`} logo={LOGO}>
          {makeLinks(numLinks)}
        </Footer>
      </div>
    </div>
  )
}
