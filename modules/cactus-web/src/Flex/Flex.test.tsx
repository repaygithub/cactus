import * as React from 'react'
import { cleanup, render } from 'react-testing-library'
import { StyleProvider } from '@repay/cactus-web'
import Flex from './Flex'

afterEach(cleanup)

describe('component: Flex', () => {
  test('snapshot with no props', () => {
    const { container } = render(
      <StyleProvider>
        <Flex />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should accept flex props', () => {
    const { container } = render(
      <StyleProvider>
        <Flex justifyContent="end" alignItems="center" flexWrap="nowrap" flexDirection="column">
          <Flex alignSelf="end" />
          <Flex justifySelf="center" />
        </Flex>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should accept basic built-in props', () => {
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
