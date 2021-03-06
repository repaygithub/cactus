import VisuallyHidden from '@reach/visually-hidden'
import {
  DescriptiveCalendar,
  DescriptiveClock,
  NavigationChevronDown,
  NavigationChevronLeft,
  NavigationChevronRight,
  NavigationChevronUp,
} from '@repay/cactus-icons'
import { BorderSize, ColorStyle, Shape, TextStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { Component, Fragment, MouseEventHandler, ReactElement, useMemo } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled, { css, FlattenSimpleInterpolation } from 'styled-components'
import { compose, margin, MarginProps, width, WidthProps } from 'styled-system'

import Flex from '../Flex/Flex'
import FocusLock from '../FocusLock/FocusLock'
import { isIE } from '../helpers/constants'
import {
  DateType,
  formatDate,
  FormatTokenType,
  getDefaultFormat,
  getLastDayOfMonth,
  isToken,
  parseDate,
  parseFormat,
  PartialDate,
  TOKEN_SETTERS,
} from '../helpers/dates'
import { CactusChangeEvent, CactusEventTarget, CactusFocusEvent } from '../helpers/events'
import generateId from '../helpers/generateId'
import KeyCodes from '../helpers/keyCodes'
import getLocale from '../helpers/locale'
import { getDataProps } from '../helpers/omit'
import { usePositioning } from '../helpers/positionPopover'
import positionPortal from '../helpers/positionPortal'
import { useScrollTrap } from '../helpers/scroll'
import { popupBoxShadow, popupShape, radius, textStyle } from '../helpers/theme'
import IconButton from '../IconButton/IconButton'
import { Status } from '../StatusMessage/StatusMessage'

export type IsValidDateFunc = (date: Date) => boolean
export type ParseDateFunc = (dateStr: string) => Date
export type FormatDateFunc = (date: Date) => string

interface MonthYearDataType {
  month: number
  year: number
  days: PartialDate[]
}
interface PhraseObjType {
  short: string
  long: string
}
interface DateInputPhrasesType {
  months: PhraseObjType[]
  weekdays: PhraseObjType[]
  calendarKeyboardDirections: string
  inputKeyboardDirections: string
  yearLabel: string
  monthLabel: string
  dayLabel: string
  hoursLabel: string
  minutesLabel: string
  periodLabel: string
  pickerLabel: string
  showMonth: string
  showYear: string
  prevMonth: string
  nextMonth: string
  showCalendar: string
  ariaDisabledDate: (date: string) => string
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
const ALLOW_DEFAULT = ['Tab', 'Home', 'PageUp', 'PageDown', 'ArrowLeft', 'ArrowRight']

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
    case 'hh':
    case 'H':
    case 'HH': {
      value.setHours(((value.getHours() % 24) + direction + 24) % 24)
      break
    }
    case 'mm': {
      value.setMinutes(((value.getMinutes() % 60) + direction + 60) % 60)
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
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
  flex-wrap: nowrap;
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

const marginAndWidth = compose(margin, width)

const borderMap: { [K in BorderSize]: ReturnType<typeof css> } = {
  thin: css`
    border: 1px solid;
  `,
  thick: css`
    border: 2px solid;
  `,
}

const getBorder = (borderSize: BorderSize): ReturnType<typeof css> => borderMap[borderSize]

const InputWrapper = styled.div`
  position: relative;
  color: ${(p): string => p.theme.colors.darkContrast};
  box-sizing: border-box;
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  ${(p): ReturnType<typeof css> => getBorder(p.theme.border)}
  border-color: ${(p): string => p.theme.colors.darkestContrast};
  border-radius: ${radius(20)};
  background-color: ${(p): string => p.theme.colors.white};
  height: 36px;
  outline: none;
  overflow: hidden;
  padding: 0 16px 0 12px;
  user-select: none;
  min-width: 106px;
  ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'body')};
  ${marginAndWidth}

  &:focus-within {
    border-color: ${(p): string => p.theme.colors.callToAction};
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
    text-shadow: 0 0 0 ${(p): string => p.theme.colors.darkestContrast};

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
      background-color: ${(p): string => p.theme.colors.transparentCTA};
    }

    &::placeholder {
      color: ${(p): string => p.theme.colors.mediumContrast};
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

const CalendarPopup = styled(BasePopup)`
  display: ${(p) => (p.isOpen ? 'block' : 'none')};
  box-sizing: border-box;
  position: fixed;
  z-index: 1000;
  width: 300px;
  background-color: ${(p): string => p.theme.colors.white};
  ${(p): ReturnType<typeof css> => popupShape('dialog', p.theme.shape)}
  ${(p): ReturnType<typeof css> => popupBoxShadow(p.theme)}
  overflow: hidden;
`

const MonthSelect = styled.button.attrs({ type: 'button' })`
  box-sizing: border-box;
  appearance: none;
  background-color: transparent;
  border: none;
  margin-right: 8px;
  padding: 0;
  ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'h4')};

  &.month {
    color: ${(p) => p.theme.colors.callToAction};
  }

  [data-is-open='month'] {
    transform: rotate3d(1, 0, 0, 180deg);
  }
`

const YearSelect = styled.button.attrs({ type: 'button' })`
  box-sizing: border-box;
  appearance: none;
  background-color: transparent;
  border: none;
  padding: 0;
  ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'h4')};

  &.year {
    color: ${(p) => p.theme.colors.callToAction};
  }

  [data-is-open='year'] {
    transform: rotate3d(1, 0, 0, 180deg);
  }
