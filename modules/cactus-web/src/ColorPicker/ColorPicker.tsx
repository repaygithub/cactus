import { CactusTheme, Shape } from '@repay/cactus-theme'
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
  height: 478px;
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

// TODO: Move this to the icon library
const DescriptivePalette = (): React.ReactElement => {
  return (
    <svg
      fill="currentcolor"
      width="16"
      height="14"
      viewBox="0 0 26 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.0993 5.94055C16.1785 2.01982 9.8215 2.01982 5.90076 5.94055C1.98002 9.86129 1.98002 16.2183 5.90076 20.1391C6.25918 20.4975 6.84546 20.4975 7.20389 20.1391C7.56231 19.7806 7.56231 19.1944 7.20389 18.8359C6.43889 18.0709 6.43889 16.8328 7.20389 16.0679C7.96889 15.3029 9.20697 15.3029 9.97197 16.0679L14.0432 20.1391C15.7171 21.813 18.4254 21.813 20.0993 20.1391C24.02 16.2183 24.02 9.86129 20.0993 5.94055ZM4.48655 4.52634C9.18833 -0.175447 16.8117 -0.175447 21.5135 4.52634C26.2153 9.22813 26.2153 16.8515 21.5135 21.5533C19.0585 24.0082 15.0839 24.0082 12.629 21.5533L9.05463 17.9789C9.73184 19.1019 9.58633 20.585 8.6181 21.5533C7.47863 22.6927 5.62602 22.6927 4.48655 21.5533C-0.215242 16.8515 -0.215242 9.22813 4.48655 4.52634ZM17.376 7.97009C17.2143 7.80557 16.94 7.7968 16.7606 7.97616L16.7546 7.9822L16.7546 7.98218C16.5867 8.14723 16.5867 8.42648 16.7546 8.59154L16.7667 8.60362C16.9317 8.77152 17.211 8.77152 17.376 8.60362L17.3881 8.59154C17.556 8.42648 17.556 8.14723 17.3881 7.98218L17.376 7.97009ZM18.7963 6.56194C17.8447 5.60057 16.3014 5.61026 15.3494 6.55894C14.3894 7.506 14.3884 9.06343 15.3464 10.0118C16.2938 10.9688 17.8489 10.9688 18.7963 10.0118C19.7533 9.06443 19.7533 7.5093 18.7963 6.56194ZM19.7612 13.0398C19.7612 13.0618 19.7434 13.0796 19.7214 13.0796C19.6994 13.0796 19.6816 13.0618 19.6816 13.0398C19.6816 13.0178 19.6994 13 19.7214 13C19.7434 13 19.7612 13.0178 19.7612 13.0398ZM19.7214 11.0796C18.6388 11.0796 17.7612 11.9572 17.7612 13.0398C17.7612 14.1224 18.6388 15 19.7214 15C20.804 15 21.6816 14.1224 21.6816 13.0398C21.6816 11.9572 20.804 11.0796 19.7214 11.0796ZM17.7276 17.1364C17.3692 16.778 16.7829 16.778 16.4245 17.1364C16.0661 17.4948 16.0661 18.0811 16.4245 18.4395C16.7829 18.798 17.3692 18.798 17.7276 18.4395C18.0861 18.0811 18.0861 17.4948 17.7276 17.1364ZM15.0103 15.7222C16.1498 14.5827 18.0024 14.5827 19.1419 15.7222C20.2813 16.8617 20.2813 18.7143 19.1419 19.8537C18.0024 20.9932 16.1498 20.9932 15.0103 19.8537C13.8708 18.7143 13.8708 16.8617 15.0103 15.7222ZM10.9899 6.95836C11.1692 6.779 11.4435 6.78777 11.6052 6.95229L11.6052 6.95231L11.6113 6.95836C11.7906 7.13772 11.7819 7.412 11.6173 7.57374L11.6173 7.57371L11.6113 7.57975C11.4319 7.75911 11.1576 7.75035 10.9959 7.58582L10.9838 7.57374C10.8193 7.412 10.8105 7.13772 10.9899 6.95836ZM9.57566 5.54414C10.5283 4.59148 12.0762 4.58173 13.0285 5.54718C13.9782 6.50009 13.9869 8.04564 13.0225 8.99697C12.0706 9.94565 10.5272 9.95534 9.57564 8.99398C8.61327 8.04139 8.62399 6.49581 9.57566 5.54414Z" />
    </svg>
  )
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
