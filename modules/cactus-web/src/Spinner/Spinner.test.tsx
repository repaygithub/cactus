import * as React from 'react'
import { cleanup, render } from 'react-testing-library'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Spinner from './Spinner'

afterEach(cleanup)

describe('component: Spinner', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <Spinner />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
