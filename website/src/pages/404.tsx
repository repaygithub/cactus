import * as React from 'react'

import { ReactComponent as NoResultsCactus } from '../assets/no-results-cactus.svg'
import Box, { Flex } from '../components/Box'

export default () => (
  <>
    <Flex
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      position="relative"
    >
      <h1>Page Not Found</h1>
      <p>Use the menu to the left to roam the available pages.</p>
      <Box position="absolute" left="0" top="0" right="0" zIndex={-1}>
        <NoResultsCactus />
      </Box>
    </Flex>
  </>
)
