import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Flex from './Flex'

describe('component: Flex', (): void => {
  test('should accept flex props', (): void => {
    const { getByTestId } = render(
      <StyleProvider>
        <Flex
          justifyContent="flex-end"
          alignItems="center"
          flexWrap="nowrap"
          flexDirection="column"
          data-testid="flexContainer"
        >
          <Flex alignSelf="flex-end" />
          <Flex />
        </Flex>
      </StyleProvider>
    )
    const flexContainer = getByTestId('flexContainer')
    const styles = window.getComputedStyle(flexContainer)

    expect(styles.justifyContent).toBe('flex-end')
    expect(styles.alignItems).toBe('center')
    expect(styles.flexWrap).toBe('nowrap')
    expect(styles.flexDirection).toBe('column')
  })

  test('should accept basic built-in props', (): void => {
    const { getByText } = render(
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
    const flexContainer = getByText('Content')
    const styles = window.getComputedStyle(flexContainer as Element)

    expect(styles.position).toBe('relative')
    expect(styles.margin).toBe('4px')
    expect(styles.color).toBe('rgb(255, 255, 255)')
    expect(styles.borderStyle).toBe('solid')
  })
})
