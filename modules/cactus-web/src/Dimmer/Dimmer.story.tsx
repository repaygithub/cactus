import { Meta } from '@storybook/react/types-6-0'
import React, { useState } from 'react'

import Box from '../Box/Box'
import BrandBar from '../BrandBar/BrandBar'
import Button from '../Button/Button'
import Flex from '../Flex/Flex'
import { Layout } from '../Layout/Layout'
import Modal from '../Modal/Modal'
import Text from '../Text/Text'
import Dimmer from './Dimmer'

export default {
  title: 'Dimmer',
} as Meta

const LOGO =
  'https://repay-merchant-resources.s3.amazonaws.com/staging/24bd1970-a677-4ca7-a4d2-e328ddd4691b/repay_logo_new.jpg'

export const ContentDimmer = (): React.ReactElement => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Layout>
        <BrandBar logo={LOGO} />
        <Flex mx={15} justifyContent="start" alignItems="flex-start" flexDirection="column">
          <h1>Something</h1>
          <p>
            Mauris eu felis fringilla tortor scelerisque tincidunt et quis risus. Proin dui arcu,
            tincidunt nec rhoncus eu, blandit ut odio. Donec ac tristique felis. Morbi vel urna
            commodo, efficitur orci in, condimentum augue. Morbi neque felis, consequat sit amet mi
            eget, imperdiet consectetur augue. Sed dignissim congue ex at vestibulum. Etiam rutrum,
            mauris rutrum maximus congue, lectus sem molestie est, eget gravida orci ligula tempus
            dolor.
          </p>
          <Dimmer.DimmableContent>
            <h3>Content Dimmer</h3>
            <p>
              Mauris eu felis fringilla tortor scelerisque tincidunt et quis risus. Proin dui arcu,
              tincidunt nec rhoncus eu, blandit ut odio. Donec ac tristique felis. Morbi vel urna
              commodo, efficitur orci in, condimentum augue.
            </p>
            <Button onClick={() => setOpen(true)}>Activate dimmer!</Button>
            <Dimmer active={open}>
              <div>
                <Button onClick={() => setOpen(false)}>Click me!</Button>
              </div>
            </Dimmer>
          </Dimmer.DimmableContent>
        </Flex>
      </Layout>
    </>
  )
}

export const ActivePageDimmer = (): React.ReactElement => {
  const [open, setOpen] = useState(false)

  return (
    <Layout>
      <Layout.Content>
        <BrandBar logo={LOGO} />
        <h1>Page Dimmer</h1>
        <p>
          Mauris eu felis fringilla tortor scelerisque tincidunt et quis risus. Proin dui arcu,
          tincidunt nec rhoncus eu, blandit ut odio. Donec ac tristique felis. Morbi vel urna
          commodo, efficitur orci in, condimentum augue. Morbi neque felis, consequat sit amet mi
          eget, imperdiet consectetur augue. Sed dignissim congue ex at vestibulum. Etiam rutrum,
          mauris rutrum maximus congue, lectus sem molestie est, eget gravida orci ligula tempus
          dolor.
        </p>
        <Button onClick={() => setOpen(true)}>Activate dimmer!</Button>
        <Dimmer active={open} page>
          <div>
            <Box>
              <Button onClick={() => setOpen(false)}>Click me!</Button>
            </Box>
          </div>
        </Dimmer>
      </Layout.Content>
    </Layout>
  )
}

export const modalWithDimmer = (): React.ReactElement => {
  const [open, setOpen] = useState(false)

  return (
    <Layout>
      <Layout.Content>
        <h1>Modal with dimmer</h1>
        <Button onClick={() => setOpen(true)}>Activate dimmer!</Button>
        <Dimmer active={open} page>
          <Modal
            variant="action"
            isOpen={open}
            modalLabel="Modal Label"
            closeLabel="Close Label"
            onClose={() => setOpen(false)}
          >
            <Text as="h3">This is a modal</Text>
          </Modal>
        </Dimmer>
      </Layout.Content>
    </Layout>
  )
}
