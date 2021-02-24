import { CactusTheme, Shape } from '@repay/cactus-theme'
import { DescriptivePalette } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { ColorChangeHandler, CustomPicker, HSLColor, HSVColor } from 'react-color'
import { EditableInput, Hue, Saturation } from 'react-color/lib/components/common'
import styled, { css, withTheme } from 'styled-components'
import { margin, MarginProps } from 'styled-system'
import tinycolor from 'tinycolor2'

import Button from '../Button/Button'
import Flex from '../Flex/Flex'
import FocusLock from '../FocusLock/FocusLock'
import { keyDownAsClick } from '../helpers/a11y'
import { CactusChangeEvent, CactusEventTarget, CactusFocusEvent } from '../helpers/events'
import { usePositioning } from '../helpers/positionPopover'
import positionPortal from '../helpers/positionPortal'
import { useBox } from '../helpers/react'
import { border, borderSize, boxShadow, radius } from '../helpers/theme'
import usePopup from '../helpers/usePopup'
import IconButton from '../IconButton/IconButton'
import TextButton from '../TextButton/TextButton'

interface ColorPickerProps
  extends MarginProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onError' | 'onFocus' | 'onBlur'> {
  name: string
  id: string
  theme: CactusTheme
  value?: string | HSL | HSV | RGB
  phrases?: Phrases
  onChange?: React.ChangeEventHandler<CactusEventTarget<Color>>
  onFocus?: React.FocusEventHandler<CactusEventTarget<Color>>
  onBlur?: React.FocusEventHandler<CactusEventTarget<Color>>
  disabled?: boolean
}

interface CustomPickerProps {
  saveColor: (color: tinycolor.Instance) => void
  theme: CactusTheme
  currentColor: Color
  phrases: Phrases
}

interface HSL {
  h: number
  s: number
  l: number
}

interface HSV {
  h: number
  s: number
  v: number
}

interface RGB {
  r: number
  g: number
  b: number
}

interface Color {
  hsl: HSL
  hsv: HSV
  rgb: RGB
  hex: string
}

interface PointerProps {
  hsl?: HSL
}

interface Phrases {
  hexLabel: string
  redLabel: string
  greenLabel: string
  blueLabel: string
  triggerLabel: string
  applyLabel: string
  cancelLabel: string
}

interface PopupProps extends React.HTMLAttributes<HTMLDivElement> {
  anchorRef: React.RefObject<HTMLDivElement>
  popupRef: React.RefObject<HTMLDivElement>
  isOpen: boolean
}

const BasePopup: React.FC<PopupProps> = ({ anchorRef, popupRef, isOpen, ...props }) => {
  usePositioning({
    anchorRef,
    ref: popupRef,
    visible: isOpen,
    position: positionPortal,
    updateOnScroll: true,
  })
  return <FocusLock ref={popupRef} {...props} />
}

const popupShapeMap: { [K in Shape]: ReturnType<typeof css> } = {
  square: css`
    border-radius: 0 2px 1px 1px;
  `,
  intermediate: css`
    border-radius: 0 20px 10px 10px;
  `,
  round: css`
    border-radius: 0 32px 16px 16px;
  `,
}

const getPopupShape = (shape: Shape): ReturnType<typeof css> => popupShapeMap[shape]
const getPopupBoxShadowStyles = (theme: CactusTheme): ReturnType<typeof css> => {
  return theme.boxShadows
    ? css`
        ${(p): string => boxShadow(p.theme, 1)};
      `
    : css`
        border: ${(p) => borderSize(p)} solid;
        border-color: ${theme.colors.lightContrast};
      `
}

