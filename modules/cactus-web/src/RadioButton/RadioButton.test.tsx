import { fireEvent } from '@testing-library/react'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import RadioButton from './RadioButton'

describe('component: RadioButton', () => {
  test('should support margin space props', () => {
    const { container } = renderWithTheme(
      <RadioButton name="test" id="SPACE PROPS YEAH" margin={4} />
    )
    const radioBtn = container.querySelector('[id="SPACE PROPS YEAH"]')?.parentElement
    const styles = window.getComputedStyle(radioBtn as Element)
    expect(styles.margin).toBe('16px')
  })

  test('should support ref prop', () => {
    const ref = React.createRef<HTMLInputElement>()
    const { getByTestId } = renderWithTheme(
      <RadioButton data-testid="inreffable" name="ref" defaultChecked ref={ref} />
    )
    expect(getByTestId('inreffable')).toBe(ref.current)
    expect(ref.current).toBeChecked()
  })

  test('should trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByLabelText } = renderWithTheme(
      <RadioButton name="test" id="radio" onChange={onChange} aria-label="will-change" />
    )

    fireEvent.click(getByLabelText('will-change'))
    expect(onChange).toHaveBeenCalled()
  })

  test('should trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByLabelText } = renderWithTheme(
      <RadioButton name="test" id="radio" onFocus={onFocus} aria-label="will-focus" />
    )

    fireEvent.focus(getByLabelText('will-focus'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onFocus event', () => {
    const onBlur = jest.fn()
    const { getByLabelText } = renderWithTheme(
      <RadioButton name="test" id="radio" onBlur={onBlur} aria-label="will-blur" />
    )

    fireEvent.blur(getByLabelText('will-blur'))
    expect(onBlur).toHaveBeenCalled()
  })

  /* TODO: fireEvent.click and userEvent.click on a disabled radio button fall victim to the same problem that affects
  the checkboxes; it's a bug in @testing-library/react and/or user-event. If/when that issue is fixed, we should add
  tests to ensure that no events are triggered when the radio button is disabled. */

  describe('with theme customization', () => {
    test('should not have box shadows on focus', () => {
      const { container } = renderWithTheme(<RadioButton name="customize" id="themability" />, {
        boxShadows: false,
      })

      const radioBtn = container.querySelector('[id="themability"]')?.parentElement
      const styles = window.getComputedStyle(radioBtn as Element)
      expect(styles.boxShadow).toBe('')
    })
  })
})
