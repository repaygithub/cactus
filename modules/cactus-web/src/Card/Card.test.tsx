import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Card from './Card'

describe('component: Card', () => {
  test('should support margin space props', () => {
    const { getByText } = renderWithTheme(<Card m={2}>Content</Card>)
    const card = getByText('Content')
    const cardSyles = window.getComputedStyle(card)

    expect(cardSyles.margin).toBe('4px')
  })

  test('should support padding props', () => {
    const { getByText, rerender } = renderWithTheme(<Card>Content</Card>)

    let card = getByText('Content')
    expect(window.getComputedStyle(card).padding).toBe('16px')

    rerender(<Card padding={7}>Content</Card>)

    card = getByText('Content')
    expect(window.getComputedStyle(card).padding).toBe('40px')

    rerender(
      <Card padding={7} paddingX={5}>
        Content
      </Card>
    )

    card = getByText('Content')
    expect(window.getComputedStyle(card).paddingTop).toBe('40px')
    expect(window.getComputedStyle(card).paddingBottom).toBe('40px')
    expect(window.getComputedStyle(card).paddingLeft).toBe('24px')
    expect(window.getComputedStyle(card).paddingRight).toBe('24px')

    rerender(
      <Card padding={7} paddingY={5}>
        Content
      </Card>
    )

    card = getByText('Content')
    expect(window.getComputedStyle(card).paddingTop).toBe('24px')
    expect(window.getComputedStyle(card).paddingBottom).toBe('24px')
    expect(window.getComputedStyle(card).paddingLeft).toBe('40px')
    expect(window.getComputedStyle(card).paddingRight).toBe('40px')
  })

  describe('with theme customization', () => {
    test('should have no box shadow & 2px borders', () => {
      const { getByText } = renderWithTheme(<Card>Content</Card>, {
        boxShadows: false,
        border: 'thick',
      })

      const card = getByText('Content')
      const cardSyles = window.getComputedStyle(card)

      expect(cardSyles.borderWidth).toBe('2px')
      expect(cardSyles.boxShadow).toBe('')
    })

    test('should have 4px border radius', () => {
      const { getByText } = renderWithTheme(<Card>Content</Card>, { shape: 'intermediate' })

      const card = getByText('Content')
      const cardSyles = window.getComputedStyle(card)

      expect(cardSyles.borderRadius).toBe('4px')
    })
  })

  test('should support flex item props', () => {
    const { getByText } = renderWithTheme(
      <Card flex={1} flexGrow={1} flexShrink={0} flexBasis={0}>
        Flex Card
      </Card>
    )

    const card = getByText('Flex Card')
    expect(card).toHaveStyle('flex: 1')
    expect(card).toHaveStyle('flex-grow: 1')
    expect(card).toHaveStyle('flex-shrink: 0')
    expect(card).toHaveStyle('flex-basis: 0')
  })
})
