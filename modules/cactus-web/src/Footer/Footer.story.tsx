import { boolean, number, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import { ScreenSizeProvider } from '../ScreenSizeProvider/ScreenSizeProvider'
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

storiesOf('Footer', module).add('Basic Usage', () => {
  const hasLogo = boolean('has logo', true)
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
    <ScreenSizeProvider>
      <Footer key={`${customContent}-${numLinks}`} logo={hasLogo ? LOGO : undefined}>
        {customContent !== '' ? customContent : null}
        {makeLinks(numLinks)}
      </Footer>
    </ScreenSizeProvider>
  )
})
