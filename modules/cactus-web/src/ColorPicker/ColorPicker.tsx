import { DescriptivePalette } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React from 'react'
import { ColorChangeHandler, CustomPicker, HSLColor, HSVColor } from 'react-color'
import { EditableInput, Hue, Saturation } from 'react-color/lib/components/common'
import styled, { css } from 'styled-components'
import { margin, MarginProps } from 'styled-system'
import tinycolor from 'tinycolor2'

import Button from '../Button/Button'
import Flex from '../Flex/Flex'
import FocusLock from '../FocusLock/FocusLock'
import { CactusChangeEvent, CactusEventTarget, CactusFocusEvent } from '../helpers/events'
import { usePositioning } from '../helpers/positionPopover'
import positionPortal from '../helpers/positionPortal'
import { SemiControlled } from '../helpers/react'
import { border, popupBoxShadow, popupShape, radius } from '../helpers/theme'
import usePopup, { TogglePopup } from '../helpers/usePopup'
import IconButton from '../IconButton/IconButton'
import TextButton from '../TextButton/TextButton'

// Monkey! (fix IE11 issue in Saturation component)
if (typeof document !== 'undefined' && document?.body && !document.contains) {
  document.contains = document.body.contains.bind(document.body)
}

interface BaseProps
  extends MarginProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'onChange' | 'onFocus' | 'onBlur'> {
  name: string
  id: string
  phrases?: Partial<Phrases>
  disabled?: boolean
}

interface InnerColorPickerProps extends BaseProps {
  anchorRef: React.RefObject<HTMLDivElement>
  color: tinycolor.Instance
  setColor: (c: tinycolor.Instance, e: React.SyntheticEvent) => void
  onFocus: React.FocusEventHandler<HTMLElement>
  onBlur: (e: React.FocusEvent<HTMLElement>, t: TogglePopup) => void
}

interface ColorPickerProps extends BaseProps {
  format?: Format
  value?: Color
  onChange?: React.ChangeEventHandler<CactusEventTarget<Color>>
  onFocus?: React.FocusEventHandler<CactusEventTarget<Color>>
  onBlur?: React.FocusEventHandler<CactusEventTarget<Color>>
}

interface CustomPickerProps {
  saveColor: (color: tinycolor.Instance) => void
  currentColor: tinycolor.Instance
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

type Format = 'hex' | 'rgb' | 'hsl' | 'hsv'

type Color = string | RGB | HSL | HSV

interface PointerProps {
  hsl?: HSLColor
}

interface Phrases {
  colorLabel: string
  hexLabel: string
  redLabel: string
  greenLabel: string
  blueLabel: string
  triggerLabel: string
  applyLabel: string
  cancelLabel: string
}

interface DialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  handleClose: () => void
  color: tinycolor.Instance
  setColor: (c: tinycolor.Instance, e: React.SyntheticEvent) => void
  phrases: Phrases
}

const PickerDialog = styled(({ handleClose, color, setColor, phrases, ...props }: DialogProps) => {
  const [dialogColor, setDialogColor] = React.useState<tinycolor.Instance>(color)
  const handleApply = (event: React.MouseEvent) => {
    setColor(dialogColor, event)
    handleClose()
  }
  return (
    <FocusLock {...props}>
      <Picker saveColor={setDialogColor} currentColor={dialogColor} phrases={phrases} />
      <Flex justifyContent="space-around" width="100%" mt={4}>
        <TextButton variant="danger" onClick={handleClose}>
          {phrases.cancelLabel}
        </TextButton>
        <Button variant="action" onClick={handleApply}>
          {phrases.applyLabel}
        </Button>
      </Flex>
    </FocusLock>
  )
})`
  &[aria-hidden] {
    display: none;
  }
  box-sizing: border-box;
  position: fixed;
  z-index: 1000;
  width: 320px;
  padding: 16px;
  background-color: ${(p): string => p.theme.colors.white};
  ${(p): ReturnType<typeof css> => popupShape('dialog', p.theme.shape)}
  ${(p): ReturnType<typeof css> => popupBoxShadow(p.theme)}
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

const InputWrapper = styled.div`
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

  input.hex-borderless {
    border: none;
    outline: none;
    padding: 0;
    background-color: transparent;
    font-size: inherit;
    width: 5em;

    :disabled {
      color: ${(p) => p.theme.colorStyles.disable.color};
    }
  }

  &[aria-disabled] {
    cursor: not-allowed;
    border-color: ${(p) => p.theme.colors.lightGray};
    background-color: ${(p) => p.theme.colorStyles.disable.backgroundColor};
  }
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

const blackHsl: HSLColor = { h: 0, s: 0, l: 0 }

const HuePointer: React.FC<PointerProps> = ({ hsl = blackHsl }) => {
  return <Pointer $hsl={hsl} $type="hue" />
}

