import { text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { Box, Footer } from '../'

const LOGO =
  'https://repay-merchant-resources.s3.amazonaws.com/staging/24bd1970-a677-4ca7-a4d2-e328ddd4691b/repay_logo_new.jpg'

export default {
  title: 'Footer',
  component: Footer,
} as Meta

export const BasicUsage = (): React.ReactElement => {
  const customContent = text('Text Content', 'Some Custom Footer Content')
  const content = [
    customContent + ' ',
    <a key="linkless">Linkless Anchor</a>,
    ' | ',
    <a key="repay" href="https://repay.com">
      Some Company
    </a>,
    ' | ',
    <a key="random" href={'./' + Math.random()}>
      Never :visited
    </a>,
  ]
  return (
    <Box width="100%">
      <div>
        White
        <Footer variant="white" logo={LOGO}>
          {content}
        </Footer>
      </div>
      <div style={{ marginTop: '20px' }}>
        Gray
        <Footer logo={LOGO}>{content}</Footer>
      </div>
      <div style={{ marginTop: '20px' }}>
        Dark, no logo
        <Footer variant="dark">{content}</Footer>
      </div>
    </Box>
  )
}
