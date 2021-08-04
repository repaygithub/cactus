import CalendarGrid, { CalendarDate, CalendarValue, toISODate, queryDate, INSIDE_DATE } from './Grid'

type BaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultChecked' | 'defaultValue' | 'onChange'>

interface CalendarProps extends MarginProps, BaseProps {
  initialFocus?: CalendarDate
  value?: CalendarValue
  defaultValue?: CalendarValue
  form?: string
  multiple?: boolean
  disabled?: boolean
  readOnly?: boolean
  onChange?: React.ChangeEvent<CactusEventTarget<CalendarValue>>
  onMonthChange?: (month: number) => void
  onYearChange?: (year: number) => void
  isValidDate?: (date: Date) => boolean
  labels?: {
    one: never
  }
  locale?: string
  children?: never
}

const initState = (props) => {
  if (props.value === undefined && props.defaultValue) {
    let value = props.defaultValue
    if (Array.isArray(value)) {
      value = [...value]
    }
    return { value }
  }
  return { value: '' }
}

const raiseAsDate = (value: CalendarValue) => {
  if (Array.isArray(value)) {
    value = value[0]
  }
  return typeof value === 'object' ? 'date' : 'string'
}

class CalenderBase extends React.Component {
  public static Grid = CalendarGrid

  public state = initState(this.props)

  private eventTarget = new CactusEventTarget<Color>({})
  private rootRef = React.createRef<HTMLDivElement>()

  get rootElement() {
    return this.rootRef.current as HTMLElement
  }

  static getDerivedStateFromProps(props: Readonly<CalendarProps>, state: CalendarState): Partial<CalendarState> | null {
    if (props.value !== undefined && props.value !== state.value) {
      return { value: props.value }
    }
    return null
  }

  private onReset = (e: React.FormEvent<HTMLFormElement>) => {
    if (this.props.value !== undefined) return
    const form = this.props.form
    if (form ? e.target.id === form : e.target.contains(this.rootElement)) {
      this.setState(initState(this.props))
    }
  }

  componentDidMount() {
    document.addEventListener('reset', this.onReset)
  }

  componentWillUnmount() {
    document.removeEventListener('reset', this.onReset)
  }

  componentDidUpdate(props, state) {
    if (state.month !== this.state.month) {
      this.props.onMonthChange?.(this.state.month)
    }
    if (state.year !== this.state.year) {
      this.props.onYearChange?.(this.state.year)
    }
    // TODO Are there situations where the month/year might change
    // and we need to set a tabIndex without actually focusing?
    if (state.overflowFocus !== this.state.overflowFocus) {
      queryDate(this.rootElement, this.state.overflowFocus)?.focus()
    }
  }

  setOverflowFocus(date: Date) {
    const month = date.getMonth()
    const year = date.getFullYear()
    this.setState((state) => {
      if (month !== state.month || year !== state.year) {
        return { month, year, overflowFocus: toISODate(date) }
      }
      return null
    })
  }

  setSelectedDate = (e: React.SyntheticEvent<HTMLElement>) => {
    // TODO Support multiple, eventually.
    const isoDate = e.target.dataset.date
    const disabled = this.props.disabled || this.props.readOnly || e.target.getAttribute('aria-disabled') === 'true'
    if (disabled || !isoDate) return

    const value = raiseAsDate(this.state.value) ? new Date(isoDate) : isoDate
    this.setState({ value })
    if (this.props.onChange) {
      this.eventTarget.id = this.props.id
      this.eventTarget.name = this.props.name
      this.eventTarget.value = value
      this.props.onChange(new CactusChangeEvent(this.eventTarget, e))
    }
  }

  setGridFocus(shift: number, type: 'day' | 'month' | 'year' | 'weekday') {
    const dates = Array.from(this.rootElement.querySelectorAll<HTMLElement>(INSIDE_DATE))
    const index = getCurrentFocusIndex(dates, 0)
    const date = new Date(dates[index].dataset.date)
    const month = date.getMonth()
    const year = date.getFullYear()
    if (type === 'day') {
      date.setDate(date.getDate() + shift)
    } else if (type === 'month') {
      date.setMonth(month + shift)
    } else if (type === 'year') {
      date.setYear(year + shift)
    } else { // type === 'weekday'
      date.setDate(date.getDate() + shift - date.getDay())
    }
    if (date.getMonth() !== month || date.getFullYear() !== year) {
      this.setOverflowFocus(date)
    } else {
      dates[date.getDate() - 1].focus()
    }
  }

  onGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!e.target.dataset.date) return

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
        setSelectedDate(e)
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
      multiple,
      disabled,
      readOnly,
      onChange,
      onMonthChange,
      onYearChange,
      isValidDate,
      labels,
      locale,
      ...rest
    } = this.props
    return (
      <div
        {...rest}
        role="group"
        aria-disabled={disabled}
        ref={this.rootRef}
      >
        <div>
          <LeftButton />
          <SelectMonth />
          <SelectYear />
          <RightButton />
        </div>
        <CalendarGrid
          month={this.state.month}
          year={this.state.year}
          locale={locale}
          isValidDate={isValidDate}
          selected={this.state.value}
          initialFocus={initialFocus}
          labels={labels}
          aria-multiselectable={multiple}
          aria-readonly={readOnly}
          onKeyDown={this.onGridKeyDown}
          onClick={this.setSelectedDate}
        />
      </div>
    )
  }
}
