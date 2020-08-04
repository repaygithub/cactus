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
