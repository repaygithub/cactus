import { cleanup, fireEvent, render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import FieldWrapper from './FieldWrapper'

afterEach(cleanup)

describe('component: FormField', () => {
  test('should provide 16px of spacing between fields', () => {
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
