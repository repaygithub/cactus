import * as React from 'react'
import { cleanup, render, fireEvent, queryByAttribute } from 'react-testing-library'
import userEvent from 'user-event'
import CheckBoxField from './CheckBoxField'
import cactusTheme from '@repay/cactus-theme'
import { ThemeProvider } from 'styled-components'

afterEach(cleanup)

describe('component: CheckBoxField', () => {
  test('should render a checkbox field', () => {
    const checkboxField = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBoxField label="SoIA" id="my-id" />
      </ThemeProvider>
    )

    expect(checkboxField.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled checkbox field', () => {
    const checkboxField = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBoxField label="NMNL" id="my-id" disabled />
      </ThemeProvider>
    )

    expect(checkboxField.asFragment()).toMatchSnapshot()
  })

  test('should generate unique id when one is not provided', () => {
    const { container, getByText } = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBoxField label="Scoreboard" />
      </ThemeProvider>
    )

    const getById = queryByAttribute.bind(null, 'id')

    const labelElement = getByText('Scoreboard') as HTMLLabelElement
    expect(labelElement.htmlFor).toContain('rand')
    expect(getById(container, labelElement.htmlFor)).not.toBeNull()
  })

  test('should support margin space props', () => {
    const checkboxField = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBoxField label="space props" id="not-random" mr={3} />
      </ThemeProvider>
    )

    expect(checkboxField.asFragment()).toMatchSnapshot()
  })

  test('should not support padding space props', () => {
    const _error = console.error
    console.error = jest.fn()
    const checkboxField = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBoxField label="space props" id="not-random" pr={3} />
      </ThemeProvider>
    )

    expect(console.error).toHaveBeenCalledWith(
      'Padding props are not supported! The value 3 for prop pr will have no effect on CheckBoxField.'
    )
    expect(checkboxField.asFragment()).toMatchSnapshot()
    console.error = _error
  })

  test('should trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBoxField label="Katastro" onChange={onChange} data-testid="will-check" />
      </ThemeProvider>
    )

    fireEvent.click(getByTestId('will-check'))
    expect(onChange).toHaveBeenCalled()
  })

  test('should trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBoxField label="Strange Nights" onFocus={onFocus} data-testid="will-check" />
      </ThemeProvider>
    )

    fireEvent.focus(getByTestId('will-check'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onBlur event', () => {
    const onBlur = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBoxField label="Washed." onBlur={onBlur} data-testid="will-check" />
      </ThemeProvider>
    )

    fireEvent.blur(getByTestId('will-check'))
    expect(onBlur).toHaveBeenCalled()
  })

  test('should not trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBoxField label="Flow" onChange={onChange} data-testid="will-not-check" disabled />
      </ThemeProvider>
    )

    userEvent.click(getByTestId('will-not-check'))
    expect(onChange).not.toHaveBeenCalled()
  })

  test('should not trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBoxField
          label="Not For Sale"
          onFocus={onFocus}
          data-testid="will-not-check"
          disabled
        />
      </ThemeProvider>
    )

    userEvent.click(getByTestId('will-not-check'))
    expect(onFocus).not.toHaveBeenCalled()
  })
})
