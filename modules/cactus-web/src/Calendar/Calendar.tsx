import { NavigationChevronLeft, NavigationChevronRight } from '@repay/cactus-icons'
import { colorStyle, radius, shadow } from '@repay/cactus-theme'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import Flex from '../Flex/Flex'
import { isActionKey } from '../helpers/a11y'
import { dateParts, getFormatter } from '../helpers/dates'
import { CactusChangeEvent, CactusEventTarget } from '../helpers/events'
import generateId from '../helpers/generateId'
import { omitProps } from '../helpers/omit'
import IconButton from '../IconButton/IconButton'
import DropDown from './DropDown'
import CalendarGrid, { CalendarGridLabels, CalendarValue, FocusProps, initGridState } from './Grid'
import Slider, { SlideDirection, SliderProps } from './Slider'

interface CalendarNavLabels {
  calendarKeyboardDirections?: React.ReactChild
  prevMonth?: React.ReactChild
  nextMonth?: React.ReactChild
  showMonth?: React.ReactChild
  showYear?: React.ReactChild
  months?: string[]
}

export interface CalendarLabels extends CalendarGridLabels, CalendarNavLabels {}

const DEFAULT_LABELS: CalendarNavLabels = {
  calendarKeyboardDirections: 'Press space to choose the date',
  showMonth: 'Click to change month',
  showYear: 'Click to change year',
  prevMonth: 'Click to go back one month',
  nextMonth: 'Click to go forward one month',
}

type BaseProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultChecked' | 'defaultValue' | 'onChange'
>

export interface MonthChange {
  month: number
  year: number
  isFocusOverflow: boolean
}

interface InnerCalendarProps extends BaseProps, FocusProps {
  value?: CalendarValue
  defaultValue?: CalendarValue
  form?: string
  name?: string
  multiple?: boolean
  disabled?: boolean
  readOnly?: boolean
  onChange?: React.ChangeEventHandler<CactusEventTarget<CalendarValue>>
  onMonthChange?: (change: MonthChange, originalEvent: React.SyntheticEvent) => void
  isValidDate?: (date: Date) => boolean
  labels?: Partial<CalendarLabels>
  locale?: string
}
export type CalendarProps = InnerCalendarProps & MarginProps

interface CalendarState extends SliderProps {
  value: CalendarValue
  month: number
  year: number
}

const memoize = <A extends any[], R>(func: (...a: A) => R): ((...a: A) => R) => {
  let key: A = [] as any
  let result: R = undefined as any
  return (...args: A) => {
    if (args.length === key.length && args.every((k, i) => k === key[i])) {
      return result
    }
    key = args
    result = func(...args)
    return result
  }
}

const initState = (props: InnerCalendarProps): CalendarState => {
  let value: CalendarValue = ''
  if (props.value === undefined && props.defaultValue !== undefined) {
    value = props.defaultValue
    // If we can't tell if it should be `Date` or `string`, default to `string`.
    if (Array.isArray(value) && !value.length) {
      value = ''
    }
  }
  let date: Date
  if (props.year === undefined || props.month === undefined) {
    // Make sure we use the same initialization logic as Grid.
    const { year, month } = initGridState(props.initialFocus)
    date = new Date(props.year ?? year, props.month ?? month, 1)
  } else {
    date = new Date(props.year, props.month, 1)
  }
  return { value, year: date.getFullYear(), month: date.getMonth() }
}

const raiseAsDate = (value: CalendarValue): boolean => {
  if (Array.isArray(value)) {
    value = value[0]
  }
  // Works for `Date` objects or `null`.
  return typeof value === 'object'
}

class CalendarBase extends React.Component<InnerCalendarProps, CalendarState> {
  public static Grid = CalendarGrid

  state = initState(this.props)

  private eventTarget = new CactusEventTarget<CalendarValue>({})

  // Can't track this internal to Grid, because Slider tends to remount it.
  private _lastFocus: string | undefined = undefined
  private setLastFocus = (e: React.FocusEvent<HTMLElement>) => {
    this._lastFocus = e.target.dataset.date
  }

