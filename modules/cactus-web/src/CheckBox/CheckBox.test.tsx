import * as React from 'react'

import { cleanup, fireEvent, render } from '@testing-library/react'
import { generateTheme } from '@repay/cactus-theme'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import CheckBox from './CheckBox'
import userEvent from '@testing-library/user-event'

afterEach(cleanup)

describe('component: CheckBox', () => {
  test('should render a checkbox', () => {
    const checkBox = render(
      <StyleProvider>
        <CheckBox id="check" />
      </StyleProvider>
    )

    expect(checkBox.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled checkbox', () => {
    const checkBox = render(
      <StyleProvider>
        <CheckBox id="checking" disabled />
      </StyleProvider>
    )

    expect(checkBox.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', () => {
    const checkBox = render(
      <StyleProvider>
        <CheckBox id="MARGIN PROPS YEAH" m={4} />
      </StyleProvider>
    )

    expect(checkBox.asFragment()).toMatchSnapshot()
  })

  test('should trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <CheckBox id="checked" onChange={onChange} data-testid="will-check" />
      </StyleProvider>
    )

    fireEvent.click(getByTestId('will-check'))
    expect(onChange).toHaveBeenCalled()
  })

  test('should trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <CheckBox id="checked" onFocus={onFocus} data-testid="will-check" />
      </StyleProvider>
    )

    fireEvent.focus(getByTestId('will-check'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onBlur event', () => {
    const onBlur = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <CheckBox id="checked" onBlur={onBlur} data-testid="will-check" />
      </StyleProvider>
    )

    fireEvent.blur(getByTestId('will-check'))
    expect(onBlur).toHaveBeenCalled()
  })

  test('should not trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <CheckBox id="checked" onChange={onChange} data-testid="will-not-check" disabled />
      </StyleProvider>
    )

    userEvent.click(getByTestId('will-not-check'))
    expect(onChange).not.toHaveBeenCalled()
  })

  test('should not trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <CheckBox id="checked" onFocus={onFocus} data-testid="will-not-check" disabled />
      </StyleProvider>
    )

    userEvent.click(getByTestId('will-not-check'))
    expect(onFocus).not.toHaveBeenCalled()
  })

  describe('with theme customization', () => {
    test('should have 2px border', () => {
      const theme = generateTheme({ primaryHue: 200, border: 'thick' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <CheckBox id="theme" />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test('should not have box shadow on focus', () => {
      const theme = generateTheme({ primaryHue: 200, boxShadows: false })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <CheckBox id="theme" />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