`

const CalendarDayBase = styled.button.attrs({ type: 'button' })`
  box-sizing: border-box;
  appearance: none;
  background-color: transparent;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%;
  flex: 0 0 40px;
  ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'small')};

  &:focus {
    outline: none;
  }

  &[role='gridcell'] {
    cursor: pointer;
  }

  &[aria-disabled='true'] {
    cursor: default;
    color: ${(p): string => p.theme.colors.mediumContrast};
  }

  &[role='columnheader'] {
    font-weight: 600;
  }

  &.outside-date {
    color: ${(p): string => p.theme.colors.mediumContrast};

    &.selected-date {
      color: ${(p): string => p.theme.colors.darkContrast};
      background-color: ${(p): string => p.theme.colors.transparentCTA};
    }
  }

  &.focused-date {
    background-color: ${(p): string => p.theme.colors.transparentCTA};

    &[aria-disabled='true'] {
      background-color: ${(p): string => p.theme.colors.transparentError};
    }
  }

  &.selected-date:not(.outside-date) {
    background-color: ${(p): string => p.theme.colors.callToAction};
    color: ${(p): string => p.theme.colors.white};
  }

  span {
    pointer-events: none;
  }
`

type CalendarDayProps = {
  as?: React.ComponentProps<typeof CalendarDayBase>['as']
  longLabel: string
} & React.ComponentPropsWithoutRef<'button'>

const CalendarDay = React.forwardRef<HTMLButtonElement, CalendarDayProps>(
  (props, ref): ReactElement => {
    const { children, longLabel, ...rest } = props
    if (rest.role === 'columnheader') {
      rest.as = 'div'
    }
    return (
      <CalendarDayBase {...rest} ref={ref}>
        <VisuallyHidden>{longLabel}</VisuallyHidden>
        <span aria-hidden="true">{children}</span>
      </CalendarDayBase>
    )
  }
)

interface CalendarDayDataType {
  date: InstanceType<typeof PartialDate>
  dateStrId: string
  description: string
  isMonth: boolean
  isDisabled: boolean
}

interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  days: PartialDate[]
  onDayMouseEnter: MouseEventHandler<HTMLButtonElement>
  /** Currently selected date in YYYY-MM-dd */
  selected: string
  /** Currently focused date in YYYY-MM-dd */
  focusDay: string
  focusMonth: number
  isValidDate?: (date: Date) => boolean
  ariaDisabledDate?: DateInputPhrasesType['ariaDisabledDate']
  children?: React.ReactNode
}

function CalendarBase(props: CalendarProps): ReactElement {
  const {
    days,
    focusMonth,
    focusDay,
    selected,
    onDayMouseEnter,
    children,
    isValidDate,
    ariaDisabledDate,
    ...rest
  } = props
  const daysMatrix: CalendarDayDataType[][] = useMemo(
    function (): CalendarDayDataType[][] {
      let weekIndex = 0
      let dayIndex = 0
      const matrix: CalendarDayDataType[][] = []

      for (; weekIndex * 7 < days.length; ++weekIndex) {
        dayIndex = 0
        const weekArr: CalendarDayDataType[] = []
        for (; dayIndex < 7; ++dayIndex) {
          const date = days[weekIndex * 7 + dayIndex]
          const dateStrId = `${date.YYYY}-${date.MM}-${date.dd}`
          const isDisabled = typeof isValidDate === 'function' && !isValidDate(date.toDate())
          let dateDescriptor = date.toLocaleSpoken('date')
          if (isDisabled && ariaDisabledDate) {
            dateDescriptor = ariaDisabledDate(dateDescriptor)
          }
          const mainMonth = focusMonth == date.getMonth()

          weekArr.push({
            date,
            dateStrId,
            description: dateDescriptor,
            isMonth: mainMonth,
            isDisabled,
          })
        }
        matrix.push(weekArr)
      }
      return matrix
    },
    [days, focusMonth, isValidDate, ariaDisabledDate]
  )

  return (
    <div {...rest}>
      {children}
      {daysMatrix.map((week, index): ReactElement => {
        return (
          <div role="row" key={focusMonth + '-' + index}>
            {week.map(({ dateStrId, date, isMonth, description, isDisabled }): ReactElement => {
              const isFocused = dateStrId === focusDay
              const isSelected = dateStrId === selected
              let className = ''
              if (!isMonth) {
                className += ' outside-date'
              }
              if (isSelected) {
                className += ' selected-date'
              }
              if (isFocused) {
                className += ' focused-date'
              }
              return (
                <CalendarDay
                  tabIndex={isFocused ? 0 : -1}
                  className={className}
                  key={dateStrId}
                  role="gridcell"
                  data-date={dateStrId}
                  longLabel={description}
                  aria-disabled={isDisabled ? 'true' : 'false'}
                  onMouseEnter={isMonth && !isDisabled ? onDayMouseEnter : undefined}
                >
                  {date.d}
                </CalendarDay>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

const Calendar = styled(CalendarBase)`
  background-color: ${(p): string => p.theme.colors.lightContrast};
  padding: 0 10px;
  box-sizing: border-box;
  display: inline-block;
  width: 300px;

  > [role='row'] {
    display: flex;
    flex-wrap: nowrap;
  }
`

const transitionTime = isIE ? '350ms' : '300ms'

const CalendarSlideWrapper = styled.div`
  width: 900px;
  position: relative;
  display: inline-block;
  left: -300px;
  background-color: ${(p) => p.theme.colors.lightContrast};

  .middle {
    transform: translateX(300px);
  }

  .left-enter {
    transform: translateX(600px);
  }

  .left-enter-active {
    transform: translateX(300px);
    transition: transform ${transitionTime} ease-out;
  }

  .left-enter-done {
    transform: translateX(300px);
  }

  .left-exit-active {
    transform: translateX(-300px);
    transition: transform ${transitionTime} ease-out;
  }

  .right-enter {
    transform: translateX(0px);
  }

  .right-enter-active {
    transform: translateX(300px);
    transition: transform ${transitionTime} ease-out;
  }

  .right-enter-done {
    transform: translateX(300px);
  }

  .right-exit-active {
    transform: translateX(300px);
    transition: transform ${transitionTime} ease-out;
  }
