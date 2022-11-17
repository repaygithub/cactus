import { generateTheme } from '@repay/cactus-theme'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Box from './Box'

describe('component: Box', () => {
  test('should accept built-in props', () => {
    const { getByText } = renderWithTheme(
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
    )
    const box = getByText('Content')
    const style = window.getComputedStyle(box)

    expect(style.zIndex).toBe('100')
    expect(style.borderStyle).toBe('solid')
    expect(style.borderRadius).toBe('20px')
  })

  test('borderRadius prop should accept themed arg & custom shape definitions', () => {
    const { getByText, rerender } = renderWithTheme(<Box borderRadius="themed">Content</Box>, {
      shape: 'intermediate',
    })

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

  test('border radius props should accept responsive values', () => {
    const { getByText } = renderWithTheme(
      <Box borderRadius={['12px', '15px']} borderTopLeftRadius={['2px', '9px']}>
        Content
      </Box>
    )

    expect(getByText('Content')).toHaveStyle({
      borderRadius: '15px',
      borderTopLeftRadius: '9px',
    })
  })

  test('individual border radius props should accept custom shape definitions', () => {
    const { getByText, rerender } = renderWithTheme(
      <Box
        borderTopLeftRadius={{ square: '1px', intermediate: '10px', round: '20px' }}
        borderTopRightRadius={{ square: '20px', intermediate: '10px', round: '1px' }}
        borderBottomRightRadius={{ square: '1px', intermediate: '10px', round: '20px' }}
        borderBottomLeftRadius={{ square: '20px', intermediate: '10px', round: '1px' }}
      >
        Content
      </Box>,
      { shape: 'intermediate' }
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

  test('should accept flex item props', () => {
    const { getByText } = renderWithTheme(
      <Box flex={1} flexGrow={1} flexShrink={0} flexBasis={0}>
        Flex Item Box
      </Box>
    )

    const box = getByText('Flex Item Box')
    const boxStyles = window.getComputedStyle(box)
    expect(boxStyles.flex).toBe('1')
    expect(boxStyles.flexBasis).toBe('0px')
    expect(boxStyles.flexGrow).toBe('1')
    expect(boxStyles.flexShrink).toBe('0')
  })
})
