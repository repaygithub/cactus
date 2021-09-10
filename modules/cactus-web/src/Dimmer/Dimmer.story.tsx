import { Page } from 'puppeteer'
import React, { useState } from 'react'

import { Box, Button, Dimmer, Flex } from '../'

export default {
  title: 'Dimmer',
} as const

export const ActivePageDimmer = (): React.ReactElement => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Flex mx={15} justifyContent="flex-start" alignItems="flex-start" flexDirection="column">
        <h1>Page Dimmer</h1>
        <p>
          Mauris eu felis fringilla tortor scelerisque tincidunt et quis risus. Proin dui arcu,
          tincidunt nec rhoncus eu, blandit ut odio. Donec ac tristique felis. Morbi vel urna
          commodo, efficitur orci in, condimentum augue. Morbi neque felis, consequat sit amet mi
          eget, imperdiet consectetur augue. Sed dignissim congue ex at vestibulum. Etiam rutrum,
          mauris rutrum maximus congue, lectus sem molestie est, eget gravida orci ligula tempus
          dolor.
        </p>
        <Button id="dimmer-btn" onClick={() => setOpen(true)}>
          Activate dimmer!
        </Button>
        <Dimmer active={open}>
          <div>
            <Box>
              <Button onClick={() => setOpen(false)}>Click me!</Button>
            </Box>
          </div>
        </Dimmer>
      </Flex>
    </>
  )
}

ActivePageDimmer.parameters = {
  controls: { disable: true },
  beforeScreenshot: async (page: Page) => {
    await page.click('[id="dimmer-btn"]')
  },
}
