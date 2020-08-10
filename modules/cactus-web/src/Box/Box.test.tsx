import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Box from './Box'

describe('component: Box', (): void => {
  test('snapshot', (): void => {
    const { container } = render(
      <StyleProvider>
        <Box />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should accept built-in props', (): void => {
    const { container } = render(
      <StyleProvider>
        <Box
          position="relative"
          display="block"
          top="-1"
          right="auto"
          bottom="auto"
          left="-1"
          margin={2}
          padding={2}
          width="120px"
          height="120px"
          backgroundColor="darkestContrast"
          color="white"
          borderColor="callToAction"
          borderWidth="2px"
          borderRadius="20px"
          borderStyle="solid"
          zIndex={100}
          textStyle="h1"
        >
          Content
        </Box>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
