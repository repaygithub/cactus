import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Divider from './Divider'

describe('component: Divider', () => {
  test('Should render HR element', () => {
    const { container } = renderWithTheme(<Divider margin="6.493px" />)
    const divider = container.firstElementChild

    expect(divider?.tagName).toBe('HR')
    expect(divider).toHaveStyle({ margin: '6.493px' })
  })
})
