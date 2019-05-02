import * as React from 'react'
import { cleanup, render } from 'react-testing-library'
import userEvent from 'user-event'
import TextInput from './TextInput'
import cactusTheme from '@repay/cactus-theme'
import { ThemeProvider } from 'styled-components'

afterEach(cleanup)

describe('component: TextInput', () => {
  test('should render a text input', () => {
    const input = render(
      <ThemeProvider theme={cactusTheme}>
        <TextInput />
      </ThemeProvider>
    )

    expect(input.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled input', () => {
    const input = render(
      <ThemeProvider theme={cactusTheme}>
        <TextInput disabled />
      </ThemeProvider>
    )

    expect(input.asFragment()).toMatchSnapshot()
  })

  test('should render an input with a placeholder', () => {
    const input = render(
      <ThemeProvider theme={cactusTheme}>
        <TextInput placeholder="hold my place" />
      </ThemeProvider>
    )

    expect(input.asFragment()).toMatchSnapshot()
  })

  test('should render a success input', () => {
    const input = render(
      <ThemeProvider theme={cactusTheme}>
        <TextInput status="success" />
      </ThemeProvider>
    )

    expect(input.asFragment()).toMatchSnapshot()
  })

  test('should render an invalid input', () => {
    const input = render(
      <ThemeProvider theme={cactusTheme}>
        <TextInput status="invalid" />
      </ThemeProvider>
    )

    expect(input.asFragment()).toMatchSnapshot()
  })

  test('should render an error input', () => {
    const input = render(
      <ThemeProvider theme={cactusTheme}>
        <TextInput status="error" />
      </ThemeProvider>
    )

    expect(input.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', () => {
    const textInput = render(
      <ThemeProvider theme={cactusTheme}>
        <TextInput marginTop={4} />
      </ThemeProvider>
    )

    expect(textInput.asFragment()).toMatchSnapshot()
  })

  test('should trigger onChange handler', () => {
    const onChange = jest.fn()
    const { getByPlaceholderText } = render(
      <ThemeProvider theme={cactusTheme}>
        <TextInput placeholder="get this" onChange={onChange} />
      </ThemeProvider>
    )

    userEvent.type(getByPlaceholderText('get this'), 'typing...')
    expect(onChange).toHaveBeenCalled()
  })
})
