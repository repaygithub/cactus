import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Divider from './Divider'

describe('component: Divider', () => {
  test('Should render HR element', () => {
    const { container } = renderWithTheme(<Divider />)
    const divider = container.firstElementChild

    expect(divider?.tagName).toBe('HR')
  })
})