`

const TimeInputWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  padding: 16px;
`

const monthYearListShapeMap: { [K in Shape]: ReturnType<typeof css> } = {
  square: css`
    border-radius: 0 0 1px 1px;
  `,
  intermediate: css`
    border-radius: 0 0 10px 10px;
  `,
  round: css`
    border-radius: 0 0 16px 16px;
  `,
}

const getMonthYearListShape = (shape: Shape): ReturnType<typeof css> => monthYearListShapeMap[shape]

const MonthYearListScrollTrap: React.FC<{ className?: string }> = (props) => {
  const ref = React.useRef<HTMLDivElement>(null)
  useScrollTrap(ref)
  return <div {...props} ref={ref} />
}

const MonthYearListWrapper = styled(MonthYearListScrollTrap)`
  box-sizing: border-box;
  display: flex;
  height: 240px;
  width: 300px;
  background-color: ${(p): string => p.theme.colors.lightContrast};
  padding: 0;
  justify-content: space-between;
  align-items: start;

  > div {
    height: 100%;
    box-sizing: border-box;
  }

  > div:first-child {
    width: 100%;
  }

  ul {
    overflow-y: scroll;
    position: relative;
    height: 100%;
    list-style: none;
    padding: 0;
    margin: 0;
    outline: none;
    box-sizing: border-box;
    border: 2px solid ${(p): string => p.theme.colors.lightGray};

    &:focus {
      border-color: ${(p): string => p.theme.colors.callToAction};
    }

    ${(p): ReturnType<typeof css> => getMonthYearListShape(p.theme.shape)}
  }

  li {
    margin: 4px 0;
    width: 100%;
    text-align: center;
    cursor: pointer;

    > span {
      padding: 4px;
      border-radius: 4px;
    }

    &:hover > span {
      background-color: ${(p): string => p.theme.colors.transparentCTA};
    }

    &[aria-selected='true'] > span {
      background-color: ${(p): string => p.theme.colors.callToAction};
      color: ${(p): string => p.theme.colors.callToActionText};
    }
  }
`

type Target = CactusEventTarget<Date | string>

