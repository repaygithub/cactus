import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import FieldWrapper from './FieldWrapper'

describe('component: FormField', (): void => {
  test('should provide 16px of spacing between fields', (): void => {
    const { getByTestId } = render(
      <StyleProvider>
        <div>
          <FieldWrapper>
            <input />
          </FieldWrapper>
          <FieldWrapper data-testid="fieldWrapper">
            <input />
          </FieldWrapper>
        </div>
      </StyleProvider>
    )
    const fieldWrapper = getByTestId('fieldWrapper')
    const styles = window.getComputedStyle(fieldWrapper)

    expect(styles.marginTop).toBe('16px')
  })
})
