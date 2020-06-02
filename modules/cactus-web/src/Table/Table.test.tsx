import * as React from 'react'

import { cleanup, fireEvent, render } from '@testing-library/react'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Table from './Table'

afterEach(cleanup)

describe('component: Table', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <Table />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
