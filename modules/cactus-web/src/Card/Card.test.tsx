import { generateTheme } from '@repay/cactus-theme'
import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Card from './Card'

describe('component: Card', (): void => {
  test('should support margin space props', (): void => {
    const { getByText } = render(
      <StyleProvider>
        <Card m={2}>Content</Card>
      </StyleProvider>
    )
    const card = getByText('Content')
    const cardSyles = window.getComputedStyle(card)

    expect(cardSyles.margin).toBe('4px')
  })

  test('should support padding props', (): void => {
    const { getByText, rerender } = render(
      <StyleProvider>
        <Card>Content</Card>
      </StyleProvider>
    )

    let card = getByText('Content')
    expect(window.getComputedStyle(card).padding).toBe('16px')

    rerender(
      <StyleProvider>
        <Card padding={7}>Content</Card>
      </StyleProvider>
    )

    card = getByText('Content')
    expect(window.getComputedStyle(card).padding).toBe('40px')

    rerender(
      <StyleProvider>
        <Card padding={7} paddingX={5}>
          Content
        </Card>
      </StyleProvider>
    )

    card = getByText('Content')
    expect(window.getComputedStyle(card).paddingTop).toBe('40px')
    expect(window.getComputedStyle(card).paddingBottom).toBe('40px')
    expect(window.getComputedStyle(card).paddingLeft).toBe('24px')
    expect(window.getComputedStyle(card).paddingRight).toBe('24px')

    rerender(
      <StyleProvider>
        <Card padding={7} paddingY={5}>
          Content
        </Card>
      </StyleProvider>
    )

    card = getByText('Content')
    expect(window.getComputedStyle(card).paddingTop).toBe('24px')
    expect(window.getComputedStyle(card).paddingBottom).toBe('24px')
    expect(window.getComputedStyle(card).paddingLeft).toBe('40px')
    expect(window.getComputedStyle(card).paddingRight).toBe('40px')
  })

  describe('with theme customization', (): void => {
    test('should have no box shadow & 2px borders', (): void => {
      const theme = generateTheme({ primaryHue: 200, boxShadows: false, border: 'thick' })
      const { getByText } = render(
        <StyleProvider theme={theme}>
          <Card>Content</Card>
        </StyleProvider>
      )

      const card = getByText('Content')
      const cardSyles = window.getComputedStyle(card)

      expect(cardSyles.borderWidth).toBe('2px')
      expect(cardSyles.boxShadow).toBe('')
    })

    test('should have 4px border radius', (): void => {
      const theme = generateTheme({ primaryHue: 200, shape: 'intermediate' })
      const { getByText } = render(
        <StyleProvider theme={theme}>
          <Card>Content</Card>
        </StyleProvider>
      )

      const card = getByText('Content')
      const cardSyles = window.getComputedStyle(card)

      expect(cardSyles.borderRadius).toBe('4px')
    })
  })

  test('should support flex item props', () => {
    const { getByText } = render(
      <StyleProvider>
        <Card flex={1} flexGrow={1} flexShrink={0} flexBasis={0}>
          Flex Card
        </Card>
      </StyleProvider>
    )

    const card = getByText('Flex Card')
    expect(card).toHaveStyle('flex: 1')
    expect(card).toHaveStyle('flex-grow: 1')
    expect(card).toHaveStyle('flex-shrink: 0')
    expect(card).toHaveStyle('flex-basis: 0')
  })
})
