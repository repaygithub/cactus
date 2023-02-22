import {
  DescriptiveCalendar,
  DescriptiveClock,
  NavigationChevronDown,
  NavigationChevronUp,
} from '@repay/cactus-icons'
import { border, color, colorStyle, radius, textStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { Component, ReactElement } from 'react'
import styled from 'styled-components'
import { margin, MarginProps, width, WidthProps } from 'styled-system'

import Calendar, { CalendarLabels, MonthChange } from '../Calendar/Calendar'
import { CalendarDate, CalendarValue, InitialFocus } from '../Calendar/Grid'
import Flex from '../Flex/Flex'
import FocusLock from '../FocusLock/FocusLock'
import { keyDownAsClick, preventAction } from '../helpers/a11y'
import { isIE } from '../helpers/constants'
import {
  DateType,
  FormatTokenType,
  getDefaultFormat,
  getLastDayOfMonth,
  getLocaleFormat,
  isToken,
  parseFormat,
  PartialDate,
  TOKEN_SETTERS,
} from '../helpers/dates'
import {
  CactusChangeEvent,
  CactusEventTarget,
  CactusFocusEvent,
  isFocusLost,
  isFocusOut,
} from '../helpers/events'
import getLocale from '../helpers/locale'
import { getDataProps } from '../helpers/omit'
import { usePositioning } from '../helpers/positionPopover'
import positionPortal from '../helpers/positionPortal'
import { getStatusStyles, Status, StatusPropType } from '../helpers/status'
import IconButton from '../IconButton/IconButton'

interface DateInputPhrasesType extends Partial<CalendarLabels> {
  inputKeyboardDirections: string
  yearLabel: string
  monthLabel: string
  dayLabel: string
  hoursLabel: string
  minutesLabel: string
  periodLabel: string
  pickerLabel: string
  showCalendar: string
  ariaDisabledDate?: (date: string) => string
}

/**
 * implemented to account for Firefox type=number removing leading and trailing zeros
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1005603
 */
const IS_FIREFOX = typeof window !== 'undefined' && window.navigator.userAgent.match(/firefox/i)
const NUMBER_INPUT_TYPE = !IS_FIREFOX ? 'number' : 'tel'

const noop = function (): void {
  return
}
const ALLOW_DEFAULT = ['Escape', 'Tab', 'Home', 'PageUp', 'PageDown', 'ArrowLeft', 'ArrowRight']

function isOwnInput(target: any, container: Element): target is HTMLInputElement {
  return (
    target instanceof HTMLInputElement &&
    container.contains(target) &&
    TOKEN_SETTERS.hasOwnProperty(target.dataset.token || '')
  )
}

function getInputLabel(token: FormatTokenType, phrases: DateInputPhrasesType): string {
  switch (token) {
    case 'YYYY': {
      return phrases.yearLabel
    }
    case 'M':
    case 'MM': {
      return phrases.monthLabel
    }
    case 'd':
    case 'dd': {
      return phrases.dayLabel
    }
    case 'h':
    case 'hh':
    case 'H':
    case 'HH': {
      return phrases.hoursLabel
    }
    case 'mm': {
      return phrases.minutesLabel
    }
    case 'aa': {
      return phrases.periodLabel
    }
  }
}

function getInputPlaceholder(token: FormatTokenType): string {
  switch (token) {
    case 'YYYY': {
      return 'yyyy'
    }
    case 'M':
    case 'MM': {
      return 'mm'
    }
    case 'd':
    case 'dd': {
      return 'dd'
    }
    case 'h':
    case 'hh':
    case 'H':
    case 'HH':
    case 'mm':
    case 'aa': {
      return '--'
    }
  }
}

function arrowValueChange(
  token: FormatTokenType,
  value: PartialDate,
  key: 'ArrowUp' | 'ArrowDown'
): void {
  const direction = key === 'ArrowUp' ? 1 : -1
  switch (token) {
    case 'YYYY': {
      value.setYear(value.getYear() + direction)
      break
    }
    case 'M':
    case 'MM': {
      value.setMonth((value.getMonth() + direction + 12) % 12)
      break
    }
    case 'd':
    case 'dd': {
      const lastDate = value.getLastDayOfMonth()
      value.setDate(((value.getDate() - 1 + direction + lastDate) % lastDate) + 1)
      break
    }
    case 'h':
    case 'hh': {
      let asNum = Number(value.get_Hours())
      asNum += direction

      // Switches from AM to PM while using arrows
      if (asNum === 12 && direction > 0) {
        value.aa = value.aa === 'AM' ? 'PM' : 'AM'
      } else if (asNum === 11 && direction < 0) {
        value.aa = value.aa === 'AM' ? 'PM' : 'AM'
      }

      if (asNum <= 12 && asNum >= 1) {
        value.setHours(asNum)
      } else if (direction < 0) {
        value.setHours(12)
      } else {
        value.setHours(1)
      }
      break
    }
    case 'H':
    case 'HH': {
      const newValue = value.getHours() + direction
      if (newValue <= 23 && newValue >= 0) {
        value.setHours(newValue)
      } else if (direction < 0) {
        value.setHours(23)
      } else {
        value.setHours(0)
      }
      break
    }
    case 'mm': {
      const newValue = value.getMinutes() + direction
      const outOfRange = newValue > 59 || newValue < 0
      if (newValue <= 59 && newValue >= 0) {
        value.setMinutes(newValue)
      } else if (direction < 0 && outOfRange) {
        value.setMinutes(59)
      } else {
        value.setMinutes(0)
      }
      break
    }
    case 'aa': {
      let period = value.aa
      if (period === undefined) {
        period = key === 'ArrowUp' ? 'AM' : 'PM'
      } else {
        period = period === 'PM' ? 'AM' : 'PM'
      }
      value.aa = period
      break
    }
  }
}

const LiteralPunctuation = styled.span`
  speak-as: literal-punctuation;
  speak: literal-punctuation;
`

const ToggleButtons = styled.div`
  box-sizing: border-box;
  display: inline-flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  padding: 0;
  height: 100%;
  position: relative;

  svg {
    box-sizing: border-box;
    height: 16px;
    width: 16px;
    padding: 2px;
    appearance: none;
    border: none;
    cursor: pointer;
  }
`

const InputWrapper = styled.div`
  position: relative;
  ${colorStyle('darkContrast', 'white')};
  box-sizing: border-box;
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  border: ${border('darkestContrast')};
  border-radius: ${radius(20)};
  ${getStatusStyles}
  height: 35px;
  outline: none;
  overflow: hidden;
  padding: 0 16px 0 12px;
  user-select: none;
  min-width: 106px;
  ${textStyle('body')};
  ${margin}
  ${width}

  &:focus-within {
    border-color: ${color('callToAction')};
  }

  > ${LiteralPunctuation} {
    margin-left: 0;
    ${IS_FIREFOX && 'align-self: center;'}
    ${isIE && 'align-self: flex-end;'}
  }

  input {
    border: none;
    background-color: transparent;
    width: 1.2em;
    font-size: inherit;
    text-align: center;

    // hides cursor
    color: transparent;
    text-shadow: 0 0 0 ${color('darkestContrast')};

    // hides selection
    &::selection {
      background: transparent;
    }

    // hides toggle "spin" buttons on type=number
    appearance: textfield;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      appearance: none;
      margin: 0;
    }

    &:focus {
      outline: none;
      background-color: ${color('lightCallToAction')};
    }

    &::placeholder {
      color: ${color('mediumContrast')};
    }

    &[data-token='MM'] {
      width: 1.1em;

      &[value=''] {
        width: 1.65em;
      }
    }

    &[data-token='dd'] {
      width: 1.1em;

      &[value=''] {
        width: 1.15em;
      }
    }

    &[data-token='YYYY'] {
      width: 2.2em;
    }

    &[data-token='aa'] {
      width: 1.55em;

      &[value=''] {
        width: 1.2em;
      }
    }

    &[data-token='hh'] {
      ${() => isIE && 'margin-left: 8px;'}
    }
  }

  ${IconButton} {
    font-size: 16px;
    margin-right: 8px;
  }

  ${ToggleButtons} {
    margin-right: -2px;
    margin-left: auto;
  }
`

interface PopupProps extends React.HTMLAttributes<HTMLDivElement> {
  anchorRef: React.RefObject<HTMLDivElement>
  popupRef: React.RefObject<HTMLDivElement>
}

const CalendarPopup: React.FC<PopupProps> = ({ anchorRef, popupRef, children, ...props }) => {
  usePositioning({
    anchorRef,
    ref: popupRef,
    visible: !props.hidden,
    position: positionPortal,
    updateOnScroll: true,
  })
  return <FocusLock {...props}>{!props.hidden && children}</FocusLock>
}

const PopupCalendar = styled(Calendar)`
  position: fixed;
  z-index: 1000;
  outline: none;
  border-top-left-radius: 0;
`

type Target = CactusEventTarget<CalendarDate | number>

export interface DateInputProps
  extends MarginProps,
    WidthProps,
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'disabled' | 'width' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'onFocus'
    > {
  name: string
  id: string
  className?: string
  /** When */
  value?: string | Date | null | number
  defaultValue?: string | Date | null
  initialFocus?: InitialFocus
  /**
   * Required when value is a string, then when events are called with the value they will be
   * this format. Date will always be displayed based on locale preferences.
   * */
  format?: string
  locale?: string
  status?: Status
  /**
   * Indicates which fields to display for the user
   */
  type?: 'date' | 'datetime' | 'time'
  /** !important */
  disabled?: boolean
  onChange?: React.ChangeEventHandler<Target>
  onFocus?: React.FocusEventHandler<Target>
  onBlur?: React.FocusEventHandler<Target>

  /**
   * Phrases to use for translations.
   * For caching purposes, these will only update for a given
   * instance when the locale changes.
   */
  phrases?: Partial<DateInputPhrasesType>
  /**
   * function to determine whether a specific date should render as disabled.
   */
  isValidDate?: (date: Date) => boolean
  /**
   * Handler called when the value switches from valid
   * to invalid or vice versa.
   * This function is called on blur events.
   */
  onInvalidDate?: (isDateInvalid: boolean) => void
}

interface InputContentProps extends Pick<DateInputProps, 'id' | 'name' | 'disabled'> {
  value: PartialDate
  hasDate: boolean
  iconRef: React.RefObject<HTMLButtonElement>
  phrases: DateInputPhrasesType
  formatArray: string[]
  handleButtonClick: (e: React.SyntheticEvent) => void
  handleUpArrowClick: (e: React.MouseEvent<SVGSVGElement>) => void
  handleDownArrowClick: (e: React.MouseEvent<SVGSVGElement>) => void
}

interface DateInputState {
  value: PartialDate
  valueProp: DateInputProps['value']
  focusMonth: number
  focusYear: number
  isOpen: boolean
  invalidDate: boolean
}

const isFormatValid = (format: string, type: DateType): boolean => {
  const isInvalidDate = /[HhmaDy]/.test(format)
  const isInvalidTime = /[YMdD]/.test(format)
  return (
    type === 'datetime' ||
    (type === 'date' && !isInvalidDate) ||
    (type === 'time' && !isInvalidTime)
  )
}

class DateInputBase extends Component<DateInputProps, DateInputState> {
  public constructor(props: DateInputProps) {
    super(props)

    const {
      defaultValue = '',
      value: initValue = defaultValue,
      locale = getLocale(),
      type = 'date',
      format = getDefaultFormat(type),
    } = props
    const value = PartialDate.from(initValue, { format, locale, type })
    const valueProp = Number.isNaN(props.value) ? undefined : props.value
    this.state = {
      value,
      valueProp,
      focusMonth: value.getMonth(),
      focusYear: value.getYear(),
      isOpen: false,
      invalidDate: false,
    }
  }

  private _shouldFocusNext = false
  private _lastInputKeyed = ''
  private _isFocused = false

  private _inputWrapper = React.createRef<HTMLDivElement>()
  private _button = React.createRef<HTMLButtonElement>()
  private _portal = React.createRef<HTMLDivElement>()
  // This ref goes to the CalendarBase class.
  private _setPortal = (target: any) => {
    ;(this._portal as React.MutableRefObject<HTMLDivElement>).current = target?.rootElement
  }
  private eventTarget = new CactusEventTarget<CalendarDate | number>({})

  public static propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    status: StatusPropType,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
    initialFocus: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
      PropTypes.shape({ year: PropTypes.number, month: PropTypes.number, day: PropTypes.number }),
    ]),
    format: function (props: any): Error | null {
      if (props.format) {
        if (typeof props.format !== 'string') {
          return new Error(`Provided prop 'format' must be a string.`)
        } else if (typeof props.value === 'string') {
          const type = props.type || 'date'
          if (!isFormatValid(props.format, props.type)) {
            return new Error(
              `Provided format '${props.format}' contains unexpected tokens for type '${type}'.`
            )
          }
        }
      }
      return null
    },
    type: PropTypes.oneOf(['date', 'datetime', 'time']),
    locale: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onInvalidDate: PropTypes.func,
    phrases: PropTypes.object,
  }

  public static defaultProps = {
    locale: getLocale(),
    type: 'date',
    phrases: {},
  }

  public static getDerivedStateFromProps(
    props: Readonly<DateInputProps>,
    state: Readonly<DateInputState>
  ): Partial<DateInputState> | null {
    const value = state.value
    const {
      value: valueProp,
      type = value.getType(),
      locale = value.getLocale(),
      // If the type changes and format is undefined, format should change as well.
      format = type !== value.getType() ? getDefaultFormat(type) : value.getFormat(),
    } = props

    // Either `undefined` or `NaN` is ignored, causing no state change.
    const ignoreProp = Number.isNaN(valueProp)
    let updates: null | Partial<DateInputState> = null
    if (valueProp !== undefined && valueProp !== state.valueProp && !ignoreProp) {
      updates = { valueProp }
      const newValue = PartialDate.from(valueProp, { format, type, locale })
      if (!newValue.equals(value)) {
        updates.value = newValue
        return updates
      }
    } else if (ignoreProp && state.valueProp !== undefined) {
      // This is so it can be cleared twice with only partial changes in between.
      updates = { valueProp: undefined }
    }
    if (type !== value.getType() || format !== value.getFormat() || locale !== value.getLocale()) {
      const newValue = value.clone()
      newValue.setType(type, format)
      newValue.setLocale(locale)
      updates = { ...updates, value: newValue }
    }
    return updates
  }

  public componentDidMount(): void {
    this.eventTarget.id = this.props.id
    this.eventTarget.name = this.props.name
  }

  public componentDidUpdate() {
    this.eventTarget.id = this.props.id
    this.eventTarget.name = this.props.name
    // when the entered text is a complete value, auto focus the next input
    if (this._shouldFocusNext) {
      this._shouldFocusNext = false
      const activeElement = document.activeElement
      const inputWrapper = this._inputWrapper.current
      if (
        activeElement instanceof Element &&
        inputWrapper instanceof Element &&
        isOwnInput(activeElement, inputWrapper)
      ) {
        let nextSibling: Node | null = activeElement
        while (nextSibling != null) {
          nextSibling = nextSibling.nextSibling
          if (nextSibling instanceof HTMLInputElement) {
            break
          }
        }
        if (nextSibling != null) {
          nextSibling.focus()
        }
      }
    }
    const { value, invalidDate } = this.state
    const { onInvalidDate, type } = this.props
    const dateFilled = value.MM && value.dd && value.YYYY
    const timeFilled = value.hh && value.mm && value.aa
    if (
      (type === 'time' && timeFilled && !value.isValid() && !invalidDate) ||
      (type === 'date' && dateFilled && !value.isValid() && !invalidDate) ||
      (type === 'datetime' && dateFilled && timeFilled && !value.isValid() && !invalidDate)
    ) {
      this.setState({ invalidDate: true })
      if (onInvalidDate && typeof onInvalidDate === 'function') {
        onInvalidDate(true)
      }
    } else if (value.isValid() && invalidDate) {
      this.setState({ invalidDate: false })
      if (onInvalidDate && typeof onInvalidDate === 'function') {
        onInvalidDate(false)
      }
    }
  }

  public componentWillUnmount(): void {
    this._close = () => undefined
  }

  private handleKeydownCapture = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const target = event.target
    if (isOwnInput(target, event.currentTarget)) {
      const token = target.dataset.token as FormatTokenType
      const eventKey = event.key
      if (eventKey === 'ArrowUp' || eventKey === 'ArrowDown') {
        this.handleUpdate(event, token, eventKey)
      } else if (eventKey === 'Delete' || eventKey === 'Backspace') {
        this.handleUpdate(event, token, 'Delete')
      } else if (eventKey === 'Tab') {
        this.handleUpdate(event, token, 'Tab')
      } else if (eventKey.length === 1) {
        this.handleUpdate(event, token, 'Key', eventKey)
      }
      if (!ALLOW_DEFAULT.includes(eventKey)) {
        event.stopPropagation()
        event.preventDefault()
      }
    } else {
      this._lastInputKeyed = ''
    }
  }

  private handleFocus = (event: React.FocusEvent<HTMLDivElement>): void => {
    if (!this._isFocused) {
      this._isFocused = true
      const { onFocus } = this.props
      if (typeof onFocus === 'function') {
        const cactusEvent = new CactusFocusEvent('focus', this.eventTarget, event)
        onFocus(cactusEvent as React.FocusEvent<Target, Element>)
      }
    }
  }

  private handleBlur = (event: React.FocusEvent<HTMLDivElement>): void => {
    // when blurring off the field
    const token = event.target.dataset?.token as FormatTokenType
    token && this.handleFormat(event, token)

    this._lastInputKeyed = ''

    if (isFocusOut(event)) {
      this._isFocused = false
      const { onBlur } = this.props
      if (typeof onBlur === 'function') {
        this.eventTarget.value = this.state.value.toValue()
        const cactusEvent = new CactusFocusEvent('blur', this.eventTarget, event)
        onBlur(cactusEvent as React.FocusEvent<Target, Element>)
      }
      if (isFocusLost(event)) {
        this._close(false)
      }
    }
  }

  private handleClick = (): void => {
    window.requestAnimationFrame((): void => {
      const activeElement = document.activeElement
      const _inputWrapper = this._inputWrapper.current
      if (
        _inputWrapper &&
        (!(activeElement instanceof Node) || !_inputWrapper.contains(activeElement))
      ) {
        const inputs = _inputWrapper.querySelector('input')
        if (inputs !== null) {
          inputs.focus()
        }
      }
    })
  }

  private handleButtonClick = (e: React.SyntheticEvent): void => {
    e.stopPropagation()
    this.setState({ isOpen: true })
    window.requestAnimationFrame(() => {
      // if not focusing in portal, try to focus first input
      const focusDay = this._portal.current?.querySelector('[role="grid"] [tabindex="0"]')
      if (focusDay instanceof HTMLElement) {
        focusDay.focus()
      }
    })
  }

  private handlePortalKeydown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (this.state.isOpen && event.key === 'Escape') {
      this._close(true)
      event.preventDefault()
      event.stopPropagation()
    }
  }

  private handleUpArrowClick = (event: React.MouseEvent<SVGSVGElement>): void => {
    const _wrapper = this._inputWrapper.current
    if (_wrapper instanceof HTMLDivElement) {
      const activeElement = document.activeElement
      if (activeElement !== null && isOwnInput(activeElement, _wrapper)) {
        this.handleUpdate(event, activeElement.dataset.token as any, 'ArrowUp')
      } else {
        const setFocusTo = _wrapper.querySelector('input') as HTMLInputElement
        this.handleUpdate(event, setFocusTo.dataset.token as any, 'ArrowUp')
        setFocusTo.focus()
      }
    }
    event.preventDefault()
    event.stopPropagation()
  }

  private handleDownArrowClick = (event: React.MouseEvent<SVGSVGElement>): void => {
    const _wrapper = this._inputWrapper.current
    if (_wrapper instanceof HTMLDivElement) {
      const activeElement = document.activeElement
      if (activeElement !== null && isOwnInput(activeElement, _wrapper)) {
        this.handleUpdate(event, activeElement.dataset.token as any, 'ArrowDown')
      } else {
        const setFocusTo = _wrapper.querySelector('input') as HTMLInputElement
        this.handleUpdate(event, setFocusTo.dataset.token as any, 'ArrowDown')
        setFocusTo.focus()
      }
    }
    event.preventDefault()
    event.stopPropagation()
  }

  private handleCalendarChange = (event: React.ChangeEvent<CactusEventTarget<CalendarValue>>) => {
    const newVal = event.target.value
    // This shouldn't ever happen, mostly just to keep Typescript happy.
    if (newVal && !Array.isArray(newVal)) {
      event.persist()
      this.setState(({ value }) => {
        const update = value.clone()
        if (typeof newVal === 'string') {
          update.parse(newVal, 'YYYY-MM-dd')
        } else {
          update.setYear(newVal.getFullYear())
          update.setMonth(newVal.getMonth())
          update.setDate(newVal.getDate())
        }
        this.raiseChange(event, update)
        return { value: update }
      })
      if (this.props.type === 'date') {
        this._close(true)
      }
    }
  }

  private handleMonthYearChange = (values: MonthChange, e: React.SyntheticEvent) => {
    e.persist()
    this.setState(({ value }) => {
      const newState = { value, focusMonth: values.month, focusYear: values.year }
      if (!values.isFocusOverflow) {
        const update = value.clone()
        update.setYear(values.year)
        update.setMonth(values.month)
        if (update.dd && !update.isValid()) {
          update.setDate(getLastDayOfMonth(values.month, values.year))
        }
        this.raiseChange(e, update)
        newState.value = update
      }
      return newState
    })
  }

  private handleTimeChange = (event: React.ChangeEvent<Target>): void => {
    const time = event.target.value
    const formatTime = getLocaleFormat('en-US', { type: 'time' })
    if (typeof time === 'string' && time !== '') {
      event.persist()
      this.setState(({ value }): Pick<DateInputState, 'value'> => {
        const update = value.clone()
        update.parse(time, formatTime)
        this.raiseChange(event, update)
        return { value: update }
      })
    }
  }

  private handleFormat = (event: React.SyntheticEvent, token: FormatTokenType): void => {
    this.setState(({ value }) => {
      const update = PartialDate.from(value)
      const current = update[token]?.toString()
      if (current === '') {
        return { value: update }
      }
      if (token === 'YYYY') {
        update[token] = ('000' + current).slice(-4)
      } else update[token] = ('00' + current).slice(-2)
      return { value: update }
    })
  }
  /** helpers */

  private handleKeyInput = (
    token: FormatTokenType,
    update: PartialDate,
    change?: string | undefined
  ): void => {
    if (change === undefined) {
      update[token] = change
    } else if (token === 'aa') {
      update[token] = change
    } else if (/^[0-9]+$/.test(change)) {
      let current = update[token]
      if (current === '' || current === undefined || this._lastInputKeyed !== token) {
        current = change
      } else if (token === 'YYYY') {
        current = (current + change).slice(-4)
      } else {
        current = (current + change).slice(-2)
      }
      this._lastInputKeyed = token
      const asString = current.toString()
      const maxLength = token === 'YYYY' ? 4 : 2
      if (asString.length === maxLength) {
        this._shouldFocusNext = true
      }
      update[token] = asString
    }
  }

  private handleUpdate = (
    event: React.SyntheticEvent,
    token: FormatTokenType,
    type: 'ArrowUp' | 'ArrowDown' | 'Delete' | 'Tab' | 'Key',
    change?: string | undefined
  ): void => {
    event.persist()
    this.setState(({ value }) => {
      const update = PartialDate.from(value)
      switch (type) {
        case 'ArrowUp':
        case 'ArrowDown': {
          arrowValueChange(token, update, type)
          break
        }
        case 'Delete': {
          update[token] = undefined
          break
        }
        case 'Tab': {
          const current = update[token]?.toString()
          if (current === '') {
            break
          } else if (token === 'YYYY') {
            update[token] = ('000' + current).slice(-4)
          } else update[token] = ('00' + current).slice(-2)
          break
        }
        case 'Key': {
          this.handleKeyInput(token, update, change)
          break
        }
      }

      this.raiseChange(event, update)
      return { value: update, focusMonth: update.getMonth(), focusYear: update.getYear() }
    })
  }

  private raiseChange = (event: React.SyntheticEvent<any>, value: PartialDate): void => {
    const { onChange } = this.props
    if (typeof onChange === 'function') {
      this.eventTarget.value = value.toValue()
      const cactusEvent = new CactusChangeEvent(this.eventTarget, event)
      onChange(cactusEvent)
    }
  }

  private _close(returnFocus?: boolean): void {
    const callback = !returnFocus
      ? undefined
      : (): void => {
          this._button.current?.focus()
        }
    this.setState(({ value }) => {
      const newState = { isOpen: false } as DateInputState
      if (value.MM) {
        newState.focusMonth = value.getMonth()
      }
      if (value.YYYY) {
        newState.focusYear = value.getYear()
      }
      return newState
    }, callback)
  }

  private static PHRASES: DateInputPhrasesType = {
    inputKeyboardDirections: '',
    yearLabel: 'year',
    monthLabel: 'month',
    dayLabel: 'day of month',
    hoursLabel: 'hours',
    minutesLabel: 'minutes',
    periodLabel: 'time period',
    pickerLabel: 'Open date picker',
    showCalendar: 'Click to use calendar picker',
    labelDisabled: (date: string) => `${date} can't be selected.`,
  }

  private getPhrases(): DateInputPhrasesType {
    const phrases = { ...DateInputBase.PHRASES, ...this.props.phrases }
    if (this.props.phrases?.ariaDisabledDate) {
      phrases.labelDisabled = this.props.phrases.ariaDisabledDate
    }
    return phrases
  }

  public render(): ReactElement {
    const { value, isOpen } = this.state
    const {
      id,
      name,
      className,
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
      type,
      isValidDate,
      disabled,
      initialFocus,
    } = this.props
    const formatArray = parseFormat(value.getLocaleFormat())
    const formatTime = getLocaleFormat('en-US', { type: 'time' })

    const hasTime = type === 'datetime' || type === 'time'
    const hasDate = type === 'date' || type === 'datetime'
    const phrases = this.getPhrases()
    const timeId = id + '-time'
    const selectedValue = value.isValidDate() ? value.toDate() : null

    return (
      <div onFocus={this.handleFocus} onBlur={this.handleBlur}>
        <Flex alignItems="flex-start" justifyContent="center" flexDirection="column">
          <InputWrapper
            className={className}
            status={this.props.status}
            role="group"
            ref={this._inputWrapper}
            aria-describedby={ariaDescribedBy}
            aria-labelledby={ariaLabelledBy}
            onKeyDownCapture={this.handleKeydownCapture}
            onClick={this.handleClick}
            {...getDataProps(this.props)}
          >
            <InputContent
              id={id}
              name={name}
              disabled={disabled}
              value={value}
              hasDate={hasDate}
              iconRef={this._button}
              phrases={phrases}
              formatArray={formatArray}
              handleButtonClick={this.handleButtonClick}
              handleUpArrowClick={this.handleUpArrowClick}
              handleDownArrowClick={this.handleDownArrowClick}
            />
          </InputWrapper>
        </Flex>
        {hasDate && (
          <CalendarPopup
            anchorRef={this._inputWrapper}
            popupRef={this._portal}
            hidden={!isOpen}
            role="dialog"
            onKeyDown={this.handlePortalKeydown}
          >
            <PopupCalendar
              month={selectedValue ? this.state.focusMonth : undefined}
              year={selectedValue ? this.state.focusYear : undefined}
              value={selectedValue}
              initialFocus={initialFocus}
              onChange={this.handleCalendarChange}
              onMonthChange={this.handleMonthYearChange}
              disabled={disabled}
              name={name}
              isValidDate={isValidDate}
              labels={phrases}
              locale={value.getLocale()}
              ref={this._setPortal}
              tabIndex={-1}
            >
              {hasTime && (
                <Flex justifyContent="center" padding={4}>
                  <DateInput
                    id={timeId}
                    name={timeId}
                    type="time"
                    format={formatTime}
                    value={value.format(formatTime)}
                    onChange={this.handleTimeChange}
                    phrases={phrases}
                  />
                </Flex>
              )}
            </PopupCalendar>
          </CalendarPopup>
        )}
      </div>
    )
  }
}

