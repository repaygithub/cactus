import * as React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { StyleProvider } from '@repay/cactus-web'
import cactusTheme from '@repay/cactus-theme'
import Card from './Card'

afterEach(cleanup)

describe('component: Card', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <Card />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
  test('should support margin space props', () => {
    const { container } = render(
      <StyleProvider>
        <Card m={2}>Content</Card>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
