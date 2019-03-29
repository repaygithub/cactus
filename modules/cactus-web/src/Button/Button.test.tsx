import * as React from 'react'
import { cleanup, render, fireEvent } from 'react-testing-library'
import Button from './Button'
import { ThemeProvider } from 'styled-components'
import cactusTheme from '@repay/cactus-theme'

afterEach(cleanup)

describe('component: Button', () => {
  test('snapshot', () => {
    const { container } = render(
      <ThemeProvider theme={cactusTheme}>
        <Button />
      </ThemeProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
