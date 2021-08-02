
type CalendarDate = string | Date
type CalendarValue = CalendarDate | CalendarDate[]
type BaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultChecked' | 'defaultValue' | 'onChange'>

interface CalendarProps extends MarginProps, BaseProps {
  initialFocus?: CalendarDate | { day?: number; month?: number; year?: number }
  value?: CalendarValue
  defaultValue?: CalendarValue
  form?: string
  multiple?: boolean
  disabled?: boolean
  onChange?: React.ChangeEvent<CactusEventTarget<CalendarValue>>
  onMonthChange?: React.ChangeEvent<CactusEventTarget<number>>
  onYearChange?: React.ChangeEvent<CactusEventTarget<number>>
  isValidDate?: (date: Date) => boolean
  labels?: {
    ...
  }
  children?: never
}

const initState (props) => {
  if (props.value === undefined && props.defaultValue) {
    let value = props.defaultValue
    if (Array.isArray(value)) {
      value = [...value]
    }
    return { value }
  }
  return { value: '' }
}

class CalenderBase extends React.Component {
  public state = initState(this.props)

  static getDerivedStateFromProps(props: Readonly<CalendarProps>, state: CalendarState): Partial<CalendarState> | null {
    if (props.value !== undefined && props.value !== state.value) {
      return { value: props.value }
    }
    return null
  }

  onReset = (e: React.FormEvent<HTMLFormElement>) => {
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

  gridControl = (gridRoot, searchState) => {
    const elements = gridRoot.querySelector('[role="gridcell"]:not(.outside-date)')
    let nextIndex = getFocusIndex(elements, searchState)
    if (nextIndex < 0) {
      this.setState(({ month, year }) => {
        const date = new Date(year, month, 1)
        date.setDate(0)
        return { month: date.getMonth(), year: date.getYear() }
      })
    } else if (nextIndex >= elements.length) {
      this.setState(({ month, year }) => {
        const date = new Date(year, month, 1)
        date.setDate(32)
        return { month: date.getMonth(), year: date.getYear() }
      })
    } else {
      // TODO change element tabindex?
      state.focusIndex = nextIndex
      return elements[nextIndex]
    }
  }
}

const useGrid = ({ month, year, isValidDate }) => {
  const gridRef = React.useRef()
  if (!gridRef.current || gridRef.current.month !== month || gridRef.current.year !== year) {
    const rows = gridRef.current = []
    rows.month = month
    rows.year = year
    let date = new Date(year, month, 1)
    date.setDate(-date.getDay() + 1)
    while (date.getMonth() <= month && date.getYear() <= year) {
      const row = []
      for (let i = 0; i < 7; i++) {
        const day = date.getDate()
        const isValid = isValidDate?.(date) ?? true
        row.push({
          key: day,
          children: day,
          'aria-disabled': !isValid,
          // TODO label
          'data-date': date.toISOString().slice(0, 10),
          className: date.getMonth() !== month ? 'outside-date' : undefined,
        })
        date.setDate(day + 1)
      }
      rows.push(row)
    }
  }
  return gridRef.current
}

const CalendarGrid = (props) => {
  const grid = useGrid(props)
  // TODO Focus
  return (
    <div role="grid">
      {props.weekdayLabels && gridHeader(props.weekdayLabels)}
      {grid.map((row, ix) => (
        <div role="row" key={ix}>
          {row.map((dateProps) => (
            // TODO Either change to `<table>`, or `aria-describedby` to the columnheader.
            <span {...dateProps} role="gridcell" />
          )}
        </div>
      )}
    </div>
  )
}

const gridHeader = (weekdayLabels) => {
  const cells = []
  for (let i = 0; i < 7; i++) {
    const label = weekdayLabels[i] ?? WEEKDAY_LABELS[i]
    // TODO Long labels
    cells.push(<span role="columnheader" key={i}>{label}</span>)
  }
  return <div role="row" key="header">{cells}</div>
}
