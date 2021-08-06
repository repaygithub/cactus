import { NavigationChevronLeft, NavigationChevronRight } from '@repay/cactus-icons'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import Flex from '../Flex/Flex'
import { getFormatter } from '../helpers/dates'
import { CactusChangeEvent, CactusEventTarget } from '../helpers/events'
import { getCurrentFocusIndex } from '../helpers/focus'
import IconButton from '../IconButton/IconButton'
import DropDown from './DropDown'
import CalendarGrid, {
  CalendarDate,
  CalendarGridLabels,
  CalendarValue,
  dateParts,
  INSIDE_DATE,
  queryDate,
  toISODate,
} from './Grid'

type BaseProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultChecked' | 'defaultValue' | 'onChange'
>

interface CalendarLabels extends CalendarGridLabels {
  prevMonth: string
  nextMonth: string
  showMonth: string
  showYear: string
  months?: string[]
}

const DEFAULT_LABELS: CalendarLabels = {
  showMonth: 'Click to change month',
  showYear: 'Click to change year',
  prevMonth: 'Click to go back one month',
  nextMonth: 'Click to go forward one month',
  labelDisabled: (d: string) => `${d} can't be selected`,
}

interface CalendarProps extends MarginProps, BaseProps {
  initialFocus?: CalendarDate
  value?: CalendarValue
  defaultValue?: CalendarValue
  form?: string
  name?: string
  multiple?: boolean
  disabled?: boolean
  readOnly?: boolean
  onChange?: React.ChangeEventHandler<CactusEventTarget<CalendarValue>>
  onMonthChange?: (month: number) => void
  onYearChange?: (year: number) => void
  isValidDate?: (date: Date) => boolean
  labels?: Partial<CalendarLabels>
  locale?: string
  children?: never
}

interface CalendarState {
  value: CalendarValue
  focusDate: Date
}

const memoize = <A extends any[], R>(func: (...a: A) => R): ((...a: A) => R) => {
  let key: A = [] as any
  let result: R = undefined as any
  return (...args: A) => {
    if (args.every((k, i) => k === key[i])) {
      return result
    }
    key = args
    return (result = func(...args))
  }
}

const initState = (props: CalendarProps): CalendarState => {
  const state: CalendarState = { value: '', focusDate: new Date() }
  if (props.value === undefined && props.defaultValue !== undefined) {
    state.value = props.defaultValue
    if (Array.isArray(state.value) && !state.value.length) {
      state.value = ''
    }
  }
  if (typeof props.initialFocus === 'object') {
    state.focusDate = new Date(props.initialFocus)
  } else if (props.initialFocus) {
    state.focusDate = new Date(...dateParts(props.initialFocus))
  }
  return state
}

const raiseAsDate = (value: CalendarValue): boolean => {
  if (Array.isArray(value)) {
    value = value[0]
  }
  return typeof value === 'object'
}

class CalenderBase extends React.Component<CalendarProps, CalendarState> {
  public static Grid = CalendarGrid

  state = initState(this.props)

  private eventTarget = new CactusEventTarget<CalendarValue>({})
  private rootRef = React.createRef<HTMLDivElement>()

  get rootElement(): HTMLDivElement {
    if (!this.rootRef.current) throw new Error('over 9000')
    return this.rootRef.current
  }

  private getMonthOptions = memoize((locale?: string, monthLabels?: string[]) => {
    if (!monthLabels) {
      monthLabels = []
      const fmtMonth = getFormatter({ month: 'long' }, locale)
      const date = new Date(1984, 0, 1)
      for (let i = 0; i < 12; date.setMonth(++i)) {
        monthLabels.push(fmtMonth(date))
      }
    }
    return monthLabels.map((label, ix) => ({ label, value: ix }))
  })

  // TODO Infinite scroll?
  private getYearOptions = memoize((thisYear: number) => {
    const endYear = thisYear + 100
    const years = []
    for (let year = thisYear - 99; year < endYear; year++) {
      years.push(year)
    }
    return years
  })

