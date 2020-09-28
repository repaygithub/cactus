import { generateTheme } from '@repay/cactus-theme'
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
          overflow="scroll"
        >
          Content
        </Box>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('borderRadius prop should accept themed arg & custom shape definitions', () => {
    const { getByText, rerender } = render(
      <StyleProvider theme={generateTheme({ primaryHue: 200, shape: 'intermediate' })}>
        <Box borderRadius="themed">Content</Box>
      </StyleProvider>
    )

    let myBox = getByText('Content')
    let boxStyles = window.getComputedStyle(myBox)
    expect(boxStyles.borderRadius).toBe('4px')

    rerender(
      <StyleProvider theme={generateTheme({ primaryHue: 200, shape: 'intermediate' })}>
        <Box borderRadius={{ square: '4px', intermediate: '12px', round: '25px' }}>Content</Box>
      </StyleProvider>
    )

    myBox = getByText('Content')
    boxStyles = window.getComputedStyle(myBox)
    expect(boxStyles.borderRadius).toBe('12px')

    rerender(
      <StyleProvider theme={generateTheme({ primaryHue: 200, shape: 'round' })}>
        <Box borderRadius={{ square: '4px', intermediate: '12px', round: '25px' }}>Content</Box>
      </StyleProvider>
    )

    myBox = getByText('Content')
    boxStyles = window.getComputedStyle(myBox)
    expect(boxStyles.borderRadius).toBe('25px')
  })

  test('individual border radius props should accept custom shape definitions', () => {
    const { getByText, rerender } = render(
      <StyleProvider theme={generateTheme({ primaryHue: 200, shape: 'intermediate' })}>
        <Box
          borderTopLeftRadius={{ square: '1px', intermediate: '10px', round: '20px' }}
          borderTopRightRadius={{ square: '20px', intermediate: '10px', round: '1px' }}
          borderBottomRightRadius={{ square: '1px', intermediate: '10px', round: '20px' }}
          borderBottomLeftRadius={{ square: '20px', intermediate: '10px', round: '1px' }}
        >
          Content
        </Box>
      </StyleProvider>
    )

    let myBox = getByText('Content')
    let boxStyles = window.getComputedStyle(myBox)
    expect(boxStyles.borderTopLeftRadius).toBe('10px')
    expect(boxStyles.borderTopRightRadius).toBe('10px')
    expect(boxStyles.borderBottomRightRadius).toBe('10px')
    expect(boxStyles.borderBottomLeftRadius).toBe('10px')

    rerender(
      <StyleProvider theme={generateTheme({ primaryHue: 200, shape: 'square' })}>
        <Box
          borderTopLeftRadius={{ square: '1px', intermediate: '10px', round: '20px' }}
          borderTopRightRadius={{ square: '20px', intermediate: '10px', round: '1px' }}
          borderBottomRightRadius={{ square: '1px', intermediate: '10px', round: '20px' }}
          borderBottomLeftRadius={{ square: '20px', intermediate: '10px', round: '1px' }}
        >
          Content
        </Box>
      </StyleProvider>
    )

    myBox = getByText('Content')
    boxStyles = window.getComputedStyle(myBox)
    expect(boxStyles.borderTopLeftRadius).toBe('1px')
    expect(boxStyles.borderTopRightRadius).toBe('20px')
    expect(boxStyles.borderBottomRightRadius).toBe('1px')
    expect(boxStyles.borderBottomLeftRadius).toBe('20px')
  })
})