const ColorPickerPopup = styled(BasePopup)`
  display: ${(p) => (p.isOpen ? 'block' : 'none')};
  box-sizing: border-box;
  position: fixed;
  z-index: 1000;
  width: 320px;
  padding: 16px;
  background-color: ${(p): string => p.theme.colors.white};
  ${(p): ReturnType<typeof css> => getPopupShape(p.theme.shape)}
  ${(p): ReturnType<typeof css> => getPopupBoxShadowStyles(p.theme)}
  overflow: hidden;
  outline: none;

  input {
    border: ${(p) => border(p.theme, 'darkestContrast')};
    border-radius: ${radius(20)};
    height: 32px;
    outline: none;
    padding: 0px 15px 0px 15px;
    &:focus {
      border: ${(p) => border(p.theme, 'callToAction')};
    }
  }

  label {
    position: absolute;
    top: -26px;
    left: 16px;
  }

  .hex-wrapper > div > input {
    width: 5em;
  }

  .rgb-wrapper > div > input {
    width: 2.5em;
  }
`

const InputWrapper = styled.div<{ $disabled: boolean }>`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: ${(p) => border(p.theme, 'darkestContrast')};
  border-radius: ${radius(20)};
  height: 36px;
  outline: none;
  padding: 0 16px 0 12px;
  min-width: 160px;
  ${margin}

  &:focus-within {
    border-color: ${(p): string => p.theme.colors.callToAction};
  }

  input {
    border: none;
    outline: none;
    padding: 0;
    background-color: transparent;
    font-size: inherit;
    width: 5em;
    ${(p) =>
      p.$disabled &&
      `
        color: ${p.theme.colorStyles.disable.color};
        cursor: not-allowed;
      `}
  }

  ${(p) =>
    p.$disabled &&
    `
      cursor: not-allowed;
      border-color: ${p.theme.colors.lightGray};
      background-color: ${p.theme.colorStyles.disable.backgroundColor};
    `}
`

const SaturationWrapper = styled.div`
  position: relative;
  width: 288px;
  height: 200px;
`

const HueWrapper = styled.div`
  position: relative;
  width: 288px;
  height: 16px;
  margin-top: 32px;
`

const Pointer = styled.div<{ $type: 'hue' | 'saturation'; $hsl: HSLColor }>`
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: transparent;
  border: 8px solid ${(p) => p.theme.colors.white};
  box-shadow: 0 0 3px ${(p) => p.theme.colors.mediumGray};
  ${(p) => {
    // Adjust pointer translation based on where the pointer is at so it
    // doesn't leave the hue/saturation element visually
    if (p.$type === 'hue') {
      const xOffset = p.$hsl.h > 160 ? '-24px' : '-8px'
      return `transform: translate(${xOffset}, -8px);`
    } else {
      const xOffset = p.$hsl.s > 0.3 ? '-24px' : '-8px'
      const yOffset = p.$hsl.l > 0.25 ? '-8px' : '-24px'
      return `transform: translate(${xOffset}, ${yOffset});`
    }
  }}
`

const HuePointer: React.FC<PointerProps> = (props) => {
  const { hsl = { h: 0, s: 0, l: 0 } } = props
  return <Pointer $hsl={hsl} $type="hue" />
}

const SaturationPointer: React.FC<PointerProps> = (props) => {
  const { hsl = { h: 0, s: 0, l: 0 } } = props
  return <Pointer $hsl={hsl} $type="saturation" />
}