  static getDerivedStateFromProps(
    props: Readonly<CalendarProps>,
    state: CalendarState
  ): Partial<CalendarState> | null {
    if (props.value !== undefined) {
      let value = props.value
      if (Array.isArray(value) && !value.length) {
        value = raiseAsDate(state.value) ? null : ''
      }
      if (value !== state.value) {
        return { value }
      }
    }
    return null
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

  componentDidUpdate(props: Readonly<CalendarProps>, state: Readonly<CalendarState>) {
    // TODO Are there situations where the month/year might change
    // and we need to set a tabIndex without actually focusing?
    if (state.focusDate !== this.state.focusDate) {
      const newMonth = this.state.focusDate.getMonth()
      if (state.focusDate.getMonth() !== newMonth) {
        this.props.onMonthChange?.(newMonth)
      }
      const newYear = this.state.focusDate.getFullYear()
      if (state.focusDate.getFullYear() !== newYear) {
        this.props.onYearChange?.(newYear)
      }
      queryDate(this.rootElement, toISODate(this.state.focusDate))?.focus()
    }
  }

  private setFocusDate(date: Date) {
    this.setState(({ focusDate }) => {
      if (
        date.getMonth() !== focusDate.getMonth() ||
        date.getFullYear() !== focusDate.getFullYear()
      ) {
        return { focusDate: date }
      }
      return null
    })
  }

  private setSelectedDate = (e: React.SyntheticEvent) => {
    // TODO Support multiple, eventually.
    const target = e.target as HTMLElement
    const isoDate = target.dataset.date
    const disabled = this.props.disabled || target.getAttribute('aria-disabled') === 'true'
    if (disabled || this.props.readOnly || !isoDate) return

    const value = raiseAsDate(this.state.value) ? new Date(...dateParts(isoDate)) : isoDate
    this.raiseChange({ value }, e)
  }

  private raiseChange(newState: { value: CalendarValue }, e: React.SyntheticEvent) {
    this.setState(newState)
    if (this.props.onChange) {
      this.eventTarget.id = this.props.id
      this.eventTarget.name = this.props.name
      this.eventTarget.value = newState.value
      this.props.onChange(new CactusChangeEvent(this.eventTarget, e))
    }
  }

  private handleArrowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const direction = e.currentTarget.name as 'left' | 'right'
    const next = new Date(this.state.focusDate)
    next.setMonth(next.getMonth() + (direction === 'left' ? -1 : 1))
    this.handleMonthYearChange(next, e, direction)
  }

  private selectMonth = (month: number, e: React.SyntheticEvent) => {
    const next = new Date(this.state.focusDate)
    next.setMonth(month)
    this.handleMonthYearChange(next, e)
  }

  private selectYear = (year: number, e: React.SyntheticEvent) => {
    const next = new Date(this.state.focusDate)
    next.setFullYear(year)
    this.handleMonthYearChange(next, e)
  }

  private handleMonthYearChange(
    next: Date,
    e: React.SyntheticEvent,
    transition?: 'left' | 'right'
  ) {
    const { value, focusDate } = this.state
    const month = next.getMonth()
    if (month === focusDate.getMonth() && next.getFullYear() === focusDate.getFullYear()) return

    let day = focusDate.getDate()
    let updateValue = false
    if (value && !Array.isArray(value)) {
      updateValue = !this.props.readOnly
      if (typeof value === 'string') {
        day = dateParts(value)[2]
      } else {
        day = value.getDate()
      }
    } else {
      // Focus/blur events fire before click, so the grid should have a single tab-able element.
      const elem = this.rootElement.querySelector<HTMLElement>('[role="grid"] [tabindex="0"]')
      if (elem?.dataset.date) {
        day = dateParts(elem.dataset.date)[2]
      }
    }
    next.setDate(day)
    // If setting the date overflowed the month, clamp to the last day of the month.
    if (month !== next.getMonth()) {
      next.setDate(0)
    }
    // TODO Transitions
    const newState = { focusDate: next, value }
    if (updateValue) {
      // TODO Make sure the date is enabled
      newState.value = raiseAsDate(value) ? next : toISODate(next)
      this.raiseChange(newState, e)
    } else {
      this.setState(newState)
    }
  }

