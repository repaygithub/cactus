import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import StepAvatar from './StepAvatar'

describe('component: StepAvatar', () => {
  test('exists', () => {
    const { getByTestId } = renderWithTheme(
      <StepAvatar status="inProcess" data-testid="stepAvatar" />
    )
    expect(getByTestId('stepAvatar')).toBeInTheDocument()
  })
})
