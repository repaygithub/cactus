import * as React from 'react'
import { cleanup, render, fireEvent } from 'react-testing-library'
import TextButton from './TextButton'
import cactusTheme from '@repay/cactus-theme'
import { ThemeProvider } from 'styled-components'
import { StatusCheck } from '@repay/cactus-icons'

afterEach(cleanup)

describe('component: TextButton', () => {
  test('should default to standard variant', () => {
    const textButton = render(
      <ThemeProvider theme={cactusTheme}>
        <TextButton>Click me!</TextButton>
      </ThemeProvider>
    )

    expect(textButton.asFragment()).toMatchSnapshot()
  })

  test('should render standard variant', () => {
    const textButton = render(
      <ThemeProvider theme={cactusTheme}>
        <TextButton variant="standard">Click me!</TextButton>
      </ThemeProvider>
    )

    expect(textButton.asFragment()).toMatchSnapshot()
  })

  test('should render call to action variant', () => {
    const textButton = render(
      <ThemeProvider theme={cactusTheme}>
        <TextButton variant="action">Click me!</TextButton>
      </ThemeProvider>
    )

    expect(textButton.asFragment()).toMatchSnapshot()
  })

  test('should render disabled variant', () => {
    const textButton = render(
      <ThemeProvider theme={cactusTheme}>
        <TextButton disabled>Click me!</TextButton>
      </ThemeProvider>
    )

    expect(textButton.asFragment()).toMatchSnapshot()
  })

  test('should render inverse standard variant', () => {
    const textButton = render(
      <ThemeProvider theme={cactusTheme}>
        <TextButton variant="standard" inverse>
          Click me!
        </TextButton>
      </ThemeProvider>
    )

    expect(textButton.asFragment()).toMatchSnapshot()
  })

  test('should render inverse call to action variant', () => {
    const textButton = render(
      <ThemeProvider theme={cactusTheme}>
        <TextButton variant="action" inverse>
          Click me!
        </TextButton>
      </ThemeProvider>
    )

    expect(textButton.asFragment()).toMatchSnapshot()
  })

  test('should render inverse disabled variant', () => {
    const textButton = render(
      <ThemeProvider theme={cactusTheme}>
        <TextButton variant="standard" inverse disabled>
          Click me!
        </TextButton>
      </ThemeProvider>
    )

    expect(textButton.asFragment()).toMatchSnapshot()
  })

  test('should trigger onClick', () => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <TextButton onClick={onClick} data-testid="clicked">
          Click me!
        </TextButton>
      </ThemeProvider>
    )

    fireEvent.click(getByTestId('clicked'))
    expect(onClick).toHaveBeenCalled()
  })

  test('should not trigger onClick', () => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <TextButton disabled onClick={onClick} data-testid="not-clicked">
          Click me!
        </TextButton>
      </ThemeProvider>
    )

    fireEvent.click(getByTestId('not-clicked'))
    expect(onClick).not.toHaveBeenCalled()
  })

  test('should render a text+icon button', () => {
    const textIconButton = render(
      <ThemeProvider theme={cactusTheme}>
        <TextButton>
          <StatusCheck />
          Check check
        </TextButton>
      </ThemeProvider>
    )

    expect(textIconButton.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled text+icon button', () => {
    const textIconButton = render(
      <ThemeProvider theme={cactusTheme}>
        <TextButton>
          <StatusCheck />
          Check check
        </TextButton>
      </ThemeProvider>
    )

    expect(textIconButton.asFragment()).toMatchSnapshot()
  })
})
