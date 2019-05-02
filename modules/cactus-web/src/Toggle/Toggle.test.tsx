import * as React from 'react'
import { cleanup, render, fireEvent } from 'react-testing-library'
import Toggle from './Toggle'
import cactusTheme from '@repay/cactus-theme'
import { ThemeProvider } from 'styled-components'

afterEach(cleanup)

describe('component: Toggle', () => {
  test('should render a toggle', () => {
    const toggle = render(
      <ThemeProvider theme={cactusTheme}>
        <Toggle value={false} />
      </ThemeProvider>
    )

    expect(toggle.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled toggle', () => {
    const toggle = render(
      <ThemeProvider theme={cactusTheme}>
        <Toggle value={false} disabled={true} />
      </ThemeProvider>
    )

    expect(toggle.asFragment()).toMatchSnapshot()
  })

  test('should initialize value to true', () => {
    const toggle = render(
      <ThemeProvider theme={cactusTheme}>
        <Toggle value={true} />
      </ThemeProvider>
    )

    expect(toggle.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', () => {
    const toggle = render(
      <ThemeProvider theme={cactusTheme}>
        <Toggle value={false} marginBottom={4} />
      </ThemeProvider>
    )

    expect(toggle.asFragment()).toMatchSnapshot()
  })

  test('should trigger onClick event', () => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <Toggle value={false} onClick={onClick} data-testid="will-click" />
      </ThemeProvider>
    )

    fireEvent.click(getByTestId('will-click'))
    expect(onClick).toHaveBeenCalled()
  })

  test('should not trigger onClick event', () => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <Toggle value={false} onClick={onClick} disabled={true} data-testid="will-not-click" />
      </ThemeProvider>
    )

    fireEvent.click(getByTestId('will-not-click'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
