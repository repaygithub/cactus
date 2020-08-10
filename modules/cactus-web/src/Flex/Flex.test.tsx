import { cleanup, render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Flex from './Flex'

afterEach(cleanup)

describe('component: Flex', (): void => {
  test('snapshot with no props', (): void => {
    const { container } = render(
      <StyleProvider>
        <Flex />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should accept flex props', (): void => {
    const { container } = render(
      <StyleProvider>
        <Flex
          justifyContent="flex-end"
          alignItems="center"
          flexWrap="nowrap"
          flexDirection="column"
        >
          <Flex alignSelf="flex-end" />
          <Flex />
        </Flex>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should accept basic built-in props', (): void => {
    const { container } = render(
      <StyleProvider>
        <Flex
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
        </Flex>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
