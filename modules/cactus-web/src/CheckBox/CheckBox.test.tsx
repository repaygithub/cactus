import * as React from 'react'
import { cleanup, render, fireEvent } from 'react-testing-library'
import userEvent from 'user-event'
import CheckBox from './CheckBox'
import cactusTheme from '@repay/cactus-theme'
import { ThemeProvider } from 'styled-components'

afterEach(cleanup)

describe('component: CheckBox', () => {
  test('should render a checkbox', () => {
    const checkBox = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBox id="check" />
      </ThemeProvider>
    )

    expect(checkBox.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled checkbox', () => {
    const checkBox = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBox id="checking" disabled />
      </ThemeProvider>
    )

    expect(checkBox.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', () => {
    const checkBox = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBox id="SPACE PROPS YEAH" m={4} />
      </ThemeProvider>
    )

    expect(checkBox.asFragment()).toMatchSnapshot()
  })

  test('should not support padding space props', () => {
    const _error = console.error
    console.error = jest.fn()
    const checkbox = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBox id="SPACE PROPS YEAH" p={4} />
      </ThemeProvider>
    )

    expect(console.error).toHaveBeenCalledWith(
      'Padding props are not supported! The value 4 for prop p will have no effect on CheckBox.'
    )
    expect(checkbox.asFragment()).toMatchSnapshot()
    console.error = _error
  })

  test('should trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBox id="checked" onChange={onChange} data-testid="will-check" />
      </ThemeProvider>
    )

    fireEvent.click(getByTestId('will-check'))
    expect(onChange).toHaveBeenCalled()
  })

  test('should trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBox id="checked" onFocus={onFocus} data-testid="will-check" />
      </ThemeProvider>
    )

    fireEvent.focus(getByTestId('will-check'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onBlur event', () => {
    const onBlur = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBox id="checked" onBlur={onBlur} data-testid="will-check" />
      </ThemeProvider>
    )

    fireEvent.blur(getByTestId('will-check'))
    expect(onBlur).toHaveBeenCalled()
  })

  test('should not trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBox id="checked" onChange={onChange} data-testid="will-not-check" disabled />
      </ThemeProvider>
    )

    userEvent.click(getByTestId('will-not-check'))
    expect(onChange).not.toHaveBeenCalled()
  })

  test('should not trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBox id="checked" onFocus={onFocus} data-testid="will-not-check" disabled />
      </ThemeProvider>
    )

    userEvent.click(getByTestId('will-not-check'))
    expect(onFocus).not.toHaveBeenCalled()
  })
})
