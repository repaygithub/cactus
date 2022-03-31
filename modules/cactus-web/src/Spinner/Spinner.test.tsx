import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Spinner from './Spinner'

describe('component: Spinner', () => {
  test('Exists', () => {
    const { getByTestId } = renderWithTheme(<Spinner data-testid="spin" />)
    const spinner = getByTestId('spin')
    expect(spinner.tagName).toBe('svg')
    expect(spinner).toBeInTheDocument()
  })
})
