import { Page } from 'puppeteer'
import React, { useState } from 'react'

import { Box, Button, Dimmer, Flex, Grid } from '../'
import { HIDE_CONTROL, Story } from '../helpers/storybook'

export default {
  title: 'Dimmer',
  component: Dimmer,
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

export const AbsolutelyPositioned: Story<typeof Dimmer> = (args) => {
  const [dimIndex, setDim] = useState(4)
  const items: React.ReactElement[] = []
  for (let i = 0; i < 9; i++) {
    items.push(
      <Grid.Item
        key={i}
        as={Flex}
        border="1px solid black"
        position="relative"
        justifyContent="center"
        alignItems="flex-start"
        row={Math.floor(i / 3) + 1}
        col={(i % 3) + 1}
      >
        <Dimmer {...args} active={i === dimIndex}>
          <Box colors="standard" margin={2} padding={2} borderRadius="themed">
            Ya done dimmed
          </Box>
        </Dimmer>
        <Button marginTop={3} onClick={() => setDim(i)}>
          Dim me!
        </Button>
      </Grid.Item>
    )
  }
  return (
    <Grid rows="100px 100px 100px" cols={3}>
      {items}
    </Grid>
  )
}
AbsolutelyPositioned.argTypes = {
  active: HIDE_CONTROL,
  position: { control: { type: 'inline-radio', options: ['fixed', 'absolute'] } },
}
AbsolutelyPositioned.args = {
  position: 'absolute',
  opacity: '0.4',
}
