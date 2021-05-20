import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import StepAvatar from './StepAvatar'

describe('component: StepAvatar', (): void => {
  test('exists', (): void => {
    const { getByTestId } = render(
      <StyleProvider>
        <StepAvatar status="inProcess" data-testid="stepAvatar" />
      </StyleProvider>
    )
    expect(getByTestId('stepAvatar')).toBeInTheDocument()
  })
})
