import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import animationRender from '../../tests/helpers/animationRender'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import ColorPicker from './ColorPicker'

describe('component: ColorPicker', () => {
  describe('can be controlled', () => {
    test('with hsl', () => {
      const { getByLabelText } = render(
        <StyleProvider>
          <ColorPicker
            id="color-picker"
            name="color-test"
            format="hsl"
            value={{ h: 120, s: 1, l: 0.5 }}
          />
        </StyleProvider>
      )

      expect((getByLabelText('Color') as HTMLInputElement).value).toBe('#00FF00')
    })

    test('with hsv', () => {
      const { getByLabelText } = render(
        <StyleProvider>
          <ColorPicker
            id="color-picker"
            name="what-color"
            format="hsv"
            value={{ h: 120, s: 1, v: 1 }}
          />
        </StyleProvider>
      )

      expect((getByLabelText('Color') as HTMLInputElement).value).toBe('#00FF00')
    })

    test('with rgb', () => {
      const { getByLabelText } = render(
        <StyleProvider>
          <ColorPicker
            id="color-picker"
            name="color-me"
            format="rgb"
            value={{ r: 0, g: 255, b: 0 }}
          />
        </StyleProvider>
      )

      expect((getByLabelText('Color') as HTMLInputElement).value).toBe('#00FF00')
    })

    test('with hex', () => {
      const { getByLabelText } = render(
        <StyleProvider>
          <ColorPicker id="color-picker" name="almost-there" value="00FF00" />
        </StyleProvider>
      )

      expect((getByLabelText('Color') as HTMLInputElement).value).toBe('#00FF00')
    })

    test('empty string resets value', () => {
      const { getByLabelText, rerender } = render(
        <StyleProvider>
          <ColorPicker id="color-picker" name="almost-there" value="00FF00" />
        </StyleProvider>
      )
      rerender(
        <StyleProvider>
          <ColorPicker id="color-picker" name="almost-there" value="" />
        </StyleProvider>
      )

      expect((getByLabelText('Color') as HTMLInputElement).value).toBe('#000000')
    })
  })

  test('can open portal', async () => {
    const { getByLabelText, queryByRole } = render(
      <StyleProvider>
        <ColorPicker id="color-picker" name="pick-a-color" />
      </StyleProvider>
    )

    const trigger = getByLabelText('Click to open the color picker')
    expect(queryByRole('dialog')).toBe(null)
    userEvent.click(trigger)
    expect(queryByRole('dialog')).toBeInTheDocument()
    // Should focus the hex input when initially opened
    await animationRender()
    expect(document.activeElement).toBe(getByLabelText('Hex'))
  })

  describe('calls onChange', () => {
    test('when apply button is clicked', () => {
      const onChange = jest.fn()
      const { getByLabelText, getByText } = render(
        <StyleProvider>
          <ColorPicker id="color-picker" name="rainbow" onChange={onChange} />
        </StyleProvider>
      )

      const trigger = getByLabelText('Click to open the color picker')
      userEvent.click(trigger)

      const redInput = getByLabelText('R') as HTMLInputElement
      const greenInput = getByLabelText('G') as HTMLInputElement
      const blueInput = getByLabelText('B') as HTMLInputElement

      userEvent.clear(redInput)
      userEvent.type(redInput, '0')
      fireEvent.blur(redInput)

      userEvent.clear(greenInput)
      userEvent.type(greenInput, '0')
      fireEvent.blur(greenInput)

      userEvent.clear(blueInput)
      userEvent.type(blueInput, '255')
      fireEvent.blur(blueInput)

      expect(onChange).not.toHaveBeenCalled()

      const applyButton = getByText('Apply')

      userEvent.click(applyButton)

      expect(onChange).toHaveBeenCalledTimes(1)
    })

    test('when outer hex input is changed', () => {
      const onChange = jest.fn()
      const { getByLabelText } = render(
        <StyleProvider>
          <ColorPicker id="color-picker" name="rainbow" onChange={onChange} />
        </StyleProvider>
      )

      const outerHexInput = getByLabelText('Color')
      userEvent.clear(outerHexInput)
      userEvent.type(outerHexInput, 'FF0000')

      expect(onChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('does not call onChange', () => {
    test('when cancel button is clicked', () => {
      const onChange = jest.fn()
      const { getByLabelText, getByText } = render(
        <StyleProvider>
          <ColorPicker id="color-picker" name="rainbow" onChange={onChange} />
        </StyleProvider>
      )

      const trigger = getByLabelText('Click to open the color picker')
      userEvent.click(trigger)

      const redInput = getByLabelText('R') as HTMLInputElement
      const greenInput = getByLabelText('G') as HTMLInputElement
      const blueInput = getByLabelText('B') as HTMLInputElement

      userEvent.clear(redInput)
      userEvent.type(redInput, '0')
      fireEvent.blur(redInput)

      userEvent.clear(greenInput)
      userEvent.type(greenInput, '0')
      fireEvent.blur(greenInput)

      userEvent.clear(blueInput)
      userEvent.type(blueInput, '255')
      fireEvent.blur(blueInput)

      const cancelButton = getByText('Cancel')

      userEvent.click(cancelButton)

      expect(onChange).not.toHaveBeenCalled()
      const outerHexInput = getByLabelText('Color') as HTMLInputElement
      expect(outerHexInput.value).toBe('#000000')
      expect(onChange).toHaveBeenCalledTimes(0)
    })
  })

  describe('calls onFocus', () => {
    test('when outer hex input is focused', () => {
      const onFocus = jest.fn()
      const { getByLabelText } = render(
        <StyleProvider>
          <ColorPicker id="color-picker" name="rainbow" onFocus={onFocus} />
        </StyleProvider>
      )

      const outerHexInput = getByLabelText('Color')
      fireEvent.focus(outerHexInput)
      expect(onFocus).toHaveBeenCalledTimes(1)
    })

    test('when icon button is clicked', () => {
      const onFocus = jest.fn()
      const onBlur = jest.fn()
      const { getByLabelText } = render(
        <StyleProvider>
          <ColorPicker id="color-picker" name="rainbow" onFocus={onFocus} onBlur={onBlur} />
        </StyleProvider>
      )

      const trigger = getByLabelText('Click to open the color picker')
      userEvent.click(trigger)
      expect(onFocus).toHaveBeenCalledTimes(1)
      expect(onBlur).toHaveBeenCalledTimes(0)
    })
  })

  describe('calls onBlur', () => {
    test('when the outer hex input is blurred', async () => {
      const onBlur = jest.fn()
      const { getByLabelText } = render(
        <StyleProvider>
          <ColorPicker id="color-picker" name="rainbow" onBlur={onBlur} />
        </StyleProvider>
      )

      const outerHexInput = getByLabelText('Color')
      fireEvent.focus(outerHexInput)
      fireEvent.blur(outerHexInput)
      await animationRender()
      expect(onBlur).toHaveBeenCalledTimes(1)
    })

    test('when another element is focused', async () => {
      const onBlur = jest.fn()
      const { getByLabelText, getByRole } = render(
        <StyleProvider>
          <ColorPicker id="color-picker" name="rainbow" onBlur={onBlur} />
          <input type="text" aria-label="sup" />
        </StyleProvider>
      )

      const trigger = getByLabelText('Click to open the color picker')
      userEvent.click(trigger)

      const dialog = getByRole('dialog')

      userEvent.click(getByLabelText('sup'))
      await animationRender()
      expect(onBlur).toHaveBeenCalledTimes(1)
      // Also closes the dialog if it's open.
      expect(dialog).not.toBeInTheDocument()
    })
  })

  describe('can set color', () => {
    test('using the outer hex input', () => {
      let value = null
      const onChange = (e: any) => {
        value = e.target.value
      }
      const { getByLabelText } = render(
        <StyleProvider>
          <ColorPicker id="color-picker" name="does-anyone-read-this" onChange={onChange} />
        </StyleProvider>
      )

      const outerHexInput = getByLabelText('Color') as HTMLInputElement
      userEvent.clear(outerHexInput)
      userEvent.type(outerHexInput, 'FF0000')
      fireEvent.blur(outerHexInput)
      expect(value).toBe('#FF0000')

      const trigger = getByLabelText('Click to open the color picker')
      userEvent.click(trigger)
      const innerHexInput = getByLabelText('Hex') as HTMLInputElement
      expect(innerHexInput.value).toBe('#FF0000')
      expect((getByLabelText('R') as HTMLInputElement).value).toBe('255')
      expect((getByLabelText('G') as HTMLInputElement).value).toBe('0')
      expect((getByLabelText('B') as HTMLInputElement).value).toBe('0')
    })

    test('using the inner hex input', () => {
      const { getByLabelText } = render(
        <StyleProvider>
          <ColorPicker id="color-picker" name="cool-color" />
        </StyleProvider>
      )

      const trigger = getByLabelText('Click to open the color picker')
      userEvent.click(trigger)

      const outerHexInput = getByLabelText('Color') as HTMLInputElement
      const innerHexInput = getByLabelText('Hex') as HTMLInputElement
      userEvent.clear(innerHexInput)
      userEvent.type(innerHexInput, 'FF0000')
      fireEvent.blur(innerHexInput)
      expect(outerHexInput.value).toBe('#000000')
      expect((getByLabelText('R') as HTMLInputElement).value).toBe('255')
      expect((getByLabelText('G') as HTMLInputElement).value).toBe('0')
      expect((getByLabelText('B') as HTMLInputElement).value).toBe('0')
    })

    test('using the rgb inputs', () => {
      const { getByLabelText } = render(
        <StyleProvider>
          <ColorPicker id="color-picker" name="coooooolor" />
        </StyleProvider>
      )

      const trigger = getByLabelText('Click to open the color picker')
      userEvent.click(trigger)

      const outerHexInput = getByLabelText('Color') as HTMLInputElement
      const innerHexInput = getByLabelText('Hex') as HTMLInputElement
      const redInput = getByLabelText('R') as HTMLInputElement
      const greenInput = getByLabelText('G') as HTMLInputElement
      const blueInput = getByLabelText('B') as HTMLInputElement

      userEvent.clear(redInput)
      userEvent.type(redInput, '0')
      fireEvent.blur(redInput)

      userEvent.clear(greenInput)
      userEvent.type(greenInput, '0')
      fireEvent.blur(greenInput)

      userEvent.clear(blueInput)
      userEvent.type(blueInput, '255')
      fireEvent.blur(blueInput)

      expect(outerHexInput.value).toBe('#000000')
      expect(innerHexInput.value).toBe('#0000FF')
      expect(redInput.value).toBe('0')
      expect(greenInput.value).toBe('0')
      expect(blueInput.value).toBe('255')
    })
  })
})
