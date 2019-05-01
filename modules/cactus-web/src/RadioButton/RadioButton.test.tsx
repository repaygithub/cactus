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
        <RadioButton name="test" id="radio" />
      </ThemeProvider>
    )

    expect(radioButton.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled radio button', () => {
    const radioButton = render(
      <ThemeProvider theme={cactusTheme}>
        <RadioButton name="test" id="radio" disabled />
      </ThemeProvider>
    )

    expect(radioButton.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', () => {
    const radioButton = render(
      <ThemeProvider theme={cactusTheme}>
        <RadioButton name="test" id="SPACE PROPS YEAH" margin={4} />
      </ThemeProvider>
    )

    expect(radioButton.asFragment()).toMatchSnapshot()
  })

  test('should not support padding space props', () => {
    const _error = console.error
    console.error = jest.fn()
    const radioButton = render(
      <ThemeProvider theme={cactusTheme}>
        <RadioButton name="test" id="SPACE PROPS YEAH" padding={4} />
      </ThemeProvider>
    )

    expect(console.error).toHaveBeenCalledWith(
      'Padding props are not supported! The value 4 for prop padding will have no effect on RadioButton.'
    )
    expect(radioButton.asFragment()).toMatchSnapshot()
    console.error = _error
  })

  test('should trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByLabelText } = render(
      <ThemeProvider theme={cactusTheme}>
        <RadioButton name="test" id="radio" onChange={onChange} aria-label="will-change" />
      </ThemeProvider>
    )

    fireEvent.click(getByLabelText('will-change'))
    expect(onChange).toHaveBeenCalled()
  })

  test('should trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByLabelText } = render(
      <ThemeProvider theme={cactusTheme}>
        <RadioButton name="test" id="radio" onFocus={onFocus} aria-label="will-focus" />
      </ThemeProvider>
    )

    fireEvent.focus(getByLabelText('will-focus'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onFocus event', () => {
    const onBlur = jest.fn()
    const { getByLabelText } = render(
      <ThemeProvider theme={cactusTheme}>
        <RadioButton name="test" id="radio" onBlur={onBlur} aria-label="will-blur" />
      </ThemeProvider>
    )

    fireEvent.blur(getByLabelText('will-blur'))
    expect(onBlur).toHaveBeenCalled()
  })

  /* TODO: fireEvent.click and userEvent.click on a disabled radio button fall victim to the same problem that affects
  the checkboxes; it's a bug in react-testing-library and/or user-event. If/when that issue is fixed, we should add
  tests to ensure that no events are triggered when the radio button is disabled. */
})
