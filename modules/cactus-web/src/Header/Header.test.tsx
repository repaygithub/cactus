import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Header from './Header'

describe('component: Header', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <Header />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
