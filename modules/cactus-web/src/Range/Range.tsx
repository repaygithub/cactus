import { color, colorStyle, lineHeight, shadow, space, textStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import { CSSObject } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { getStatusStyles, Status, StatusPropType } from '../helpers/status'
import { flexItem, FlexItemProps, sizing, SizingProps, withStyles } from '../helpers/styled'

// TODO For the tickmarks (future ticket), I'd suggest the following API:
// <Range>
//   <option value="0" />
//   <option value="10">with label</option>
//   <option value="50">uneven gap</option>
// </Range>
// It's similar to the `list` attribute used by pure HTML, but cuts out the middleman.

// There are other invalid props for `range` but these are the most common, I think.
type InvalidProps = 'type' | 'height' | 'width' | 'list' | 'placeholder' | 'readOnly' | 'required'
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, InvalidProps> {
  showValue?: 'focus' | 'hover' | boolean
  status?: Status
}
export type RangeProps = InputProps & MarginProps & SizingProps & FlexItemProps

const VALUE_SIZE = 24
const NULL_ZONE = VALUE_SIZE / 2

const parse = (value: string, fallback: number): number => {
  const num = parseFloat(value)
  return isNaN(num) ? fallback : num
}

const setValuePosition = (wrapper: HTMLElement) => {
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const input = wrapper.querySelector<HTMLInputElement>('.range-input')!
  const lowerBar = wrapper.querySelector<HTMLElement>('.range-low')!
  const indicator = wrapper.querySelector<HTMLElement>('.range-value')!
  const text = indicator.querySelector<HTMLElement>('span.range-tooltip')
  /* eslint-enable @typescript-eslint/no-non-null-assertion */
  const min = parse(input.min, 0)
  const range = Math.max(0, parse(input.max, 100) - min)
  const value = parse(input.value, min)
  const normalizedValue = Math.max(0, value - min)
  const slidableWidth = wrapper.getBoundingClientRect().width - VALUE_SIZE
  const offset = Math.round((slidableWidth * normalizedValue) / range)
  indicator.style.left = `${offset}px`
  lowerBar.style.width = `${offset + NULL_ZONE}px`
  if (text) {
    text.innerHTML = value.toLocaleString()
  }
}

const formResetEffect = (wrapper: HTMLElement) => {
  const form = wrapper.querySelector<HTMLInputElement>('.range-input')?.form
  if (form) {
    // Reset event fires before the values actually change, so we delay the visual reset.
    const onReset = () => setTimeout(() => setValuePosition(wrapper))
    form.addEventListener('reset', onReset)
    return () => form.removeEventListener('reset', onReset)
  }
}

const setPositionOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValuePosition(e.target.parentElement as HTMLElement)
}

const BaseRange = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, style, showValue, ...props }, inputRef) => {
    const ref = React.useRef<HTMLDivElement>(null)
    React.useLayoutEffect(() => {
      if (ref.current) {
        setValuePosition(ref.current)
      }
    })
    const isUncontrolled = props.value === undefined
    React.useEffect(() => {
      setNullZone()
      if (ref.current && isUncontrolled) {
        return formResetEffect(ref.current)
      }
    }, [props.form, isUncontrolled])

    const { onChange } = props
    if (isUncontrolled) {
      props.onChange = !onChange
        ? setPositionOnChange
        : (e) => {
            setPositionOnChange(e)
            onChange(e)
          }
    }
    return (
      <span className={className} style={style} ref={ref}>
        <RangeInput {...props} ref={inputRef} />
        <RangeSlider aria-hidden>
          <span className="range-bar range-low" />
          <span className="range-bar range-high" />
          <span className="range-value">
            <span className="range-indicator" />
            {showValue && (
              <>
                <svg viewBox="0 0 24 5" className="range-tooltip">
                  <polygon points="8,0 16,0 12,4" />
                </svg>
                <span className="range-tooltip" />
              </>
            )}
          </span>
        </RangeSlider>
      </span>
    )
  }
)

// All browsers have a "null zone" on each end, half the size of the value indicator,
// so that when the indicator is at max/min the value is centered without overflowing.
// We have a null zone as well, so we adjust the range input so the actual
// endpoints (ignoring the null zone) match up with the visible endpoints.
const NULL_ZONE_STYLES: CSSObject = { position: 'relative', top: '0', left: '0', width: '100%' }

