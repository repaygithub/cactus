import * as React from 'react'
import { cleanup, render, fireEvent } from 'react-testing-library'
import Button from './Button'
import { ThemeProvider } from 'styled-components'
import cactusTheme from '@repay/cactus-theme'
import { ActionsDelete } from '@repay/cactus-icons'

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

  test('should support svgs as children', () => {
    const button = render(
      <ThemeProvider theme={cactusTheme}>
        <Button>
          <ActionsDelete /> Delete
        </Button>
      </ThemeProvider>
    )
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
