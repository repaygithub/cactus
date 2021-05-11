import { generateTheme } from '@repay/cactus-theme'
import { fireEvent, render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import RadioButton from './RadioButton'

describe('component: RadioButton', (): void => {
  test('should support margin space props', (): void => {
    const { container } = render(
      <StyleProvider>
        <RadioButton name="test" id="SPACE PROPS YEAH" margin={4} />
      </StyleProvider>
    )
    const radioBtn = container.querySelector('[id="SPACE PROPS YEAH"]')?.parentElement
    const styles = window.getComputedStyle(radioBtn as Element)
    expect(styles.margin).toBe('16px')
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
      const { container } = render(
        <StyleProvider theme={theme}>
          <RadioButton name="customize" id="themability" />
        </StyleProvider>
      )

      const radioBtn = container.querySelector('[id="themability"]')?.parentElement
      const styles = window.getComputedStyle(radioBtn as Element)
      expect(styles.boxShadow).toBe('')
    })
  })
})
