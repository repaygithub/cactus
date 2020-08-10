import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import FieldWrapper from './FieldWrapper'

describe('component: FormField', (): void => {
  test('should provide 16px of spacing between fields', (): void => {
    const { container } = render(
      <StyleProvider>
        <div>
          <FieldWrapper>
            <input />
          </FieldWrapper>
          <FieldWrapper>
            <input />
          </FieldWrapper>
        </div>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