const PickerBase: React.FC<CustomPickerProps> = (props) => {
  const { saveColor, theme, currentColor, phrases, ...rest } = props

  const handleSaturationChange: ColorChangeHandler<HSVColor> = (hsv) => {
    const color = tinycolor(hsv)
    saveColor(color)
  }

  const handleHueChange: ColorChangeHandler<HSLColor> = (hsl) => {
    const color = tinycolor((hsl as any) as HSL)
    saveColor(color)
  }

  const handleInnerHexChange = (change: { [k: string]: string }) => {
    const hex = change[phrases.hexLabel]
    if (isValidHex(hex)) {
      const color = tinycolor(hex)
      saveColor(color)
    }
  }

  const handleRGBChange = (change: number, key: 'r' | 'g' | 'b') => {
    const color = tinycolor({ ...currentColor.rgb, [key]: change })
    saveColor(color)
  }

  return (
    <Flex width="100%" flexDirection="column" alignItems="center" justifyContent="center">
      <SaturationWrapper>
        <Saturation
          {...rest}
          radius={radius(20)({ theme })}
          hsl={currentColor.hsl}
          hsv={currentColor.hsv}
          pointer={SaturationPointer}
          onChange={handleSaturationChange}
        />
      </SaturationWrapper>
      <HueWrapper>
        <Hue
          {...rest}
          radius={radius(20)({ theme })}
          hsl={currentColor.hsl}
          pointer={HuePointer}
          onChange={handleHueChange}
        />
      </HueWrapper>
      <Flex
        className="hex-wrapper"
        flexDirection="column"
        alignItems="flex-start"
        width="100%"
        mt={7}
      >
        <EditableInput
          label={phrases.hexLabel}
          value={`#${currentColor.hex}`}
          onChange={handleInnerHexChange}
        />
        <Flex className="rgb-wrapper" width="100%" justifyContent="space-between" mt={7}>
          <EditableInput
            value={currentColor.rgb.r}
            label={phrases.redLabel}
            onChange={({ R }) => handleRGBChange(Number(R), 'r')}
          />
          <EditableInput
            value={currentColor.rgb.g}
            label={phrases.greenLabel}
            onChange={({ G }) => handleRGBChange(Number(G), 'g')}
          />
          <EditableInput
            value={currentColor.rgb.b}
            label={phrases.blueLabel}
            onChange={({ B }) => handleRGBChange(Number(B), 'b')}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

const Picker = CustomPicker(PickerBase)

const isValidHex = (hex: string): boolean => /^#?[0-9A-F]{6}$/i.test(hex)

const initialState: Color = {
  hsl: { h: 0, s: 1, l: 0.5 },
  hsv: { h: 0, s: 1, v: 1 },
  rgb: { r: 255, g: 0, b: 0 },
  hex: 'FF0000',
}

export const ColorPickerBase: React.FC<ColorPickerProps> = (props) => {
  const {
    id,
    name,
    disabled = false,
    phrases: passedPhrases,
    theme,
    value,
    onChange,
    onFocus,
    onBlur,
    ...rest
  } = props

  const [state, setState] = useState<Color>(initialState)
  const openedState = useRef<Color>(initialState)
  const buttonClicked = useRef<boolean>(false)

  const eventTarget = useBox(
    new CactusEventTarget<Color>({ id, name, value: state })
  )

  const inputRef = useRef<HTMLDivElement | null>(null)
  const portalRef = useRef<HTMLDivElement | null>(null)

  const phrases: Phrases = { ...defaultPhrases, ...passedPhrases }

  const { expanded, toggle, buttonProps, popupProps } = usePopup('dialog', {
    id,
  })

  useEffect(() => {
    if (value) {
      const passedColor = tinycolor(value)
      saveColor(passedColor)
    }
  }, [value, expanded])

  const handleIconButtonClick = () => {
    if (!expanded) {
      // Save state popup was opened with in case we need to reset on cancel
      openedState.current = state
      const hexInput = document.querySelector(`#${popupProps.id} input`) as HTMLInputElement
      toggle(true, hexInput)
      buttonClicked.current = true
    }
  }

  const saveColor = (color: tinycolor.Instance): void => {
    setState({
      hsl: color.toHsl(),
      hsv: color.toHsv(),
      rgb: color.toRgb(),
      hex: color.toHex().toUpperCase(),
    })
  }

  const handleOuterHexChange = (
    change: { [k: string]: string },
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const hex = change[phrases.hexLabel]
    if (isValidHex(hex)) {
      const color = tinycolor(hex)
      saveColor(color)
      if (onChange && typeof onChange === 'function') {
        eventTarget.value = {
          hsl: color.toHsl(),
          hsv: color.toHsv(),
          rgb: color.toRgb(),
          hex: color.toHex().toUpperCase(),
        }
        const cactusEvent = new CactusChangeEvent(eventTarget, event)
        onChange(cactusEvent)
      }
    }
  }

  const handleCancelClick = (event: React.MouseEvent) => {
    if (onBlur && typeof onBlur === 'function') {
      const cactusEvent = new CactusFocusEvent('blur', eventTarget, event)
      onBlur(cactusEvent)
    }
    setState(openedState.current)
    toggle(false)
  }

  const handleApplyClick = (event: React.MouseEvent) => {
    if (onChange && typeof onChange === 'function') {
      const cactusEvent = new CactusChangeEvent(eventTarget, event)
      onChange(cactusEvent)
    }
    if (onBlur && typeof onBlur === 'function') {
      const cactusEvent = new CactusFocusEvent('blur', eventTarget, event)
      onBlur(cactusEvent)
    }
    toggle(false)
  }

  const isOutside = (element: EventTarget | null) => {
    const input = inputRef.current
    const portal = portalRef.current
    return (
      !(element instanceof Node) ||
      !input ||
      !input.contains(element) ||
      (expanded && (!portal || !portal.contains(element)))
    )
  }

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    const { relatedTarget } = event
    if (isOutside(relatedTarget)) {
      if (onFocus && typeof onFocus === 'function') {
        const cactusEvent = new CactusFocusEvent('focus', eventTarget, event)
        onFocus(cactusEvent)
      }
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    event.persist()
    window.requestAnimationFrame((): void => {
      if (isOutside(document.activeElement) && !buttonClicked.current) {
        if (onBlur && typeof onBlur === 'function') {
          const cactusEvent = new CactusFocusEvent('blur', eventTarget, event)
          onBlur(cactusEvent)
        }
      }
      if (buttonClicked.current) {
        buttonClicked.current = false
      }
    })
  }

  return (
    <>
      <InputWrapper
        id={id}
        ref={inputRef}
        $disabled={disabled || false}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      >
        <IconButton
          disabled={disabled}
          iconSize="small"
          label={phrases.triggerLabel}
          {...buttonProps}
          onClick={handleIconButtonClick}
          onKeyDown={keyDownAsClick}
        >
          <DescriptivePalette />
        </IconButton>
        {!disabled ? (
          <EditableInput
            label={phrases.hexLabel || 'Hex'}
            value={`#${state.hex}`}
            style={{ label: { visibility: 'hidden', width: 0, height: 0, position: 'absolute' } }}
            onChange={handleOuterHexChange as (change: { [k: string]: string }) => void} // Type definitions are a little off. TS thinks no event is passed to the handler but it is.
          />
        ) : (
          <input value={`#${state.hex}`} disabled />
        )}
      </InputWrapper>
      <ColorPickerPopup anchorRef={inputRef} popupRef={portalRef} isOpen={expanded} {...popupProps}>
        <Picker theme={theme} saveColor={saveColor} currentColor={state} phrases={phrases} />
        <Flex justifyContent="space-around" width="100%" mt={4}>
          <TextButton variant="danger" onClick={handleCancelClick}>
            {phrases.cancelLabel}
          </TextButton>
          <Button variant="action" onClick={handleApplyClick}>
            {phrases.applyLabel}
          </Button>
        </Flex>
      </ColorPickerPopup>
    </>
  )
}

const defaultPhrases: Phrases = {
  hexLabel: 'Hex',
  redLabel: 'R',
  greenLabel: 'G',
  blueLabel: 'B',
  triggerLabel: 'Click to open the color picker',
  applyLabel: 'Apply',
  cancelLabel: 'Cancel',
}

export const ColorPicker = withTheme(ColorPickerBase)
ColorPicker.displayName = 'ColorPicker'

ColorPicker.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      h: PropTypes.number.isRequired,
      s: PropTypes.number.isRequired,
      l: PropTypes.number.isRequired,
    }),
    PropTypes.shape({
      h: PropTypes.number.isRequired,
      s: PropTypes.number.isRequired,
      v: PropTypes.number.isRequired,
    }),
    PropTypes.shape({
      r: PropTypes.number.isRequired,
      g: PropTypes.number.isRequired,
      b: PropTypes.number.isRequired,
    }),
  ]),
  // @ts-ignore
  phrases: PropTypes.shape({
    hexLabel: PropTypes.string,
    redLabel: PropTypes.string,
    greenLabel: PropTypes.string,
    blueLabel: PropTypes.string,
    triggerLabel: PropTypes.string,
    applyLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
  }),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
}

export default ColorPicker
