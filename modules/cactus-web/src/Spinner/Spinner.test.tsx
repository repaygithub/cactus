import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Spinner from './Spinner'

describe('component: Spinner', (): void => {
  test('snapshot', (): void => {
    const { container } = render(
      <StyleProvider>
        <Spinner />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
