import * as React from 'react'
import { cleanup, render, fireEvent } from 'react-testing-library'
import RadioButton from './RadioButton'
import cactusTheme from '@repay/cactus-theme'
import { ThemeProvider } from 'styled-components'

afterEach(cleanup)

describe('component: RadioButton', () => {
  test('should render a radio button', () => {
    const radioButton = render(
      <ThemeProvider theme={cactusTheme}>
        <RadioButton id="radio" />
      </ThemeProvider>
    )

    expect(radioButton.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled radio button', () => {
    const radioButton = render(
      <ThemeProvider theme={cactusTheme}>
        <RadioButton id="radio" disabled />
      </ThemeProvider>
    )

    expect(radioButton.asFragment()).toMatchSnapshot()
  })

  test('should trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <RadioButton id="radio" onChange={onChange} data-testid="will-change" />
      </ThemeProvider>
    )

    fireEvent.click(getByTestId('will-change'))
    expect(onChange).toHaveBeenCalled()
  })

  test('should trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <RadioButton id="radio" onFocus={onFocus} data-testid="will-focus" />
      </ThemeProvider>
    )

    fireEvent.focus(getByTestId('will-focus'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onFocus event', () => {
    const onBlur = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <RadioButton id="radio" onBlur={onBlur} data-testid="will-blur" />
      </ThemeProvider>
    )

    fireEvent.blur(getByTestId('will-blur'))
    expect(onBlur).toHaveBeenCalled()
  })

  /* TODO: fireEvent.click and userEvent.click on a disabled radio button fall victim to the same problem that affects
  the checkboxes; it's a bug in react-testing-library and/or user-event. If/when that issue is fixed, we should add
  tests to ensure that no events are triggered when the radio button is disabled. */
})
