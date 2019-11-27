import * as React from 'react'
import { cleanup, render } from '@testing-library/react'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Box from './Box'

afterEach(cleanup)

describe('component: Box', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <Box />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should accept built-in props', () => {
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
        >
          Content
        </Box>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
