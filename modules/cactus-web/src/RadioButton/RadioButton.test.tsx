import { generateTheme } from '@repay/cactus-theme'
import { fireEvent, render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import RadioButton from './RadioButton'

describe('component: RadioButton', (): void => {
  test('should render a radio button', (): void => {
    const radioButton = render(
      <StyleProvider>
        <RadioButton name="test" id="radio" />
      </StyleProvider>
    )

    expect(radioButton.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled radio button', (): void => {
    const radioButton = render(
      <StyleProvider>
        <RadioButton name="test" id="radio" disabled />
      </StyleProvider>
    )

    expect(radioButton.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', (): void => {
    const radioButton = render(
      <StyleProvider>
        <RadioButton name="test" id="SPACE PROPS YEAH" margin={4} />
      </StyleProvider>
    )

    expect(radioButton.asFragment()).toMatchSnapshot()
  })

  test('should trigger onChange event', (): void => {
    const onChange = jest.fn()
    const { getByLabelText } = render(
      <StyleProvider>
        <RadioButton name="test" id="radio" onChange={onChange} aria-label="will-change" />
      </StyleProvider>
    )

    fireEvent.click(getByLabelText('will-change'))
    expect(onChange).toHaveBeenCalled()
  })

  test('should trigger onFocus event', (): void => {
    const onFocus = jest.fn()
    const { getByLabelText } = render(
      <StyleProvider>
        <RadioButton name="test" id="radio" onFocus={onFocus} aria-label="will-focus" />
      </StyleProvider>
    )

    fireEvent.focus(getByLabelText('will-focus'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onFocus event', (): void => {
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

  describe('with theme customization', (): void => {
    test('should not have box shadows on focus', (): void => {
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
