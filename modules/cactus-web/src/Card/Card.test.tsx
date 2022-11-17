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

  test('should support width props', () => {
    const { getByText } = renderWithTheme(
      <Card minWidth="10em" width="50%" maxWidth="500px">
        Content
      </Card>
    )
    expect(getByText('Content')).toHaveStyle({
      minWidth: '10em',
      width: '50%',
      maxWidth: '500px',
    })
  })

  test('should support padding props', () => {
    const { getByText } = renderWithTheme(
      <>
        <Card>Default</Card>
        <Card padding={7}>Shortcut</Card>
        <Card paddingX={5} paddingTop={2}>
          Separate
        </Card>
      </>
    )

    expect(getByText('Default')).toHaveStyle({ padding: '16px' })
    expect(getByText('Shortcut')).toHaveStyle({ padding: '40px' })
    expect(getByText('Separate')).toHaveStyle({
      paddingTop: '4px',
      paddingBottom: '16px',
      paddingLeft: '24px',
      paddingRight: '24px',
    })
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
