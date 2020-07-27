import { generateTheme } from '@repay/cactus-theme'
import { cleanup, fireEvent, render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import RadioButton from './RadioButton'

afterEach(cleanup)

describe('component: RadioButton', () => {
  test('should render a radio button', () => {
    const radioButton = render(
      <StyleProvider>
        <RadioButton name="test" id="radio" />
      </StyleProvider>
    )

    expect(radioButton.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled radio button', () => {
    const radioButton = render(
      <StyleProvider>
        <RadioButton name="test" id="radio" disabled />
      </StyleProvider>
    )

    expect(radioButton.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', () => {
    const radioButton = render(
      <StyleProvider>
        <RadioButton name="test" id="SPACE PROPS YEAH" margin={4} />
      </StyleProvider>
    )

    expect(radioButton.asFragment()).toMatchSnapshot()
  })

  test('should trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByLabelText } = render(
      <StyleProvider>
        <RadioButton name="test" id="radio" onChange={onChange} aria-label="will-change" />
      </StyleProvider>
    )

    fireEvent.click(getByLabelText('will-change'))
    expect(onChange).toHaveBeenCalled()
  })

  test('should trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByLabelText } = render(
      <StyleProvider>
        <RadioButton name="test" id="radio" onFocus={onFocus} aria-label="will-focus" />
      </StyleProvider>
    )

    fireEvent.focus(getByLabelText('will-focus'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onFocus event', () => {
    const onBlur = jest.fn()
    const { getByLabelText } = render(
      <StyleProvider>
        <RadioButton name="test" id="radio" onBlur={onBlur} aria-label="will-blur" />
      </StyleProvider>
    )

    fireEvent.blur(getByLabelText('will-blur'))
    expect(onBlur).toHaveBeenCalled()
  })

  /* TODO: fireEvent.click and userEvent.click on a disabled radio button fall victim to the same problem that affects
  the checkboxes; it's a bug in @testing-library/react and/or user-event. If/when that issue is fixed, we should add
  tests to ensure that no events are triggered when the radio button is disabled. */

  describe('with theme customization', () => {
    test('should not have box shadows on focus', () => {
      const theme = generateTheme({ primaryHue: 200, boxShadows: false })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <RadioButton name="customize" id="themability" />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
