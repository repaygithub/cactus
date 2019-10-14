import * as React from 'react'

import { cleanup, render } from '@testing-library/react'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import cactusTheme from '@repay/cactus-theme'
import TextInput from './TextInput'
import userEvent from '@testing-library/user-event'

afterEach(cleanup)

describe('component: TextInput', () => {
  test('should render a text input', () => {
    const input = render(
      <StyleProvider>
        <TextInput />
      </StyleProvider>
    )

    expect(input.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled input', () => {
    const input = render(
      <StyleProvider>
        <TextInput disabled />
      </StyleProvider>
    )

    expect(input.asFragment()).toMatchSnapshot()
  })

  test('should render an input with a placeholder', () => {
    const input = render(
      <StyleProvider>
        <TextInput placeholder="hold my place" />
      </StyleProvider>
    )

    expect(input.asFragment()).toMatchSnapshot()
  })

  test('should render a success input', () => {
    const input = render(
      <StyleProvider>
        <TextInput status="success" />
      </StyleProvider>
    )

    expect(input.asFragment()).toMatchSnapshot()
  })

  test('should render an warning input', () => {
    const input = render(
      <StyleProvider>
        <TextInput status="warning" />
      </StyleProvider>
    )

    expect(input.asFragment()).toMatchSnapshot()
  })

  test('should render an error input', () => {
    const input = render(
      <StyleProvider>
        <TextInput status="error" />
      </StyleProvider>
    )

    expect(input.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', () => {
    const textInput = render(
      <StyleProvider>
        <TextInput marginTop={4} />
      </StyleProvider>
    )

    expect(textInput.asFragment()).toMatchSnapshot()
  })

  test('should trigger onChange handler', () => {
    const onChange = jest.fn()
    const { getByPlaceholderText } = render(
      <StyleProvider>
        <TextInput placeholder="get this" onChange={onChange} />
      </StyleProvider>
    )

    userEvent.type(getByPlaceholderText('get this'), 'typing...')
    expect(onChange).toHaveBeenCalled()
  })
})
