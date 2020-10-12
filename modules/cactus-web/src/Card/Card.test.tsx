import { generateTheme } from '@repay/cactus-theme'
import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Card from './Card'

describe('component: Card', (): void => {
  test('snapshot', (): void => {
    const { container } = render(
      <StyleProvider>
        <Card />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
  test('should support margin space props', (): void => {
    const { container } = render(
      <StyleProvider>
        <Card m={2}>Content</Card>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
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
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <Card />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test('should have 4px border radius', (): void => {
      const theme = generateTheme({ primaryHue: 200, shape: 'intermediate' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <Card />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test('should have 1px border radius', (): void => {
      const theme = generateTheme({ primaryHue: 200, shape: 'square' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <Card />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