export interface DateInputProps
  extends MarginProps,
    WidthProps,
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'disabled' | 'width' | 'value' | 'onChange' | 'onBlur' | 'onFocus'
    > {
  name: string
  id: string
  className?: string
  /** When */
  value?: string | Date | null
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
  phrases?: Partial<Omit<DateInputPhrasesType, 'months' | 'weekdays'>>
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

interface DateInputState {
  value: PartialDate
  locale: string
  type: DateType
  isOpen: false | 'month' | 'year' | 'calendar'
  transitioning: boolean
  calendarKey: string
  slideDirection: 'left' | 'right' | null
  invalidDate: boolean
  // YYYY-MM-dd
  focusDay?: string
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

    const locale = props.locale || getLocale()
    const type = props.type || 'date'
    const format = props.format || getDefaultFormat(type)

    this.state = {
      value: PartialDate.from(props.value, { format, locale, type }),
      type,
      locale,
      isOpen: false,
      transitioning: false,
      invalidDate: false,
      calendarKey: generateId('calendar'),
      slideDirection: null,
    }
  }

  private _shouldFocusNext = false
  private _lastInputKeyed = ''
  private _shouldUpdateFocusDay = false
  private _didClickButton = false
  private _shouldFocusMonthYearList = false

  private _inputWrapper = React.createRef<HTMLDivElement>()
  private _button = React.createRef<HTMLButtonElement>()
  private _portal = React.createRef<HTMLDivElement>()
  private eventTarget = new CactusEventTarget<Date | string>({})

  public static propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
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
    let updates: null | Partial<DateInputState> = null
    if (props.type && props.type !== state.value.getType()) {
      const type = props.type || 'date'
      updates = updates || {}
      updates.type = type
      const format = props.format || getDefaultFormat(type)
      state.value.setType(type, format)
    }
    if (props.locale !== state.locale && typeof props.locale === 'string') {
      updates = updates || {}
      updates.locale = props.locale
      state.value.setLocale(props.locale)
    }
    if (props.value) {
      let value = state.value.clone()

      if (props.value instanceof Date) {
        value = PartialDate.from(props.value, { type: value.getType() })
      } else {
        value.parse(props.value, props.format)
      }
      // only update local value if provided value is a valid date
      if (value.isValid() && !value.equals(state.value)) {
        updates = updates || {}
        updates.value = value
        if (state.isOpen) {
          updates.focusDay = value.format('YYYY-MM-dd')
        }
      }
    }

    return updates
  }

  public componentDidMount(): void {
    this.eventTarget.id = this.props.id
    this.eventTarget.name = this.props.name
    document.body.addEventListener('click', this.handleBodyClick, false)
  }

  public componentDidUpdate(_: DateInputProps, prevState: DateInputState): void {
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
    } else if (this._shouldUpdateFocusDay) {
      const _portal = this._portal.current
      const focusDay = this.state.focusDay
      window.requestAnimationFrame((): void => {
        const toFocus = _portal && _portal.querySelector(`[data-date="${focusDay}"]`)
        // focus on focusDay button if focus is already in portal
        if (toFocus instanceof HTMLButtonElement) {
          toFocus.focus()
        }
      })
      this._shouldUpdateFocusDay = false
    }
    if (this.state.isOpen === 'month' || this.state.isOpen === 'year') {
      window.requestAnimationFrame((): void => {
        const _portal = this._portal.current
        const list = _portal && (_portal.querySelector('[role="listbox"]') as HTMLElement)
        if (list) {
          const activeDescendant = list.getAttribute('aria-activedescendant')
          if (!activeDescendant) return
          const $selected = document.getElementById(activeDescendant)
          if (!$selected) return

          if (list.scrollHeight > list.clientHeight) {
            const scrollBottom = list.clientHeight + list.scrollTop
            const optionBottom = $selected.offsetTop + $selected.offsetHeight
            if (optionBottom > scrollBottom) {
              list.scrollTop = optionBottom - list.clientHeight
            } else if ($selected.offsetTop < list.scrollTop) {
              list.scrollTop = $selected.offsetTop
            }
          }

          if (this._shouldFocusMonthYearList) {
            list.focus()
            this._shouldFocusMonthYearList = false
          }
        }
      })
    }
    const { value, invalidDate } = this.state
    const { onInvalidDate, type } = this.props
    const dateFilled = value.MM && value.dd && value.YYYY
    const timeFilled = value.hh && value.mm && value.aa
    if (
      (type !== 'datetime' && dateFilled && !value.isValid() && !invalidDate) ||
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
    if (prevState.slideDirection !== this.state.slideDirection || this.state.transitioning) {
      this.setState({ calendarKey: generateId('calendar'), transitioning: false })
    }
  }

  public componentWillUnmount(): void {
    document.body.removeEventListener('click', this.handleBodyClick, false)
  }

  /** event handlers */

  private handleBodyClick = (event: MouseEvent): void => {
    const { target } = event
    if (
      !(target instanceof Node) ||
      (!(this._inputWrapper.current && this._inputWrapper.current.contains(target)) &&
        !(this._portal.current && this._portal.current.contains(target)))
    ) {
      this._close(false)
    }
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

  private handleInputCapture = (event: React.CompositionEvent<HTMLDivElement>): void => {
    const target = event.target
    let data = event.data || event.nativeEvent.data
    if (
      this._inputWrapper.current !== null &&
      isOwnInput(target, this._inputWrapper.current) &&
      !event.defaultPrevented &&
      data
    ) {
      data = String(data).substr(-1)
      const token = target.dataset.token as FormatTokenType
      this.handleUpdate(event, token, 'Key', data)
    }
  }

  private handleFocus = (event: React.FocusEvent<HTMLDivElement>): void => {
    const { relatedTarget } = event
    if (this._isOutside(relatedTarget)) {
      const { onFocus } = this.props
      if (typeof onFocus === 'function') {
        const cactusEvent = new CactusFocusEvent('focus', this.eventTarget, event)
        onFocus(cactusEvent)
      }
    }
  }

  private handleBlur = (event: React.FocusEvent<HTMLDivElement>): void => {
    // when blurring off the field
    this._lastInputKeyed = ''
    // double nested because the portal takes one turn to render
    const didClickButton = this._didClickButton
    event.persist()
    window.requestAnimationFrame((): void => {
      if (this._isOutside(document.activeElement) && !didClickButton) {
        const { onBlur } = this.props
        if (typeof onBlur === 'function') {
          this.eventTarget.value = this._convertVal(this.state.value)
          const cactusEvent = new CactusFocusEvent('blur', this.eventTarget, event)
          onBlur(cactusEvent)
        }
      }
    })
  }

  private handleClick = (): void => {
    window.requestAnimationFrame((): void => {
      // if not focusing in portal, try to focus first input
      if (this._didClickButton) {
        const _portal = this._portal.current
        if (_portal !== null) {
          const focusDay = _portal.querySelector('button[data-date][tabindex="0"]')
          if (focusDay instanceof HTMLButtonElement) {
            focusDay.focus()
          }
        }
        this._didClickButton = false
      } else {
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
      }
    })
  }

  private handleSelectMonthClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    this.togglePortalView('month')
    if (event.detail === 0) {
      this._shouldFocusMonthYearList = true
    }
    event.stopPropagation()
  }

  private handleSelectYearClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    this.togglePortalView('year')
    if (event.detail === 0) {
      this._shouldFocusMonthYearList = true
    }
    event.stopPropagation()
  }

  private handleButtonClick = (): void => {
    this._open()
    this._didClickButton = true
  }

  private handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (event.keyCode === KeyCodes.SPACE) {
      this._didClickButton = true
    }
  }

  private handleCalendarClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    const { target } = event
    if (
      target instanceof HTMLButtonElement &&
      target.dataset.date &&
      target.getAttribute('aria-disabled') === 'false'
    ) {
      const dateStr = target.dataset.date
      const { type } = this.props
      event.persist()
      this.setState((state): Pick<DateInputState, 'value' | 'isOpen' | 'focusDay'> => {
        const value = state.value.clone()
        value.parse(dateStr, 'YYYY-MM-dd')
        this.raiseChange(event, value)
        const updates: Pick<DateInputState, 'value' | 'focusDay' | 'isOpen'> = {
          value,
          focusDay: undefined,
          isOpen: false,
        }
        if (type === 'time' || type === 'datetime') {
          updates.isOpen = state.isOpen
          updates.focusDay = dateStr
        }
        return updates
      })
      if (type === 'date') {
        this._close(true)
      }
    }
  }

  private handleDayMouseEnter = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const { currentTarget } = event
    if (currentTarget.getAttribute('aria-disabled') === 'true') return
    // @ts-ignore
    const focusDay = currentTarget.dataset.date as string
    this.setState({ focusDay })
  }

  private handleCalendarKeydownCapture = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const { key, shiftKey } = event
    let adjustment: { which: 'day' | 'week' | 'month' | 'year'; by: number } | undefined = undefined
    switch (key) {
      case 'ArrowRight':
      case 'ArrowLeft': {
        adjustment = { which: 'day', by: key === 'ArrowRight' ? 1 : -1 }
        break
      }
      case 'ArrowUp':
      case 'ArrowDown': {
        adjustment = { which: 'day', by: key === 'ArrowUp' ? -7 : 7 }
        break
      }
      case 'PageUp':
      case 'PageDown': {
        if (shiftKey) {
          adjustment = { which: 'year', by: key === 'PageUp' ? -1 : 1 }
        } else {
          adjustment = { which: 'month', by: key === 'PageUp' ? -1 : 1 }
        }
        break
      }
      case 'Home':
      case 'End': {
        adjustment = { which: 'week', by: key === 'Home' ? 0 : 6 }
        break
      }
    }

    if (adjustment !== undefined) {
      const { which, by } = adjustment
      this.setState(({ focusDay }): Pick<DateInputState, 'focusDay'> => {
        const newDay = parseDate(focusDay as string, 'YYYY-MM-dd')
        if (which === 'day') {
          newDay.setDate(newDay.getDate() + by)
        } else if (which === 'week') {
          newDay.setDate(newDay.getDate() + by - newDay.getDay())
        } else if (which === 'month') {
          newDay.setMonth(newDay.getMonth() + by)
        } else if (which === 'year') {
          newDay.setFullYear(newDay.getFullYear() + by)
        }
        this._shouldUpdateFocusDay = true
        return { focusDay: formatDate(newDay, 'YYYY-MM-dd') }
      })
      event.stopPropagation()
      event.preventDefault()
    }
  }

  private handlePortalKeydownCapture = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape') {
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

  private handleListClick = (event: React.MouseEvent<HTMLUListElement>): void => {
    const { currentTarget } = event
    let { target } = event
    if (target instanceof HTMLSpanElement) {
      // @ts-ignore
      target = target.closest('li')
    }
    if (target instanceof HTMLLIElement) {
      const name = currentTarget.dataset.name as 'setYear' | 'setMonth'
      const optionValue = Number(target.dataset.value)
      const list = target.closest('ul')
      const token = list?.getAttribute('data-token') as FormatTokenType
      const { value } = this.state
      if (name === 'setMonth' && !value.isValid() && token) {
        this.handleUpdate(event, token, 'Key', String(optionValue + 1))
      } else if (name === 'setYear' && !value.isValid() && token) {
        this.handleUpdate(event, token, 'Key', String(optionValue))
      } else {
        this.setState((prevState): Pick<DateInputState, 'focusDay' | 'value'> => {
          const { value: prevValue } = prevState
          const pd = PartialDate.from(prevValue, 'YYYY-MM-dd')
          pd[name](optionValue)
          pd.ensureDayOfMonth()
          this.raiseChange(event, pd)
          return { focusDay: pd.format(), value: pd }
        })
      }
      this.togglePortalView('calendar')
      event.stopPropagation()
    }
  }

  private handleListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>): void => {
    const { key, currentTarget } = event
    let wasHandled = false
    if (key === 'ArrowUp' || key === 'ArrowDown') {
      wasHandled = true
      // in month year view, the direction is reversed from inputs
      this.handleUpdate(
        event,
        currentTarget.dataset.token as 'YYYY' | 'MM',
        key === 'ArrowUp' ? 'ArrowDown' : 'ArrowUp'
      )
    } else if (key === ' ' || key === 'Enter') {
      wasHandled = true
      this.togglePortalView('calendar')
    }
    if (wasHandled) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  private handleLeftMonthArrowClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const { month: focusMonth, year: focusYear } = this._getMonthData()
    this.setState(
      (state): Pick<DateInputState, 'focusDay' | 'value' | 'transitioning' | 'slideDirection'> => {
        const { value } = state
        const pd = PartialDate.from(value, 'YYYY-MM-dd')
        pd.setMonth(focusMonth === 0 ? 11 : focusMonth - 1)
        if (focusMonth === 0) {
          pd.setYear(focusYear - 1)
        }
        pd.ensureDayOfMonth()
        this.raiseChange(event, pd)
        return {
          focusDay: pd.format(),
          value: pd,
          transitioning: true,
          slideDirection: 'right',
        }
      }
    )
  }

  private handleRightMonthArrowClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const { month: focusMonth, year: focusYear } = this._getMonthData()
    this.setState(
      (state): Pick<DateInputState, 'focusDay' | 'value' | 'transitioning' | 'slideDirection'> => {
        const { value } = state
        const pd = PartialDate.from(value, 'YYYY-MM-dd')
        pd.setMonth(focusMonth === 11 ? 0 : focusMonth + 1)
        if (focusMonth === 11) {
          pd.setYear(focusYear + 1)
        }
        pd.ensureDayOfMonth()
        this.raiseChange(event, pd)
        return {
          focusDay: pd.format(),
          value: pd,
          transitioning: true,
          slideDirection: 'left',
        }
      }
    )
  }

  private handleTimeChange = (event: React.ChangeEvent<Target>): void => {
    const time = event.target.value
    if (typeof time === 'string' && time !== '') {
      event.persist()
      this.setState(({ value }): Pick<DateInputState, 'value'> => {
        const update = value.clone()
        update.parse(time, 'HH:mm')
        this.raiseChange(event, update)
        return { value: update }
      })
    }
  }

  /** helpers */

  private handleUpdate = (
    event: React.SyntheticEvent,
    token: FormatTokenType,
    type: 'ArrowUp' | 'ArrowDown' | 'Delete' | 'Key',
    change?: string | undefined
  ): void => {
    event.persist()
    this.setState(({ value, isOpen, focusDay }): Pick<DateInputState, 'value' | 'focusDay'> => {
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
        case 'Key': {
          if (change === undefined) {
            update[token] = change
          } else if (token === 'aa') {
            update[token] = change
          } else if (/^[0-9]+$/.test(change)) {
            let current = update[token]
            const asNum = Number(change)
            if (current === '' || current === undefined || this._lastInputKeyed !== token) {
              current = asNum
            } else {
              current = Number(current)
              const together = current * 10 + asNum
              if (token === 'YYYY') {
                // years
                if (together < 10000) {
                  current = together
                } else {
                  current = asNum
                }
              } else if (/M{1,2}/.test(token)) {
                current = together < 13 ? together : asNum
              } else if (/d{1,2}/.test(token)) {
                current = together % 32 === together ? together : asNum
              } else if (/h{1,2}/i.test(token)) {
                // hours
                const military = token === 'HH' || token === 'H'
                const max = military ? 23 : 12
                current = together <= max ? together : asNum
              } else if (/m{1,2}/.test(token)) {
                // minutes
                const mod = (current % 10) * 10 + asNum
                if (together <= 59) {
                  current = together
                } else if (mod <= 59) {
                  current = mod
                } else {
                  current = asNum
                }
              }
            }
            this._lastInputKeyed = token
            const asString = current.toString()
            const maxLength = token === 'YYYY' ? 4 : 2
            if (asString.length === maxLength) {
              this._shouldFocusNext = true
            }
            update[token] = asString
          }
          break
        }
      }

      this.raiseChange(event, update)
      if (isOpen !== false) {
        focusDay = update.format('YYYY-MM-dd')
      }
      return { value: update, focusDay }
    })
  }

  private raiseChange = (event: React.SyntheticEvent<any>, value: PartialDate): void => {
    const { onChange } = this.props
    if (typeof onChange === 'function') {
      this.eventTarget.value = this._convertVal(value)
      const cactusEvent = new CactusChangeEvent(this.eventTarget, event)
      onChange(cactusEvent)
    }
  }

  private _open(): void {
    this.setState(({ value }): Pick<DateInputState, 'isOpen' | 'focusDay'> => {
      let focusDay: string
      if (value.isValid()) {
        focusDay = `${value.YYYY}-${value.MM}-${value.dd}`
      } else {
        const pd = PartialDate.from(new Date(), 'YYYY-MM-dd')
        if (value.MM) {
          pd.setMonth(Number(value.MM) - 1)
        }
        if (value.dd) {
          pd.setDate(Number(value.dd))
        }
        if (value.YYYY) {
          pd.setYear(Number(value.YYYY))
        }
        focusDay = pd.format()
      }
      return {
        isOpen: 'calendar',
        focusDay,
      }
    })
  }

  private _close(returnFocus?: boolean): void {
    this.setState({ isOpen: false, focusDay: undefined, slideDirection: null }, (): void => {
      if (returnFocus && this._button.current !== null) {
        this._button.current.focus()
      }
    })
  }

  private _convertVal(value: PartialDate): Date | string {
    const providedValue = this.props.value
    const isExpectingDate = providedValue === null || providedValue instanceof Date
    if (value.isValid()) {
      return isExpectingDate ? value.toDate() : value.format()
    } else {
      return isExpectingDate ? new Date(NaN) : ''
    }
  }

  private _isOutside(el?: null | EventTarget): boolean {
    const _input = this._inputWrapper.current
    const _portal = this._portal.current
    return (
      !(el instanceof Node) ||
      !_input ||
      !_input.contains(el) ||
      (this.state.isOpen && (!_portal || !_portal.contains(el)))
    )
  }

  private togglePortalView(triggerType: 'month' | 'year' | 'calendar'): void {
    this.setState((): Pick<DateInputState, 'isOpen'> => {
      const updates: Pick<DateInputState, 'isOpen'> = { isOpen: triggerType }
      this._shouldUpdateFocusDay = triggerType === 'calendar'
      return updates
    })
  }

  private _pickerMonthCacheKey = ''
  private _pickerMonthCache: MonthYearDataType | null = null
  private _getMonthData(): MonthYearDataType {
    const { value, focusDay } = this.state
    const focusPartialDate = PartialDate.from(focusDay || value, 'YYYY-MM-dd')
    const year = focusPartialDate.getYear()
    const month = focusPartialDate.getMonth()
    const pickerMonth = `${year}-${month}`

    if (this._pickerMonthCacheKey !== pickerMonth || !this._pickerMonthCache) {
      this._pickerMonthCacheKey = pickerMonth
      const firstOfMonth = new Date(year, month, 1, 0, 0, 0, 0)
      const firstDay = firstOfMonth.getDay()
      const lastDayOfMonth = getLastDayOfMonth(month, year)
      const showSixWeeks = firstDay + lastDayOfMonth >= 35
      const days: unknown[] = Array(showSixWeeks ? 42 : 35).fill(0)
      const calendarDate = new Date(year, month, -(firstDay - 1), 0, 0, 0, 0)
      for (let i = 0; i < days.length; ++i) {
        const dateInt = calendarDate.getDate()
        days[i] = PartialDate.from(calendarDate)
        calendarDate.setDate(dateInt + 1)
      }

      this._pickerMonthCache = { month, year, days: days as PartialDate[] }
    }
    return this._pickerMonthCache
  }

  private phrasesCacheKey = ''
  private phrasesCache: DateInputPhrasesType | undefined

  private getPhrases(): DateInputPhrasesType {
    const locale = this.state.locale
    if (this.phrasesCacheKey !== locale || !this.phrasesCache) {
      const monthOnlyFmt = new Intl.DateTimeFormat(locale, { month: 'long' })
      const monthOnlyFmtShort = new Intl.DateTimeFormat(locale, { month: 'short' })
      const months = []
      let testDate = new Date(2018, 0, 1, 0, 0, 0)
      let month = 0
      do {
        testDate.setMonth(month)
        months.push({
          long: monthOnlyFmt.format(testDate).replace('\u200e', ''),
          short: monthOnlyFmtShort.format(testDate).replace('\u200e', ''),
        })
      } while (++month < 12)
      // get weekday names
      const weekdayOnlyFmt = new Intl.DateTimeFormat(locale, { weekday: 'long' })
      const weekdayOnlyFmtShort = new Intl.DateTimeFormat(locale, { weekday: 'short' })
      const weekdays = []
      testDate = new Date(2018, 0, 1, 0, 0, 0)
      testDate.setDate(testDate.getDate() - testDate.getDay() - 1)
      let dayOfWeek = 0
      do {
        testDate.setDate(testDate.getDate() + 1)
        weekdays.push({
          long: weekdayOnlyFmt.format(testDate),
          short: weekdayOnlyFmtShort.format(testDate).slice(0, 2),
        })
      } while (++dayOfWeek < 7)

      this.phrasesCache = {
        calendarKeyboardDirections: 'Press space to choose the date.',
        inputKeyboardDirections: '',
        yearLabel: 'year',
        monthLabel: 'month',
        dayLabel: 'day of month',
        hoursLabel: 'hours',
        minutesLabel: 'minutes',
        periodLabel: 'time period',
        pickerLabel: 'Open date picker',
        showMonth: 'Click to change month',
        showYear: 'Click to change year',
        prevMonth: 'Click to go back one month',
        nextMonth: 'Click to go forward one month',
        showCalendar: 'Click to use calendar picker',
        ariaDisabledDate: function (date): string {
          return `${date} can't be selected.`
        },
        ...this.props.phrases,
        months,
        weekdays,
      }
    }

    return this.phrasesCache
  }

  private _yearList: number[] = []
  private getYears(): number[] {
    if (this._yearList.length) {
      return this._yearList
    }
    const currentYear = new Date().getFullYear()
    const result: number[] = [currentYear]
    for (let i = 1; i < 100; ++i) {
      result.unshift(currentYear - i)
      result.push(currentYear + i)
    }

    return (this._yearList = result)
  }

  public render(): ReactElement {
    const { value, isOpen, focusDay } = this.state
    const {
      id,
      name,
      className,
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
      type,
      isValidDate,
      disabled,
    } = this.props
    const formatArray = parseFormat(value.getLocaleFormat())
    let isFirstInput = true
    const hasTime = type === 'datetime' || type === 'time'
    const hasDate = type === 'date' || type === 'datetime'
    const phrases = this.getPhrases()

    const currentMonthId = id + '-month-label'
    const currentYearId = id + '-year-label'
    const timeId = id + '-time'
    const { month: focusMonth, year: focusYear, days } = this._getMonthData()
    const selectedStr = value.format('YYYY-MM-dd')

    return (
      <Fragment>
        <Flex alignItems="flex-start" justifyContent="center" flexDirection="column">
          <InputWrapper
            className={className}
            role="group"
            ref={this._inputWrapper}
            aria-describedby={ariaDescribedBy}
            aria-labelledby={ariaLabelledBy}
            onKeyDownCapture={this.handleKeydownCapture}
            onInputCapture={this.handleInputCapture}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onClick={this.handleClick}
            {...getDataProps(this.props)}
          >
            {hasDate ? (
              <IconButton
                disabled={disabled}
                ref={this._button}
                onClick={!disabled ? this.handleButtonClick : undefined}
                onTouchStart={!disabled ? this.handleButtonClick : undefined}
                onKeyDown={!disabled ? this.handleButtonKeyDown : undefined}
                label={phrases.pickerLabel}
              >
                <DescriptiveCalendar />
              </IconButton>
            ) : (
              !id.endsWith('-time') &&
              !name.endsWith('-time') && <DescriptiveClock aria-hidden="true" />
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
                onMouseDownCapture={!disabled ? this.handleUpArrowClick : undefined}
              />
              <NavigationChevronDown
                data-name="ArrowDown"
                onMouseDownCapture={!disabled ? this.handleDownArrowClick : undefined}
              />
            </ToggleButtons>
          </InputWrapper>
        </Flex>
        {hasDate && (
          <CalendarPopup
            anchorRef={this._inputWrapper}
            popupRef={this._portal}
            isOpen={!!isOpen}
            role="dialog"
            aria-labelledby={`${currentMonthId} ${currentYearId}`}
            onKeyDownCapture={this.handlePortalKeydownCapture}
          >
            <div onClick={this.handleCalendarClick}>
              <Flex justifyContent="space-between" alignItems="center" padding={4}>
                <IconButton
                  label={phrases.prevMonth}
                  aria-roledescription="moves date back one month"
                  iconSize="small"
                  onClick={this.handleLeftMonthArrowClick}
                  tabIndex={isOpen === 'month' || isOpen === 'year' ? -1 : 0}
                >
                  <NavigationChevronLeft />
                </IconButton>
                <Flex justifyContent="center" alignItems="center">
                  <MonthSelect
                    className={isOpen || undefined}
                    tabIndex={0}
                    onClick={this.handleSelectMonthClick}
                    aria-label={isOpen === 'calendar' ? phrases.showMonth : phrases.showCalendar}
                    aria-roledescription="toggles between calendar and month selectors"
                  >
                    <span id={currentMonthId}>
                      {phrases.months[focusMonth]
                        ? phrases.months[focusMonth].long
                        : phrases.months[PartialDate.from(new Date()).getMonth()].long}
                    </span>
                    <NavigationChevronDown data-is-open={isOpen} iconSize="tiny" ml={3} />
                  </MonthSelect>
                  <YearSelect
                    className={isOpen || undefined}
                    tabIndex={isOpen === 'month' ? -1 : 0}
                    onClick={this.handleSelectYearClick}
                    aria-label={isOpen === 'calendar' ? phrases.showYear : phrases.showCalendar}
                    aria-roledescription="toggles between calendar and year selectors"
                  >
                    <span id={currentYearId}>{focusYear}</span>
                    <NavigationChevronDown data-is-open={isOpen} iconSize="tiny" ml={3} />
                  </YearSelect>
                </Flex>
                <IconButton
                  label={phrases.nextMonth}
                  aria-roledescription="moves date forward one month"
                  iconSize="small"
                  onClick={this.handleRightMonthArrowClick}
                  tabIndex={isOpen === 'month' || isOpen === 'year' ? -1 : 0}
                >
                  <NavigationChevronRight />
                </IconButton>
              </Flex>
              {isOpen === 'calendar' ? (
                <Fragment>
                  <CalendarSlideWrapper>
                    <TransitionGroup className="calendar-transition-group">
                      <CSSTransition
                        key={this.state.calendarKey}
                        timeout={isIE ? 400 : 200}
                        classNames={this.state.slideDirection || 'left'}
                      >
                        <Calendar
                          className={!this.state.transitioning ? 'middle' : undefined}
                          role="grid"
                          onKeyDownCapture={this.handleCalendarKeydownCapture}
                          aria-roledescription={phrases.calendarKeyboardDirections}
                          days={days}
                          ariaDisabledDate={phrases.ariaDisabledDate}
                          focusMonth={focusMonth}
                          focusDay={focusDay || ''}
                          selected={selectedStr}
                          onDayMouseEnter={this.handleDayMouseEnter}
                          isValidDate={isValidDate}
                        >
                          <div role="row">
                            {phrases.weekdays.map(
                              (weekday): ReactElement => (
                                <CalendarDay
                                  key={weekday.long}
                                  role="columnheader"
                                  longLabel={weekday.long}
                                >
                                  {weekday.short}
                                </CalendarDay>
                              )
                            )}
                          </div>
                        </Calendar>
                      </CSSTransition>
                    </TransitionGroup>
                  </CalendarSlideWrapper>

                  {hasTime && (
                    <TimeInputWrapper>
                      <DateInput
                        id={timeId}
                        name={timeId}
                        type="time"
                        format="HH:mm"
                        value={value.format('HH:mm')}
                        onChange={this.handleTimeChange}
                        phrases={phrases}
                      />
                    </TimeInputWrapper>
                  )}
                </Fragment>
              ) : (
                <MonthYearListWrapper>
                  {isOpen === 'month' ? (
                    <div>
                      {((): ReactElement => {
                        const monthList: React.ReactNodeArray = []
                        let activeDescendant = ''

                        for (let monthIndex = 0; monthIndex < phrases.months.length; ++monthIndex) {
                          const monthPhrase = phrases.months[monthIndex]
                          const monthId = `${id}-${monthPhrase.long}`
                          const isSelected = monthIndex === focusMonth
                          if (isSelected) {
                            activeDescendant = monthId
                          }
                          monthList.push(
                            <li
                              key={monthId}
                              id={monthId}
                              role="option"
                              data-value={monthIndex}
                              aria-selected={isSelected ? 'true' : undefined}
                            >
                              <span>{monthPhrase.long}</span>
                            </li>
                          )
                        }

                        return (
                          <ul
                            tabIndex={0}
                            role="listbox"
                            aria-activedescendant={activeDescendant}
                            aria-label="Select a month"
                            data-name="setMonth"
                            data-token="MM"
                            onClick={this.handleListClick}
                            onKeyDownCapture={this.handleListKeyDown}
                          >
                            {monthList}
                          </ul>
                        )
                      })()}
                    </div>
                  ) : (
                    <div>
                      {((): ReactElement => {
                        const yearList: React.ReactNodeArray = []
                        let activeDescendant = ''
                        const years = this.getYears()

                        for (const year of years) {
                          const yearId = `${id}-${year}`
                          const isSelected = year === focusYear
                          if (isSelected) {
                            activeDescendant = yearId
                          }
                          yearList.push(
                            <li
                              key={yearId}
                              id={yearId}
                              role="option"
                              data-value={year}
                              aria-selected={isSelected ? 'true' : undefined}
                            >
                              <span>{year}</span>
                            </li>
                          )
                        }

                        return (
                          <ul
                            tabIndex={0}
                            role="listbox"
                            aria-activedescendant={activeDescendant}
                            aria-label="Select a year"
                            data-name="setYear"
                            data-token="YYYY"
                            onClick={this.handleListClick}
                            onKeyDownCapture={this.handleListKeyDown}
                          >
                            {yearList}
                          </ul>
                        )
                      })()}
                    </div>
                  )}
                </MonthYearListWrapper>
              )}
            </div>
          </CalendarPopup>
        )}
      </Fragment>
    )
  }
}

export const DateInput = styled(DateInputBase)`
  ${(p): ColorStyle | string => (p.disabled ? p.theme.colorStyles.disable : '')};
  border-color: ${(p) => p.disabled && p.theme.colors.lightGray};
  cursor: ${(p) => p.disabled && 'not-allowed'};
  & input::placeholder,
  input,
  svg,
  ${IconButton} {
    color: ${(p) => p.disabled && p.theme.colors.mediumGray};
    cursor: ${(p) => p.disabled && 'not-allowed'};
  }
  ${margin};
  ${width};
`

export default DateInput
