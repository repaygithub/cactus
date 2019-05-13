import * as React from 'react'

import { cleanup, fireEvent, render } from 'react-testing-library'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import cactusTheme from '@repay/cactus-theme'
import CheckBox from './CheckBox'
import userEvent from 'user-event'

afterEach(cleanup)

describe('component: CheckBox', () => {
  test('should render a checkbox', () => {
    const checkBox = render(
      <StyleProvider theme={cactusTheme}>
        <CheckBox id="check" />
      </StyleProvider>
    )

    expect(checkBox.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled checkbox', () => {
    const checkBox = render(
      <StyleProvider theme={cactusTheme}>
        <CheckBox id="checking" disabled />
      </StyleProvider>
    )

    expect(checkBox.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', () => {
    const checkBox = render(
      <StyleProvider theme={cactusTheme}>
        <CheckBox id="MARGIN PROPS YEAH" m={4} />
      </StyleProvider>
    )

    expect(checkBox.asFragment()).toMatchSnapshot()
  })

  test('should trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <StyleProvider theme={cactusTheme}>
        <CheckBox id="checked" onChange={onChange} data-testid="will-check" />
      </StyleProvider>
    )

    fireEvent.click(getByTestId('will-check'))
    expect(onChange).toHaveBeenCalled()
  })

  test('should trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByTestId } = render(
      <StyleProvider theme={cactusTheme}>
        <CheckBox id="checked" onFocus={onFocus} data-testid="will-check" />
      </StyleProvider>
    )

    fireEvent.focus(getByTestId('will-check'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onBlur event', () => {
    const onBlur = jest.fn()
    const { getByTestId } = render(
      <StyleProvider theme={cactusTheme}>
        <CheckBox id="checked" onBlur={onBlur} data-testid="will-check" />
      </StyleProvider>
    )

    fireEvent.blur(getByTestId('will-check'))
    expect(onBlur).toHaveBeenCalled()
  })

  test('should not trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <StyleProvider theme={cactusTheme}>
        <CheckBox id="checked" onChange={onChange} data-testid="will-not-check" disabled />
      </StyleProvider>
    )

    userEvent.click(getByTestId('will-not-check'))
    expect(onChange).not.toHaveBeenCalled()
  })

  test('should not trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByTestId } = render(
      <StyleProvider theme={cactusTheme}>
        <CheckBox id="checked" onFocus={onFocus} data-testid="will-not-check" disabled />
      </StyleProvider>
    )

    userEvent.click(getByTestId('will-not-check'))
    expect(onFocus).not.toHaveBeenCalled()
  })
})
