import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Divider from './Divider'

describe('component: Divider', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <Divider />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
