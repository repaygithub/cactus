import { NavigationChevronLeft, NavigationChevronRight } from '@repay/cactus-icons'
import { colorStyle, radius, shadow } from '@repay/cactus-theme'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import Flex from '../Flex/Flex'
import { getFormatter } from '../helpers/dates'
import { CactusChangeEvent, CactusEventTarget } from '../helpers/events'
import generateId from '../helpers/generateId'
import { omitProps } from '../helpers/omit'
import IconButton from '../IconButton/IconButton'
import DropDown from './DropDown'
import CalendarGrid, {
  CalendarDate,
  CalendarGridLabels,
  CalendarValue,
  dateParts,
  clampDate,
  queryDate,
  toISODate,
} from './Grid'
import Slider, { SlideDirection, SliderProps } from './Slider'
import { isActionKey } from '../helpers/a11y'

export interface CalendarLabels extends CalendarGridLabels {
  calendarKeyboardDirections: React.ReactChild
  prevMonth: React.ReactChild
  nextMonth: React.ReactChild
  showMonth: React.ReactChild
  showYear: React.ReactChild
  months?: string[]
}

const DEFAULT_LABELS: CalendarLabels = {
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

interface CalendarProps extends BaseProps {
  initialFocus?: CalendarDate
  value?: CalendarValue
  defaultValue?: CalendarValue
  form?: string
  name?: string
  multiple?: boolean
  disabled?: boolean
  readOnly?: boolean
  onChange?: React.ChangeEventHandler<CactusEventTarget<CalendarValue>>
  onMonthChange?: (month: number, year: number) => void
  isValidDate?: (date: Date) => boolean
  labels?: Partial<CalendarLabels>
  locale?: string
  children?: never
}

interface CalendarState extends SliderProps {
  value: CalendarValue
  focusDate: Date
}

const memoize = <A extends any[], R>(func: (...a: A) => R): ((...a: A) => R) => {
  let key: A = [] as any
  let result: R = undefined as any
  return (...args: A) => {
    if (args.length === key.length && args.every((k, i) => k === key[i])) {
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
    // If we can't tell if it should be `Date` or `string`, default to `string`.
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
  // Works for `Date` objects or `null`.
  return typeof value === 'object'
}

class CalendarBase extends React.Component<CalendarProps, CalendarState> {
  public static Grid = CalendarGrid

  state = initState(this.props)

  private eventTarget = new CactusEventTarget<CalendarValue>({})
  private rootRef = React.createRef<HTMLDivElement>()
  private _isOverflow = false

  get rootElement(): HTMLDivElement {
    // Something that should be impossible.
    if (!this.rootRef.current) throw new Error('over 9000')
    return this.rootRef.current
  }

  static getDerivedStateFromProps(
    props: Readonly<CalendarProps>,
    state: CalendarState
  ): Partial<CalendarState> | null {
    if (props.value !== undefined) {
      let value = props.value
      // We should never store an empty array internally, because then we can't
      // tell if we're supposed to raise events values as `Date` or `string`.
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
    if (state.focusDate !== this.state.focusDate) {
      const newMonth = this.state.focusDate.getMonth()
      const newYear = this.state.focusDate.getFullYear()
      if (state.focusDate.getMonth() !== newMonth || state.focusDate.getFullYear() !== newYear) {
        this.props.onMonthChange?.(newMonth, newYear)
      }
      if (this._isOverflow) {
        queryDate(this.rootElement, toISODate(this.state.focusDate))?.focus()
      }
    }
    this._isOverflow = false
  }

  private setFocusDate = (date: Date) => {
    this.setState(({ focusDate }) => {
      if (
        date.getMonth() !== focusDate.getMonth() ||
        date.getFullYear() !== focusDate.getFullYear()
      ) {
        this._isOverflow = true
        return { focusDate: date }
      }
      return null
    })
  }

  private setSelectedDate = (e: React.MouseEvent | React.KeyboardEvent) => {
    const target = e.target as HTMLElement
    const isoDate = target.dataset.date
    const disabled = this.props.disabled || target.getAttribute('aria-disabled') === 'true'
    const isAction = (e as React.MouseEvent).button === 0 || isActionKey(e as React.KeyboardEvent)
    if (this.props.readOnly || disabled) {
      e.preventDefault()
      return
    } else if (!isoDate || !isAction) return

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
    const direction = e.currentTarget.name as SlideDirection
    const next = new Date(this.state.focusDate)
    clampDate(next, 'setMonth', next.getMonth() + (direction === 'left' ? -1 : 1))
    this.handleMonthYearChange(next, e, direction)
  }

  private selectMonth = (month: number, e: React.SyntheticEvent) => {
    const next = new Date(this.state.focusDate)
    clampDate(next, 'setMonth', month)
    this.handleMonthYearChange(next, e)
  }

  private selectYear = (year: number, e: React.SyntheticEvent) => {
    const next = new Date(this.state.focusDate)
    clampDate(next, 'setFullYear', year)
    this.handleMonthYearChange(next, e)
  }

  private handleMonthYearChange(
    next: Date,
    e: React.SyntheticEvent,
    transition?: SlideDirection
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
      // When not focused, the grid should have a single tab-able element.
      const elem = this.rootElement.querySelector<HTMLElement>('[role="grid"] [tabindex="0"]')
      if (elem?.dataset.date) {
        day = dateParts(elem.dataset.date)[2]
      }
    }
    clampDate(next, 'setDate', day)
    if (updateValue && this.props.isValidDate) {
      updateValue = this.props.isValidDate(next)
    }
    const newState: CalendarState = { focusDate: next, value }
    if (transition) {
      newState.transition = transition
      newState.transitionKey = generateId(transition)
    }
    if (updateValue) {
      newState.value = raiseAsDate(value) ? next : toISODate(next)
      this.raiseChange(newState, e)
    } else {
      this.setState(newState)
    }
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
      isValidDate,
      labels = DEFAULT_LABELS,
      locale,
      ...rest
    } = this.props
    return (
      <div {...rest} role="group" aria-disabled={disabled} ref={this.rootRef}>
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
            {this.renderMonthDD(locale, labels.months)}
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
            locale={locale}
            isValidDate={isValidDate}
            selected={this.state.value}
            focusDate={this.state.focusDate}
            labels={labels}
            aria-multiselectable={multiple}
            aria-readonly={readOnly}
            aria-describedby={this.getLabelId('calendarKeyboardDirections')}
            onClick={this.setSelectedDate}
            onKeyDown={this.setSelectedDate}
            onFocusOverflow={this.setFocusDate}
          />
        </Slider>
        {this.renderLabels(labels)}
      </div>
    )
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

  renderMonthDD(locale?: string, labels?: string[]) {
    const options = this.getMonthOptions(locale, labels)
    const month = this.state.focusDate.getMonth()
    return (
      <DropDown
        value={month}
        label={options[month].label}
        options={options}
        onSelectOption={this.selectMonth}
        aria-labelledby={this.getLabelId('showMonth')}
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
    const year = this.state.focusDate.getFullYear()
    return (
      <DropDown
        label={year}
        value={year}
        options={this.getYearOptions(year)}
        onSelectOption={this.selectYear}
        aria-labelledby={this.getLabelId('showYear')}
      />
    )
  }

  private _labelIDs: { [K in keyof CalendarLabels]?: string } = {}
  private getLabelId(label: keyof CalendarLabels) {
    return this._labelIDs[label] || (this._labelIDs[label] = generateId(label))
  }

  renderLabels(labels: Partial<CalendarLabels>) {
    const keys = Object.keys(this._labelIDs) as (keyof CalendarLabels)[]
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
  .withConfig(omitProps<CalendarProps & MarginProps>(margin))
  .attrs({ as: CalendarBase })`
  position: relative; /* Necessary for drop-down positioning. */
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