  private setGridFocus(shift: number, type: 'day' | 'month' | 'year' | 'weekday') {
    const dates = Array.from(this.rootElement.querySelectorAll<HTMLElement>(INSIDE_DATE))
    const index = getCurrentFocusIndex(dates, 0)
    // The INSIDE_DATE query guarantees it has a `data-date` attribute.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const date = new Date(...dateParts(dates[index].dataset.date!))
    const month = date.getMonth()
    const year = date.getFullYear()
    if (type === 'day') {
      date.setDate(date.getDate() + shift)
    } else if (type === 'month') {
      date.setMonth(month + shift)
    } else if (type === 'year') {
      date.setFullYear(year + shift)
    } else {
      // type === 'weekday'
      date.setDate(date.getDate() + shift - date.getDay())
    }
    // Only set the focusDate when the month/year changes, otherwise manage focus internally.
    if (date.getMonth() !== month || date.getFullYear() !== year) {
      this.setFocusDate(date)
    } else {
      dates[date.getDate() - 1].focus()
    }
  }

  private onGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!(e.target as HTMLElement).dataset.date) return

    switch (e.key) {
      case 'ArrowLeft':
        this.setGridFocus(-1, 'day')
        break
      case 'ArrowRight':
        this.setGridFocus(1, 'day')
        break
      case 'ArrowUp':
        this.setGridFocus(-7, 'day')
        break
      case 'ArrowDown':
        this.setGridFocus(7, 'day')
        break
      case 'PageUp':
        this.setGridFocus(-1, e.shiftKey ? 'year' : 'month')
        break
      case 'PageDown':
        this.setGridFocus(1, e.shiftKey ? 'year' : 'month')
        break
      case 'Home':
        this.setGridFocus(0, 'weekday')
        break
      case 'End':
        this.setGridFocus(6, 'weekday')
        break

      case ' ':
      case 'Enter':
        // TODO Someday we should handle multiple with shift/ctrl keys.
        this.setSelectedDate(e)
        e.preventDefault()
        break

      default:
        return
    }
    e.stopPropagation()
  }

  render() {
    const {
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
      onYearChange,
      isValidDate,
      labels = DEFAULT_LABELS,
      locale,
      ...rest
    } = this.props
    // TODO style flex column-reverse
    return (
      <div {...rest} role="group" aria-disabled={disabled} ref={this.rootRef}>
        <CalendarGrid
          locale={locale}
          isValidDate={isValidDate}
          selected={this.state.value}
          focusDate={this.state.focusDate}
          labels={labels}
          aria-multiselectable={multiple}
          aria-readonly={readOnly}
          onKeyDown={this.onGridKeyDown}
          onClick={this.setSelectedDate}
        />
        <Flex justifyContent="space-between" alignItems="center" padding={4}>
          <IconButton
            name="left"
            label={labels.prevMonth || DEFAULT_LABELS.prevMonth}
            iconSize="small"
            onClick={this.handleArrowClick}
          >
            <NavigationChevronLeft />
          </IconButton>
          <div>
            {this.renderMonthDD(locale, labels.months)}
            {this.renderYearDD()}
          </div>
          <IconButton
            name="right"
            label={labels.nextMonth || DEFAULT_LABELS.nextMonth}
            iconSize="small"
            onClick={this.handleArrowClick}
          >
            <NavigationChevronRight />
          </IconButton>
        </Flex>
        {renderLabels(labels)}
      </div>
    )
  }

  renderMonthDD(locale?: string, labels?: string[]) {
    const options = this.getMonthOptions(locale, labels)
    const month = this.state.focusDate.getMonth()
    return (
      <DropDown
        value={month}
        label={options[month].label}
        options={options}
        onSelectOption={this.selectMonth}
        aria-labelledby="showMonth"
      />
    )
  }

  renderYearDD() {
    const year = this.state.focusDate.getFullYear()
    return (
      <DropDown
        label={year}
        value={year}
        options={this.getYearOptions(year)}
        onSelectOption={this.selectYear}
        aria-labelledby="showYear"
      />
    )
  }
}

// Even with `hidden`, elements directly referenced by ID are still accessible.
// TODO Fix the IDs
const renderLabels = (labels: Partial<CalendarLabels>) => (
  <div hidden>
    <div id="showMonth">{labels.showMonth || DEFAULT_LABELS.showMonth}</div>
    <div id="showYear">{labels.showYear || DEFAULT_LABELS.showYear}</div>
  </div>
)