const SaturationPointer: React.FC<PointerProps> = ({ hsl = blackHsl }) => {
  return <Pointer $hsl={hsl} $type="saturation" />
}

// These do their own styling, so we have to convert theme radius to a prop.
const StyledHue = styled(Hue).attrs((p) => ({ radius: radius(20)(p) }))``
const StyledSaturation = StyledHue.withComponent(Saturation)

const PickerBase: React.FC<CustomPickerProps> = (props) => {
  const { saveColor, currentColor, phrases, ...rest } = props

  const handleSaturationChange: ColorChangeHandler<HSVColor> = (hsv) => {
    const color = tinycolor(hsv)
    saveColor(color)
  }

  const handleHueChange: ColorChangeHandler<HSLColor> = (hsl) => {
    const color = tinycolor(hsl)
    saveColor(color)
  }

  const handleInnerHexChange = (change: { [k: string]: string }) => {
    const color = getValidColor(change[phrases.hexLabel] || '')
    if (color) {
      saveColor(color)
    }
  }

  const rgb = currentColor.toRgb()
  const handleRGBChange = (change: number, key: 'r' | 'g' | 'b') => {
    const color = tinycolor({ ...rgb, [key]: change })
    saveColor(color)
  }

  // The calculated hue for black is always zero, but we want to preserve it here.
  const original: any = currentColor.getOriginalInput()
  const hsl = original?.source === 'hsl' ? original : currentColor.toHsl()
  const hsv = original?.source === 'hsv' ? original : currentColor.toHsv()
  hsl.h = hsv.h = hsl.h || hsv.h

  return (
    <Flex width="100%" flexDirection="column" alignItems="center" justifyContent="center">
      <SaturationWrapper>
        <StyledSaturation
          {...rest}
          hsl={hsl}
          hsv={hsv}
          pointer={SaturationPointer}
          onChange={handleSaturationChange}
        />
      </SaturationWrapper>
      <HueWrapper>
        <StyledHue {...rest} hsl={hsl} pointer={HuePointer} onChange={handleHueChange} />
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
          value={fmtColor(currentColor, 'hex') as string}
          onChange={handleInnerHexChange}
        />
        <Flex className="rgb-wrapper" width="100%" justifyContent="space-between" mt={7}>
          <EditableInput
            value={rgb.r}
            label={phrases.redLabel}
            onChange={({ R }) => handleRGBChange(Number(R), 'r')}
          />
          <EditableInput
            value={rgb.g}
            label={phrases.greenLabel}
            onChange={({ G }) => handleRGBChange(Number(G), 'g')}
          />
          <EditableInput
            value={rgb.b}
            label={phrases.blueLabel}
            onChange={({ B }) => handleRGBChange(Number(B), 'b')}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

const Picker = CustomPicker(PickerBase)

const getValidColor = (raw: string) => {
  const color = new tinycolor(raw)
  // There are short formats like hex3 & hex4 that we don't want to deal with.
  if (
    color.isValid() &&
    !(color.getFormat().startsWith('hex') && raw.replace(/^#/, '').length < 6)
  ) {
    return color
  }
}

interface ColorState {
  input: Color
  color: tinycolor.Instance
}

const DEFAULT_COLOR = 'black'
const initialState: ColorState = {
  input: DEFAULT_COLOR,
  color: new tinycolor(DEFAULT_COLOR),
}

const fmtColor = (color: tinycolor.Instance, format: Format = 'hex'): Color => {
  if (format === 'hex') {
    return color.toHexString().toUpperCase()
  } else if (format === 'rgb') {
    return color.toRgb()
  } else if (format === 'hsl') {
    return color.toHsl()
  } else if (format === 'hsv') {
    return color.toHsv()
  }
  return '#000000'
}

const colorShape = PropTypes.oneOfType([
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
])

const colorType = (...args: Parameters<typeof colorShape>): Error | null => {
  const props = args[0]
  if (!props.value) return null
  const color = new tinycolor(props.value)
  const format = props.format || 'hex'
  if (!color.isValid()) {
    return new Error('Invalid prop `value` supplied to `ColorPicker`: unrecognized color')
  } else if (color.getFormat() !== format) {
    return new Error('Invalid prop `value` supplied to `ColorPicker`: does not match `format`')
  }
  return colorShape(...args)
}

export class ColorPicker extends React.Component<ColorPickerProps, ColorState> {
  static displayName = 'ColorPicker'

  static propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    format: PropTypes.oneOf<Format>(['hex', 'hsl', 'hsv', 'rgb']),
    value: colorType,
    phrases: PropTypes.shape({
      colorLabel: PropTypes.string,
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

  state = initialState

  private hasFocus = false

  private eventTarget = new CactusEventTarget<Color>({})

  private anchorRef = React.createRef<HTMLDivElement>()

  static getDerivedStateFromProps(
    props: Readonly<ColorPickerProps>,
    state: ColorState
  ): Partial<ColorState> | null {
    if (props.value !== undefined) {
      const input = props.value || DEFAULT_COLOR
      if (input !== state.input) {
        return props.value ? { input, color: new tinycolor(input) } : initialState
      }
    }
    return null
  }

  private syncTarget(color: tinycolor.Instance = this.state.color) {
    this.eventTarget.id = this.props.id
    this.eventTarget.name = this.props.name
    this.eventTarget.value = fmtColor(color, this.props.format)
    return this.eventTarget
  }

  private contains(maybeNode: unknown): boolean {
    const wrapper = this.anchorRef.current
    return maybeNode instanceof Node && !!wrapper && wrapper.contains(maybeNode)
  }

  private handleFocus = (event: React.FocusEvent<HTMLElement>) => {
    event.stopPropagation()
    if (!this.hasFocus) {
      this.hasFocus = true
      const focusHandler = this.props.onFocus
      if (typeof focusHandler === 'function') {
        focusHandler(new CactusFocusEvent('focus', this.syncTarget(), event))
      }
    }
  }

  private handleBlur = (event: React.FocusEvent<HTMLElement>, toggle: TogglePopup) => {
    event.stopPropagation()
    event.preventDefault()
    if (!this.contains(event.relatedTarget)) {
      this.hasFocus = false
      const blurHandler = this.props.onBlur
      if (typeof blurHandler === 'function') {
        blurHandler(new CactusFocusEvent('blur', this.syncTarget(), event))
      }
      // `relatedTarget` is null when the entire window loses focus,
      // but `activeElement` will still point to a page element.
      window.requestAnimationFrame(() => {
        if (!this.contains(document.activeElement)) {
          toggle(false)
        }
      })
    }
  }

  private setColor = (color: tinycolor.Instance, event: React.SyntheticEvent) => {
    if (tinycolor.equals(this.state.color, color)) return

    this.setState({ color })
    const changeHandler = this.props.onChange
    if (typeof changeHandler === 'function') {
      changeHandler(new CactusChangeEvent(this.syncTarget(color), event))
    }
  }

  render(): React.ReactElement {
    const { value, format, onFocus, onBlur, onChange, ...props } = this.props
    return (
      <InnerColorPicker
        {...props}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        anchorRef={this.anchorRef}
        color={this.state.color}
        setColor={this.setColor}
      />
    )
  }

  static toString(): string {
    // For use as a styled-components CSS class.
    return InputWrapper.toString()
  }
}

const InnerColorPicker = (props: InnerColorPickerProps) => {
  const {
    name,
    disabled = false,
    phrases: passedPhrases,
    color,
    setColor,
    anchorRef,
    onBlur,
    onKeyDown,
    ...rest
  } = props
  const phrases: Phrases = { ...defaultPhrases, ...passedPhrases }
  const popup = {
    id: props.id,
    onWrapperBlur: onBlur,
    onWrapperKeyDown: onKeyDown as React.KeyboardEventHandler<HTMLElement>,
    focusOnClickExpand: true,
  }
  const { expanded, toggle, buttonProps, popupProps, wrapperProps } = usePopup('dialog', popup)
  if (!expanded) {
    // In this case we conditionally render the dialog, don't want an invalid ID here.
    delete buttonProps['aria-controls']
  }
  const popupId = React.useRef(popupProps.id as string)
  usePositioning({
    anchorRef,
    ref: popupId,
    visible: expanded,
    position: positionPortal,
    updateOnScroll: true,
  })

  const handleOuterHexChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const color = getValidColor(event.target?.value || '')
      if (color) {
        setColor(color, event)
      }
    },
    [setColor]
  )

  const handleClose = React.useCallback(() => {
    toggle(false, anchorRef.current?.querySelector('input'))
  }, [toggle, anchorRef])

  return (
    <InputWrapper {...rest} {...wrapperProps} ref={anchorRef} aria-disabled={disabled || undefined}>
      <IconButton
        {...buttonProps}
        disabled={disabled}
        iconSize="small"
        label={phrases.triggerLabel}
      >
        <DescriptivePalette />
      </IconButton>
      <SemiControlled
        input="input"
        className="hex-borderless"
        name={name}
        disabled={disabled}
        readOnly={expanded}
        value={fmtColor(color, 'hex')}
        onChange={handleOuterHexChange}
        aria-label={phrases.colorLabel}
      />
      {expanded && (
        <PickerDialog
          {...popupProps}
          phrases={phrases}
          handleClose={handleClose}
          color={color}
          setColor={setColor}
        />
      )}
    </InputWrapper>
  )
}

const defaultPhrases: Phrases = {
  colorLabel: 'Color',
  hexLabel: 'Hex',
  redLabel: 'R',
  greenLabel: 'G',
  blueLabel: 'B',
  triggerLabel: 'Click to open the color picker',
  applyLabel: 'Apply',
  cancelLabel: 'Cancel',
}

export default ColorPicker
