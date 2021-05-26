import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Spinner from './Spinner'

describe('component: Spinner', (): void => {
  test('Exists', (): void => {
    const { getByTestId } = render(
      <StyleProvider>
        <Spinner data-testid="spin" />
      </StyleProvider>
    )
    const spinner = getByTestId('spin')
    expect(spinner.tagName).toBe('svg')
    expect(spinner).toBeInTheDocument()
  })
})
