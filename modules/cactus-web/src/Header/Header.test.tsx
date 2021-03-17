import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Header from './Header'

describe('component: Header', () => {
  test('Header component should change their background color by passing the bgColor prop', () => {
    const { getByTestId } = render(
      <StyleProvider>
        <Header bgColor="white" data-testid="headerComponent"></Header>
      </StyleProvider>
    )

    const rawHeader = getByTestId('headerComponent')
    const headerStyles = window.getComputedStyle(rawHeader)
    expect(headerStyles.backgroundColor).toBe('rgb(255, 255, 255)')
  })
})
