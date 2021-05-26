import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Alert from './Alert'

describe('component: Alert', (): void => {
  test('Should render the inner text', (): void => {
    const { getByText } = render(
      <StyleProvider>
        <Alert>Message</Alert>
      </StyleProvider>
    )
    expect(getByText('Message')).toBeInTheDocument()
  })
})