const InputContent: React.FC<InputContentProps> = ({
  id,
  name,
  disabled,
  value,
  hasDate,
  iconRef,
  phrases,
  formatArray,
  handleButtonClick,
  handleUpArrowClick,
  handleDownArrowClick,
}) => {
  let isFirstInput = true
  return (
    <>
      {hasDate ? (
        <IconButton
          disabled={disabled}
          ref={iconRef}
          onClick={handleButtonClick}
          onTouchStart={handleButtonClick}
          onKeyDown={keyDownAsClick}
          onKeyUp={preventAction}
          label={phrases.pickerLabel}
        >
          <DescriptiveCalendar />
        </IconButton>
      ) : (
        !id.endsWith('-time') && !name.endsWith('-time') && <DescriptiveClock aria-hidden="true" />
      )}
      {formatArray.map((token, index): ReactElement => {
        const key = `${token}-${index}`
        if (isToken(token)) {
          const inputId = isFirstInput ? id : undefined
          isFirstInput = false
          return (
            <input
              disabled={disabled}
              key={key}
              type={token === 'aa' ? 'text' : NUMBER_INPUT_TYPE}
              id={inputId}
              data-token={token}
              aria-label={getInputLabel(token, phrases)}
              placeholder={getInputPlaceholder(token)}
              value={value[token]}
              autoComplete="off"
              onChange={noop}
            />
          )
        }
        return <LiteralPunctuation key={key}>{token}</LiteralPunctuation>
      })}
      <span aria-hidden="true" />
      <ToggleButtons aria-hidden="true">
        <NavigationChevronUp
          data-name="ArrowUp"
          onMouseDownCapture={!disabled ? handleUpArrowClick : undefined}
        />
        <NavigationChevronDown
          data-name="ArrowDown"
          onMouseDownCapture={!disabled ? handleDownArrowClick : undefined}
        />
      </ToggleButtons>
    </>
  )
}

export const DateInput = styled(DateInputBase)`
  ${(p) => p.disabled && colorStyle(p, 'disable')}
  ${(p) =>
    p.disabled &&
    `
    border-color: ${color(p, 'lightGray')};
    cursor: not-allowed;
    & input::placeholder,
    input,
    svg,
    ${IconButton} {
      color: ${color(p, 'mediumGray')};
      cursor: not-allowed;
    }
  `}
  ${margin};
  ${width};
`

export default DateInput