const setNullZone = () => {
  // Use `position` as a sentinel value to check if we've already done this calculation.
  if (NULL_ZONE_STYLES.position === 'relative') {
    const input = document.createElement('input')
    input.setAttribute('type', 'range')
    input.style.opacity = '0'
    input.style.position = 'fixed'
    input.style.zIndex = '-1000'
    input.style.pointerEvents = 'none'
    input.style.fontSize = '16px'
    input.style.padding = '0'
    document.body.appendChild(input)
    const browserNullZone = input.getBoundingClientRect().height / 2
    document.body.removeChild(input)
    setNullZoneStyles(NULL_ZONE - browserNullZone)
    const sliders = document.querySelectorAll<HTMLElement>(`${Range} input`)
    for (let i = 0; i < sliders.length; i++) {
      Object.assign(sliders[i].style, NULL_ZONE_STYLES)
    }
  }
}

const setNullZoneStyles = (nullZoneDiff: number) => {
  NULL_ZONE_STYLES.position = 'absolute'
  NULL_ZONE_STYLES.left = `${nullZoneDiff.toFixed(3)}px`
  NULL_ZONE_STYLES.width = `calc(100% - ${(nullZoneDiff * 2).toFixed(3)}px)`
}

const getShowValueStyles = ({ showValue }: RangeProps) => {
  const styles: any = { '.range-tooltip': { display: 'none' } }

  if (showValue === true || showValue === 'focus') {
    styles['.range-input:enabled:focus + .range-slider .range-tooltip'] = { display: 'block' }
  }
  if (showValue === true || showValue === 'hover') {
    styles['.range-input:enabled:hover + .range-slider .range-tooltip'] = { display: 'block' }
  }
  return styles
}

const applyStatusStyles = (styles: CSSObject | undefined) => {
  if (styles) {
    return {
      '.range-indicator': styles,
      '.range-low': { backgroundColor: styles.borderColor },
      '.range-high': { backgroundColor: styles.backgroundColor },
    }
  }
}

export const Range = withStyles('span', {
  displayName: 'Range',
  as: BaseRange,
  transitiveProps: ['status'],
  styles: [margin, sizing, flexItem],
})<MarginProps & SizingProps & FlexItemProps>`
  display: inline-flex;
  flex-direction: column;
  position: relative;
  min-height: ${VALUE_SIZE}px;
  height: 1.3em;
  min-width: ${VALUE_SIZE * 2}px;
  width: 10em;

  ${getShowValueStyles}

  .range-slider {
    ${(p) => applyStatusStyles(getStatusStyles(p))}
  }
`

Range.propTypes = {
  showValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf<'hover' | 'focus'>(['hover', 'focus']),
  ]),
  status: StatusPropType,
}

const RangeInput = withStyles('input', {
  className: 'range-input',
  extraAttrs: { type: 'range' },
})`
  ${() => NULL_ZONE_STYLES}
  height: 100%;
  margin: 0;
  padding: 0;
  opacity: 0;
  z-index: 1;
  cursor: grab;

  :active {
    cursor: grabbing;
    + .range-slider .range-indicator {
      ${shadow(0)}
    }
  }

  :focus-visible + .range-slider {
    outline: 1px solid ${color('callToAction')};
  }

  :disabled {
    cursor: not-allowed;
    + .range-slider span {
      border-color: ${color('lightGray')};
      background-color: ${color('lightGray')};
    }
  }
`

const RangeSlider = withStyles('span', { className: 'range-slider' })`
  flex: 1 0 ${VALUE_SIZE}px;
  display: flex;
  position: relative;
  align-items: center;

  .range-low {
    background-color: ${color('callToAction')};
    flex: 0 0 auto;
  }

  .range-high {
    background-color: ${color('lightCallToAction')};
    flex: 1 1 auto;
  }

  .range-bar {
    height: 4px;
    border-radius: 2px;
    min-width: ${NULL_ZONE}px;
  }

  .range-value {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    overflow: visible;
    width: ${VALUE_SIZE}px;
    height: ${VALUE_SIZE}px;
    border-radius: 50%;
    position: absolute;
    top: calc(50% - ${NULL_ZONE}px);
  }

  .range-indicator {
    flex-shrink: 0;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    border-radius: 50%;
    border: solid 1px ${color('callToAction')};
    background-color: ${color('white')};
  }

  svg.range-tooltip {
    flex-shrink: 0;
    width: 100%;
    height: 5px;
    fill: ${color('callToAction')};
  }

  span.range-tooltip {
    flex-shrink: 0;
    box-sizing: border-box;
    ${colorStyle('callToAction')}
    ${textStyle('small')}
    ${lineHeight('small', 'height')}
    padding: ${space(1)} ${space(2)};
    border-radius: ${space(1)};
  }
`

export default Range
