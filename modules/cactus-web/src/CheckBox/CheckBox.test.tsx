import { generateTheme } from '@repay/cactus-theme'
import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import CheckBox from './CheckBox'

describe('component: CheckBox', (): void => {
  test('should render a checkbox', (): void => {
    const checkBox = render(
      <StyleProvider>
        <CheckBox id="check" />
      </StyleProvider>
    )

    expect(checkBox.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled checkbox', (): void => {
    const checkBox = render(
      <StyleProvider>
        <CheckBox id="checking" disabled />
      </StyleProvider>
    )

    expect(checkBox.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', (): void => {
    const checkBox = render(
      <StyleProvider>
        <CheckBox id="MARGIN PROPS YEAH" m={4} />
      </StyleProvider>
    )

    expect(checkBox.asFragment()).toMatchSnapshot()
  })

  test('should trigger onChange event', (): void => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <CheckBox id="checked" onChange={onChange} data-testid="will-check" />
      </StyleProvider>
    )

    fireEvent.click(getByTestId('will-check'))
    expect(onChange).toHaveBeenCalled()
  })

  test('should trigger onFocus event', (): void => {
    const onFocus = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <CheckBox id="checked" onFocus={onFocus} data-testid="will-check" />
      </StyleProvider>
    )

    fireEvent.focus(getByTestId('will-check'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onBlur event', (): void => {
    const onBlur = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <CheckBox id="checked" onBlur={onBlur} data-testid="will-check" />
      </StyleProvider>
    )

    fireEvent.blur(getByTestId('will-check'))
    expect(onBlur).toHaveBeenCalled()
  })

  test('should not trigger onChange event', (): void => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <CheckBox id="checked" onChange={onChange} data-testid="will-not-check" disabled />
      </StyleProvider>
    )

    userEvent.click(getByTestId('will-not-check'))
    expect(onChange).not.toHaveBeenCalled()
  })

  test('should not trigger onFocus event', (): void => {
    const onFocus = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <CheckBox id="checked" onFocus={onFocus} data-testid="will-not-check" disabled />
      </StyleProvider>
    )

    userEvent.click(getByTestId('will-not-check'))
    expect(onFocus).not.toHaveBeenCalled()
  })

  describe('with theme customization', (): void => {
    test('should have 2px border', (): void => {
      const theme = generateTheme({ primaryHue: 200, border: 'thick' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <CheckBox id="theme" />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test('should not have box shadow on focus', (): void => {
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
