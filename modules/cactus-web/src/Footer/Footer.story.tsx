import React from 'react'

import { Box, Footer } from '../'
import { HIDE_CONTROL, Story, STRING } from '../helpers/storybook'

const LOGO =
  'https://repay-merchant-resources.s3.amazonaws.com/staging/24bd1970-a677-4ca7-a4d2-e328ddd4691b/repay_logo_new.jpg'

export default {
  title: 'Footer',
  component: Footer,
  argTypes: { variant: HIDE_CONTROL, logo: STRING },
  args: {
    textContent: 'Some Custom Footer Content',
    logo: LOGO,
  },
} as const

export const BasicUsage: Story<typeof Footer, { textContent: string }> = ({
  textContent,
  logo,
}) => {
  const content = [
    textContent + ' ',
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
        <Footer variant="white" logo={logo}>
          {content}
        </Footer>
      </div>
      <div style={{ marginTop: '20px' }}>
        Gray
        <Footer logo={logo}>{content}</Footer>
      </div>
      <div style={{ marginTop: '20px' }}>
        Dark, no logo
        <Footer variant="dark">{content}</Footer>
      </div>
    </Box>
  )
}

export const CustomFlex: Story<typeof Footer> = () => (
  <Footer flexFlow={['column', 'row']} justifyContent="space-between">
    <Box display="flex">
      <div>Left</div>
      <Footer.Logo position={['static', 'absolute']} top={3} left="300px" as="img" src={LOGO} />
    </Box>
    <div>Center</div>
    <Box flexBasis={['50px', '200px']}>Right</Box>
  </Footer>
)
CustomFlex.parameters = { controls: { disable: true } }
