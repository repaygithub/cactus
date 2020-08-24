import { number, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import { ScreenSizeProvider } from '../ScreenSizeProvider/ScreenSizeProvider'
import Footer from './Footer'
import RepayLogo from './repay-logo.png'

const LINK_TEXT = [
  'Some Link',
  'Click Here',
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

storiesOf('Footer', module).add('Basic Usage', () => {
  const customContent = text('custom content', 'Some Custom Footer Content')
  const numLinks = number('number of links', 10)

  const makeLinks = (numLinks: number) => {
    const links = []
    for (let i = 0; i < numLinks; i++) {
      const linkText = LINK_TEXT[Math.floor(Math.random() * LINK_TEXT.length)]
      const url = `https://${LINKS[Math.floor(Math.random() * LINKS.length)]}`
      links.push(
        <Footer.Link key={i} to={url}>
          {linkText}
        </Footer.Link>
      )
    }
    return links
  }

  return (
    <ScreenSizeProvider>
      <Footer key={`${customContent}-${numLinks}`} src={RepayLogo}>
        <Footer.Main>{customContent !== '' ? customContent : null}</Footer.Main>
        {makeLinks(numLinks)}
      </Footer>
    </ScreenSizeProvider>
  )
})
