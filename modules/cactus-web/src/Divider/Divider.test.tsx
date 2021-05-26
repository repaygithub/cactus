import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Divider from './Divider'

describe('component: Divider', () => {
  test('Should render HR element', () => {
    const { container } = render(
      <StyleProvider>
        <Divider />
      </StyleProvider>
    )
    const divider = container.firstElementChild

    expect(divider?.tagName).toBe('HR')
  })
})
