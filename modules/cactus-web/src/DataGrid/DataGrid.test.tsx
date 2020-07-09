import * as React from 'react'

import { cleanup, fireEvent, render } from '@testing-library/react'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import DataGrid from './DataGrid'

afterEach(cleanup)

describe('component: DataGrid', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <DataGrid />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
