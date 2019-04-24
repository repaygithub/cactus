import * as React from 'react'
import { cleanup, render, fireEvent } from 'react-testing-library'
import Label from './Label'
import cactusTheme from '@repay/cactus-theme'
import { ThemeProvider } from 'styled-components'

afterEach(cleanup)

describe('component: Label', () => {
  test('should render a label component', () => {
    const label = render(
      <ThemeProvider theme={cactusTheme}>
        <Label>It is important to label UI elements</Label>
      </ThemeProvider>
    )

    expect(label.asFragment()).toMatchSnapshot()
  })
})
