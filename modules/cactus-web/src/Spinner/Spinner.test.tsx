import * as React from 'react'
import { cleanup, render } from 'react-testing-library'
import { ThemeProvider } from 'styled-components'
import cactusTheme from '@repay/cactus-theme'
import Spinner from './Spinner'

afterEach(cleanup)

describe('component: Spinner', () => {
  test('snapshot', () => {
    const { container } = render(
      <ThemeProvider theme={cactusTheme}>
        <Spinner />
      </ThemeProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
