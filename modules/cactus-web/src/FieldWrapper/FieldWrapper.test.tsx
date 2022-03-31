import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import FieldWrapper from './FieldWrapper'

describe('component: FormField', () => {
  test('should provide 16px of spacing between fields', () => {
    const { getByTestId } = renderWithTheme(
      <div>
        <FieldWrapper>
          <input />
        </FieldWrapper>
        <FieldWrapper data-testid="fieldWrapper">
          <input />
        </FieldWrapper>
      </div>
    )
    const fieldWrapper = getByTestId('fieldWrapper')
    const styles = window.getComputedStyle(fieldWrapper)

    expect(styles.marginTop).toBe('16px')
  })
})
