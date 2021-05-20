import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Dimmer from './Dimmer'

describe('Dimmer render content as children', () => {
  test('Page Dimmer: Should render content when active=true', () => {
    const { container } = render(
      <StyleProvider>
        <Dimmer active>
          <h2>Children is here!</h2>
        </Dimmer>
      </StyleProvider>
    )
    expect(container).toHaveTextContent('Children is here!')
  })
  test('Page Dimmer: Should NOT render content when active=false', () => {
    const { container } = render(
      <StyleProvider>
        <Dimmer active={false}>
          <h2>Children is here!</h2>
        </Dimmer>
      </StyleProvider>
    )
    expect(container).not.toHaveTextContent('Children is here!')
  })
})