  private rootRef = React.createRef<HTMLDivElement>()
  get rootElement(): HTMLDivElement {
    // Something that should be impossible.
    if (!this.rootRef.current) throw new Error('over 9000')
    return this.rootRef.current
  }

  static getDerivedStateFromProps(
    props: Readonly<InnerCalendarProps>,
    state: CalendarState
  ): Partial<CalendarState> | null {
    let newState: Partial<CalendarState> | null = null
    if (props.value !== undefined) {
      let value = props.value
      // We should never store an empty array internally, because then we can't
      // tell if we're supposed to raise events values as `Date` or `string`.
      if (Array.isArray(value) && !value.length) {
        value = raiseAsDate(state.value) ? null : ''
      }
      if (value !== state.value) {
        newState = { value }
      }
    }
    if (props.year !== undefined && props.year !== state.year) {
      newState = newState || {}
      newState.year = props.year
    }
    // Pass month through `Date` to normalize values outside the range [0, 12).
    if (props.month !== undefined && props.month !== state.month) {
      newState = newState || {}
      const date = new Date(state.year, state.month, 1)
      date.setMonth(props.month)
      newState.month = date.getMonth()
    }
    return newState
  }

  private onReset = (e: Event) => {
    if (this.props.value !== undefined) return
    const form = this.props.form
    const target = e.target as HTMLFormElement
    if (form ? target.id === form : target.contains(this.rootElement)) {
      this.setState(initState(this.props))
    }
  }

  componentDidMount() {
    document.addEventListener('reset', this.onReset)
  }

  componentWillUnmount() {
    document.removeEventListener('reset', this.onReset)
  }

  private setMonthYear = (date: Date, e: React.SyntheticEvent, transState?: SliderProps) => {
    if (date.getMonth() !== this.state.month || date.getFullYear() !== this.state.year) {
      const dateState = { year: date.getFullYear(), month: date.getMonth() }
      this.setState({ ...dateState, ...transState })
      if (this.props.onMonthChange) {
        this.props.onMonthChange({ ...dateState, isFocusOverflow: !transState }, e)
      }
    }
  }

  private setSelectedDate = (e: React.MouseEvent | React.KeyboardEvent) => {
    const target = e.target as HTMLElement
    const isoDate = target.dataset.date
    const disabled = this.props.disabled || target.getAttribute('aria-disabled') === 'true'
    const isAction = (e as React.MouseEvent).button === 0 || isActionKey(e as React.KeyboardEvent)
    if (this.props.readOnly || disabled || !isoDate || !isAction) return

    const value = raiseAsDate(this.state.value) ? new Date(...dateParts(isoDate)) : isoDate
    this.setState({ value })
    if (this.props.onChange) {
      e.persist()
      this.eventTarget.id = this.props.id
      this.eventTarget.name = this.props.name
      this.eventTarget.value = value
      this.props.onChange(new CactusChangeEvent(this.eventTarget, e))
    }
  }

