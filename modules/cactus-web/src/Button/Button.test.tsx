import * as React from 'react'
import { cleanup, render, fireEvent } from 'react-testing-library'
import Button from './Button'
import { ThemeProvider } from 'styled-components'
import cactusTheme from '@repay/cactus-theme'

afterEach(cleanup)

describe('component: Button', () => {
  test('should default to standard variant', () => {
    const button = render(
      <ThemeProvider theme={cactusTheme}>
        <Button>Click me!</Button>
      </ThemeProvider>
    )

    expect(button.asFragment()).toMatchSnapshot()
  })

  test('should render standard variant', () => {
    const button = render(
      <ThemeProvider theme={cactusTheme}>
        <Button variant="standard">Click me!</Button>
      </ThemeProvider>
    )

    expect(button.asFragment()).toMatchSnapshot()
  })

  test('should render call to action variant', () => {
    const button = render(
      <ThemeProvider theme={cactusTheme}>
        <Button variant="action">Click me!</Button>
      </ThemeProvider>
    )

    expect(button.asFragment()).toMatchSnapshot()
  })

  test('should render disabled variant', () => {
    const button = render(
      <ThemeProvider theme={cactusTheme}>
        <Button disabled>Click me!</Button>
      </ThemeProvider>
    )

    expect(button.asFragment()).toMatchSnapshot()
  })

  test('should render inverse standard variant', () => {
    const button = render(
      <ThemeProvider theme={cactusTheme}>
        <Button variant="standard" inverse>
          Click me!
        </Button>
      </ThemeProvider>
    )

    expect(button.asFragment()).toMatchSnapshot()
  })

  test('should render inverse call to action variant', () => {
    const button = render(
      <ThemeProvider theme={cactusTheme}>
        <Button variant="action" inverse>
          Click me!
        </Button>
      </ThemeProvider>
    )

    expect(button.asFragment()).toMatchSnapshot()
  })

  test('should render inverse disabled variant', () => {
    const button = render(
      <ThemeProvider theme={cactusTheme}>
        <Button disabled inverse>
          }>Click me!
        </Button>
      </ThemeProvider>
    )

    expect(button.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', () => {
    const button = render(
      <ThemeProvider theme={cactusTheme}>
        <Button mt={5}>I have margins!</Button>
      </ThemeProvider>
    )

    expect(button.asFragment()).toMatchSnapshot()
  })

  test('should not support padding space props', () => {
    const _error = console.error
    console.error = jest.fn()
    const button = render(
      <ThemeProvider theme={cactusTheme}>
        <Button pt={5} />
      </ThemeProvider>
    )

    expect(console.error).toHaveBeenCalledWith(
      'Padding props are not supported! The value 5 for prop pt will have no effect on Button.'
    )
    expect(button.asFragment()).toMatchSnapshot()
    console.error = _error
  })

  test('should trigger onClick', () => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <Button onClick={onClick} variant="action" data-testid="clicked">
          Click me!
        </Button>
      </ThemeProvider>
    )

    fireEvent.click(getByTestId('clicked'))
    expect(onClick).toHaveBeenCalled()
  })

  test('should not trigger disabled onClick', () => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <Button onClick={onClick} variant="action" disabled data-testid="not-clicked">
          Click me!
        </Button>
      </ThemeProvider>
    )

    fireEvent.click(getByTestId('not-clicked'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
