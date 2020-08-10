import { generateTheme } from '@repay/cactus-theme'
import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import TextInput from './TextInput'

afterEach(cleanup)

describe('component: TextInput', (): void => {
  test('should render a text input', (): void => {
    const input = render(
      <StyleProvider>
        <TextInput />
      </StyleProvider>
    )

    expect(input.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled input', (): void => {
    const input = render(
      <StyleProvider>
        <TextInput disabled />
      </StyleProvider>
    )

    expect(input.asFragment()).toMatchSnapshot()
  })

  test('should render an input with a placeholder', (): void => {
    const input = render(
      <StyleProvider>
        <TextInput placeholder="hold my place" />
      </StyleProvider>
    )

    expect(input.asFragment()).toMatchSnapshot()
  })

  test('should render a success input', (): void => {
    const input = render(
      <StyleProvider>
        <TextInput status="success" />
      </StyleProvider>
    )

    expect(input.asFragment()).toMatchSnapshot()
  })

  test('should render an warning input', (): void => {
    const input = render(
      <StyleProvider>
        <TextInput status="warning" />
      </StyleProvider>
    )

    expect(input.asFragment()).toMatchSnapshot()
  })

  test('should render an error input', (): void => {
    const input = render(
      <StyleProvider>
        <TextInput status="error" />
      </StyleProvider>
    )

    expect(input.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', (): void => {
    const textInput = render(
      <StyleProvider>
        <TextInput marginTop={4} />
      </StyleProvider>
    )

    expect(textInput.asFragment()).toMatchSnapshot()
  })

  test('should trigger onChange handler', (): void => {
    const onChange = jest.fn()
    const { getByPlaceholderText } = render(
      <StyleProvider>
        <TextInput placeholder="get this" onChange={onChange} />
      </StyleProvider>
    )

    userEvent.type(getByPlaceholderText('get this'), 'typing...')
    expect(onChange).toHaveBeenCalled()
  })

  describe('with theme customization', (): void => {
    test('should have 2px border', (): void => {
      const theme = generateTheme({ primaryHue: 200, border: 'thick' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <TextInput />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test('should have 8px border radius', (): void => {
      const theme = generateTheme({ primaryHue: 200, shape: 'intermediate' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <TextInput />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test('should have 1px border radius', (): void => {
      const theme = generateTheme({ primaryHue: 200, shape: 'square' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <TextInput />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
