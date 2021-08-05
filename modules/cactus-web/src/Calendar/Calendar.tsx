import React from 'react'
import { margin, MarginProps } from 'styled-system'
import styled from 'styled-components'

import { getFormatter } from '../helpers/dates'
import CalendarGrid, { dateParts, CalendarDate, CalendarGridLabels, CalendarValue, toISODate, queryDate, INSIDE_DATE } from './Grid'
import IconButton from '../IconButton/IconButton'
import Flex from '../Flex/Flex'
import { CactusEventTarget, CactusChangeEvent } from '../helpers/events'
import { NavigationChevronLeft, NavigationChevronRight } from '@repay/cactus-icons'
import { getCurrentFocusIndex } from '../helpers/focus'

type BaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultChecked' | 'defaultValue' | 'onChange'>

interface CalendarLabels extends CalendarGridLabels {
  prevMonth: string
  nextMonth: string
}

const DEFAULT_LABELS: CalendarLabels = {
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

const memoize = <A extends any[], R>(func: (...a: A) => R): (...a: A) => R => {
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
  private static getYearOptions = memoize(() => {
    const thisYear = new Date().getFullYear()
    const endYear = thisYear + 100
    const years = []
    for (let year = thisYear - 99; year < endYear; year++) {
      years.push(year)
    }
    return years
  })

  get rootElement(): HTMLDivElement {
    if (!this.rootRef.current) throw new Error('over 9000')
    return this.rootRef.current
  }

  static getDerivedStateFromProps(props: Readonly<CalendarProps>, state: CalendarState): Partial<CalendarState> | null {
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
      if (date.getMonth() !== focusDate.getMonth() || date.getFullYear() !== focusDate.getFullYear()) {
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
    const { value, focusDate } = this.state
    const next = new Date(focusDate)
    next.setMonth(next.getMonth() + (direction === 'left' ? -1 : 1))
    const month = next.getMonth()
    let day = focusDate.getDate()

    let updateValue = false
    if (value && !Array.isArray(value)) {
      updateValue = !this.props.readOnly
      if (typeof value === 'string') {
        day =  dateParts(value)[2]
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
      newState.value = raiseAsDate(value) ? next : toISODate(next)
      this.raiseChange(newState, e)
    } else {
      this.setState(newState)
    }
  }

  private setGridFocus(shift: number, type: 'day' | 'month' | 'year' | 'weekday') {
    const dates = Array.from(this.rootElement.querySelectorAll<HTMLElement>(INSIDE_DATE))
    const index = getCurrentFocusIndex(dates, 0)
    const date = new Date(...dateParts(dates[index].dataset.date!))
    const month = date.getMonth()
    const year = date.getFullYear()
    if (type === 'day') {
      date.setDate(date.getDate() + shift)
    } else if (type === 'month') {
      date.setMonth(month + shift)
    } else if (type === 'year') {
      date.setFullYear(year + shift)
    } else { // type === 'weekday'
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
      <div
        {...rest}
        role="group"
        aria-disabled={disabled}
        ref={this.rootRef}
      >
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
          <DropDown
            value={this.state.focusDate.getMonth()}
            options={this.getMonthOptions(locale, labels.months)}
            onSelectOption={this.selectMonth}
            aria-labelledby={0/* TODO */}
          />
          <DropDown
            value={this.state.focusDate.getFullYear()}
            options={this.getYearOptions()}
            onSelectOption={this.selectYear}
            aria-labelledby={0/* TODO */}
          />
          <IconButton
            name="right"
            label={labels.nextMonth || DEFAULT_LABELS.nextMonth}
            iconSize="small"
            onClick={this.handleArrowClick}
          >
            <NavigationChevronRight />
          </IconButton>
        </Flex>
      </div>
    )
  }
}

const onWrapperKeyDown = (e: React.KeyboardEvent<HTMLElement>, toggle: TogglePopup) => {
  keyDownAsClick(e)
  if (e.isDefaultPrevented()) return

  let focusHint = 1
  switch (e.key) {
    case 'Home':
    case 'PageUp':
      toggle(true, 0)
      break
    case 'End':
    case 'PageDown':
      toggle(true, -1)
      break

    case 'ArrowUp':
      focusHint = -1
    case 'ArrowDown':
      const button = e.currentTarget.firstElementChild
      if (button?.getAttribute('aria-expanded') === 'true') {
        toggle(true, focusHint, { shift: true })
      } else {
        let item = button?.nextElementSibling?.firstElementChild
        while (item) {
          if (item.getAttribute('aria-selected') === 'true') {
            toggle(true, item)
            break
          }
          item = item.nextElementSibling
        }
      }
      break
    default:
      return
  }
  e.stopPropagation()
}

const positionPopup = (popup: HTMLElement) => {
  const header = popup.closest('[role="group"] > *')
  if (header) {
    popup.styles.top = `${header.offsetHeight}px`
  }
}

const DropDown = ({ value, options, onSelectOption, ...props }) => {
  const { wrapperProps, popupProps, buttonProps, toggle, setFocus } = usePopup('listbox', { positionPopup, onWrapperKeyDown })
  buttonProps['aria-labelledby'] = `${props['aria-labelledby']} ${buttonProps.id}`
  delete buttonProps.onKeyDown // Handled at the wrapper level.
  buttonProps.onClick = (e: React.MouseEvent<HTMLElement>) => {
    const selected = e.currentTarget.nextElementSibling?.querySelector('[aria-selected="true"]')
    toggle(undefined, selected)
  }

  let selectedLabel = ''
  popupProps.children = options.map((opt) => {
    const props = { key: '', tabIndex: -1, children: '', 'data-value': '' }
    let isSelected = opt === value
    if (typeof opt === 'object') {
      props['data-value'] = opt.value.toString()
      props.children = opt.label
      isSelected = value === opt.value
    } else {
      props['data-value'] = props.children = opt.toString()
    }
    if (isSelected) {
      selectedLabel = props.children
    }
    return (<li {...props} role="option" aria-selected={isSelected || undefined} />)
  })
  popupProps.onClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    if (target.dataset.value) {
      toggle(false, e.currentTarget.previousElementSibling)
      onSelectOption(target.dataset.value, e)
    }
  }
  return (
    <div {...wrapperProps}>
      <button type="button" {...buttonProps}>
        <span>{selectedLabel}</span>
        <NavigationChevronDown iconSize="tiny" ml={3} />
      </button>
      <ul {...popupProps} {...props} />
    </div>
  )
}
