import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import StepAvatar from './StepAvatar'

describe('component: StepAvatar', () => {
  test('should support margin props', () => {
    const { getByTestId } = renderWithTheme(
      <StepAvatar status="inProcess" m={4} data-testid="stepAvatar" />
    )
    expect(getByTestId('stepAvatar')).toHaveStyle({ margin: '16px' })
  })
})
