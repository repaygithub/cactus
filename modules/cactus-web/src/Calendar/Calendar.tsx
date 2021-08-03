import CalendarGrid, { CalendarDate, CalendarValue, toISODate } from './Grid'

type BaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultChecked' | 'defaultValue' | 'onChange'>

interface CalendarProps extends MarginProps, BaseProps {
  initialFocus?: CalendarDate | { day?: number; month?: number; year?: number }
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

class CalenderBase extends React.Component {
  public static Grid = CalendarGrid

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

  setMonth = (month: number) => {
    this.setState({ month })
    this.props.onMonthChange?.(month)
  }

  setYear = (year: number) => {
    this.setState({ year })
    this.props.onYearChange?.(year)
  }

  gridControl = (gridRoot, searchState) => {
    const elements = gridRoot.querySelector('[role="gridcell"]:not(.outside-date)')
    let nextIndex = getFocusIndex(elements, searchState)
    if (nextIndex < 0) {
      this.setState(({ month, year }) => {
        const date = new Date(year, month, 1)
        date.setDate(0)
        return { month: date.getMonth(), year: date.getFullYear() }
      })
    } else if (nextIndex >= elements.length) {
      this.setState(({ month, year }) => {
        const date = new Date(year, month, 1)
        date.setDate(32)
        return { month: date.getMonth(), year: date.getFullYear() }
      })
    } else {
      // TODO change element tabindex?
      state.focusIndex = nextIndex
      return elements[nextIndex]
    }
  }
}

const gridRef = (gridRoot: HTMLDivElement) => {
}

const observer = window !== 'undefined' && window.MutationObserver && new window.MutationObserver(
  (mutations) => {
    for (const mut of mutations) {
      mut.addedNodes.forEach(setTabIndex)
    }
  }
)

const setTabIndex = (e: Node) => {
  const isElem: e is HTMLElement = 'tabIndex' in e
  if (isElem && e.dataset.date) {
    e.tabIndex = -1
  }
}

const gridRef = (gridRoot: HTMLDivElement) => {
  if (gridRoot) {
    gridRoot.querySelectorAll('[data-date]').forEach(setTabIndex)
    observer?.observe(gridRoot)
  }
}

const Grid = (props) => {
  const ref = useMergedRefs(gridRef)
  React.useEffect(() => {
    // TODO use passed-in value
    const initialFocus = toISODate(new Date())
    if (ref.current) {
      const element = ref.current.querySelector(`[data-date='${initialFocus}']`) || ref.current.querySelector('[data-date]:not(.outside-date)')
      if (element) {
        element.tabIndex = 0
      }
    }
  }, [])
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!e.target.dataset.date) return

    let focusChanged = false
    switch (e.key) {
      case 'ArrowLeft':
        focusChanged = setFocus(-1, 'day')
        break
      case 'ArrowRight':
        focusChanged = setFocus(1, 'day')
        break
      case 'ArrowUp':
        focusChanged = setFocus(-7, 'day')
        break
      case 'ArrowDown':
        focusChanged = setFocus(7, 'day')
        break
      case 'PageUp':
        focusChanged = setFocus(-1, e.shiftKey ? 'year' : 'month')
        break
      case 'PageDown':
        focusChanged = setFocus(1, e.shiftKey ? 'year' : 'month')
        break
      case 'Home':
        focusChanged = setFocus(0, 'weekday')
        break
      case 'End':
        focusChanged = setFocus(6, 'weekday')
        break

      case ' ':
      case 'Enter':
        if (target.getAttribute('aria-disabled') !== true) {
          // TODO Someday we should handle multiple with shift/ctrl keys.
          setSelectedDate(e.target.dataset.date)
        }
        break

      default:
        return
    }
    if (focusChanged) {
      e.target.tabIndex = -1
    }
    e.stopPropagation()
  }
  return (
    <CalendarGrid {...props} ref={ref} />
  )
}