  private handleArrowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const direction = e.currentTarget.name as SlideDirection
    const month = this.state.month + (direction === 'left' ? -1 : 1)
    const next = new Date(this.state.year, month, 1)
    this.setMonthYear(next, e, {
      transition: direction,
      transitionKey: generateId(direction),
    })
  }

  private selectMonth = (month: number, e: React.SyntheticEvent) => {
    const next = new Date(this.state.year, month, 1)
    this.setMonthYear(next, e, {})
  }

  private selectYear = (year: number, e: React.SyntheticEvent) => {
    const next = new Date(year, this.state.month, 1)
    this.setMonthYear(next, e, {})
  }

  render() {
    const {
      month,
      year,
      initialFocus,
      value,
      defaultValue,
      form,
      name,
      multiple = Array.isArray(this.state.value),
      disabled,
      readOnly,
      onChange,
      onMonthChange,
      isValidDate,
      labels = {},
      locale,
      children,
      ...rest
    } = this.props
    return (
      <div aria-label="calendar" {...rest} role="group" aria-disabled={disabled} ref={this.rootRef}>
        <Flex justifyContent="space-between" alignItems="center" padding={4}>
          <IconButton
            name="left"
            iconSize="small"
            onClick={this.handleArrowClick}
            aria-labelledby={this.getLabelId('prevMonth')}
          >
            <NavigationChevronLeft />
          </IconButton>
          <Flex>
            {this.renderMonthDD(locale, labels.months || DEFAULT_LABELS.months)}
            {this.renderYearDD()}
          </Flex>
          <IconButton
            name="right"
            iconSize="small"
            onClick={this.handleArrowClick}
            aria-labelledby={this.getLabelId('nextMonth')}
          >
            <NavigationChevronRight />
          </IconButton>
        </Flex>
        <Slider {...this.state}>
          <CalendarGrid
            month={this.state.month}
            year={this.state.year}
            locale={locale}
            isValidDate={isValidDate}
            selected={this.state.value}
            initialFocus={this._lastFocus || initialFocus}
            labels={labels}
            aria-multiselectable={multiple}
            aria-readonly={readOnly}
            aria-describedby={this.getLabelId('calendarKeyboardDirections')}
            onClick={this.setSelectedDate}
            onKeyDown={this.setSelectedDate}
            onFocusOverflow={this.setMonthYear}
            onBlur={this.setLastFocus}
          />
        </Slider>
        {children}
        {this.renderLabels(labels)}
      </div>
    )
  }

  private getMonthOptions = memoize((locale?: string, monthLabels: string[] = []) => {
    const months = []
    const date = new Date(1984, 0, 1)
    const fmtMonth = getFormatter({ month: 'long' }, locale)
    for (let i = 0; i < 12; date.setMonth(++i)) {
      months.push({ label: monthLabels[i] || fmtMonth(date), value: i })
    }
    return months
  })

  renderMonthDD(locale?: string, labels?: string[]) {
    const options = this.getMonthOptions(locale, labels)
    const month = this.state.month
    return (
      <DropDown
        value={month}
        label={options[month].label}
        options={options}
        onSelectOption={this.selectMonth}
        aria-labelledby={this.getLabelId('showMonth')}
        liveKey={this.state.transitionKey}
      />
    )
  }

  // TODO Infinite scroll?
  private getYearOptions = memoize((thisYear: number) => {
    const endYear = thisYear + 100
    const years = []
    for (let year = thisYear - 99; year < endYear; year++) {
      years.push(year)
    }
    return years
  })

  renderYearDD() {
    const year = this.state.year
    return (
      <DropDown
        label={year}
        value={year}
        options={this.getYearOptions(year)}
        onSelectOption={this.selectYear}
        aria-labelledby={this.getLabelId('showYear')}
        liveKey={this.state.transitionKey}
      />
    )
  }

  private _labelIDs: { [K in keyof CalendarLabels]?: string } = {}
  private getLabelId(label: keyof CalendarLabels) {
    return this._labelIDs[label] || (this._labelIDs[label] = generateId(label))
  }

  renderLabels(labels: CalendarNavLabels) {
    const keys = Object.keys(this._labelIDs) as (keyof CalendarNavLabels)[]
    return (
      <div hidden>
        {keys.map((key) => (
          <div id={this._labelIDs[key]} key={key}>
            {labels[key] || DEFAULT_LABELS[key]}
          </div>
        ))}
      </div>
    )
  }
}

// TODO Disabled styles
export const Calendar = styled(CalendarBase)
  .withConfig(omitProps<CalendarProps>(margin))
  .attrs({ as: CalendarBase })`
  position: relative; /* Necessary for drop-down positioning. */
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  width: 300px;
  ${margin}
  ${colorStyle('standard')};
  border-radius: ${radius(16, 0.6)};
  border-top-left-radius: ${radius(32, 0.6)};
  border-top-right-radius: ${radius(32, 0.6)};
  ${shadow(1, 'lightContrast')};
  overflow: hidden;

  ${CalendarGrid} {
    border-radius: 0;
  }
`

export default Calendar
