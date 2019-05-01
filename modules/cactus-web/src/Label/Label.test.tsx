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

  test('should support margin space props', () => {
    const label = render(
      <ThemeProvider theme={cactusTheme}>
        <Label ml={2} />
      </ThemeProvider>
    )

    expect(label.asFragment()).toMatchSnapshot()
  })

  test('should not support padding space props', () => {
    const _error = console.error
    console.error = jest.fn()
    const label = render(
      <ThemeProvider theme={cactusTheme}>
        <Label pl={2} />
      </ThemeProvider>
    )

    expect(console.error).toHaveBeenCalledWith(
      'Padding props are not supported! The value 2 for prop pl will have no effect on Label.'
    )
    expect(label.asFragment()).toMatchSnapshot()
    console.error = _error
  })
})
