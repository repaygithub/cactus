import { border, color, colorStyle, insetBorder, radius, textStyle } from '@repay/cactus-theme'
import { stubFalse } from 'lodash'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { clampDate, dateParts, getFormatter, toISODate } from '../helpers/dates'
import { isFocusOut } from '../helpers/events'
import { getCurrentFocusIndex } from '../helpers/focus'
import generateId from '../helpers/generateId'
import { omitProps } from '../helpers/omit'
import { useValue } from '../helpers/react'

export type CalendarDate = string | Date
export type CalendarValue = CalendarDate | string[] | Date[] | null
interface WeekdayLabel {
  long: string
  short: string
}

export interface FocusProps {
  initialFocus?:
    | CalendarDate
    | {
        year?: number
        month?: number
        day?: number
      }
  month?: number
  year?: number
}

export interface CalendarGridLabels {
  labelDate?: (d: Date) => string
  labelDisabled?: (normalLabel: string) => string
  weekdays?: string[] | WeekdayLabel[] | null
}

export interface BaseProps extends FocusProps, React.HTMLAttributes<HTMLDivElement> {
  children?: never
  locale?: string
  isValidDate?: (d: Date) => boolean
  selected?: CalendarValue
  labels?: CalendarGridLabels
  onFocusOverflow?: (d: Date, e: React.SyntheticEvent) => void
}

export type CalendarGridProps = BaseProps & MarginProps

interface GridState {
  overflow: string | null
  year: number
  month: number
  day: number
}

const makeGridHeader = (locale?: string, weekdayLabels: CalendarGridLabels['weekdays'] = []) => {
  if (weekdayLabels === null) return null

  const fmtShort = getFormatter({ weekday: 'short' }, locale)
  const fmtLong = getFormatter({ weekday: 'long' }, locale)
  const cells: React.ReactElement<React.HTMLAttributes<any>>[] = []
  for (let i = 0; i < 7; i++) {
    const props = { id: generateId('col'), key: i, children: '', 'aria-label': '' }
    const labels = weekdayLabels[i]
    if (typeof labels === 'string') {
      props.children = labels
    } else if (labels) {
      props.children = labels.short
      props['aria-label'] = labels.long
    }
    // Sample dates chosen so `Date.getDay() === i`.
    if (!props.children) {
      props.children = fmtShort(new Date(2021, 2, i)).slice(0, 2)
    }
    if (!props['aria-label']) {
      props['aria-label'] = fmtLong(new Date(2021, 2, i))
    }
    cells.push(<span {...props} role="columnheader" />)
  }
  return cells
}

type GridCellProps = React.HTMLAttributes<Node> & { 'data-date': string }

const makeGrid = (
  month: number,
  year: number,
  locale?: string,
  isValidDate?: (d: Date) => boolean,
  labelDate?: (d: Date) => string,
  labelDisabled?: (l: string) => string
) => {
  const rows: GridCellProps[][] = []
  const date = new Date(year, month, 1)
  date.setDate(-date.getDay() + 1)
  if (!labelDate) {
    labelDate = getFormatter('date', locale)
  }
  const firstOfNextMonth = new Date(year, month + 1, 1).valueOf()
  while (date.valueOf() < firstOfNextMonth) {
    const row: GridCellProps[] = []
    for (let i = 0; i < 7; i++) {
      const day = date.getDate()
      const isValid = isValidDate ? isValidDate(date) : true
      const label = labelDate(date)
      row.push({
        children: day,
        'aria-disabled': !isValid,
        'aria-label': !isValid && labelDisabled ? labelDisabled(label) : label,
        'data-date': toISODate(date),
        className: date.getMonth() !== month ? 'outside-date' : undefined,
      })
      date.setDate(day + 1)
    }
    rows.push(row)
  }
  return rows
}

const INSIDE_DATE = '[data-date]:not(.outside-date)'
export const queryDate = (root: HTMLElement, date: string): HTMLElement | null =>
  root.querySelector<HTMLElement>(`[data-date='${date}']:not(.outside-date)`)

// This is similar to passing `tabIndex={-1}` as a prop, but makes it easier to
// make programmatic changes later because it only runs once rather than every render.
const setTabIndex = (ref: HTMLElement | null) => {
  if (ref) ref.tabIndex = -1
}

type FocusShift = 'day' | 'month' | 'year' | 'weekday'
const setGridFocus = (e: React.KeyboardEvent<HTMLDivElement>, shift: number, type: FocusShift) => {
  e.stopPropagation()
  e.preventDefault()
  const dates = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(INSIDE_DATE))
  const index = getCurrentFocusIndex(dates, 0)
  // The query guarantees it has a `data-date` attribute.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const date = new Date(...dateParts(dates[index].dataset.date!))
  const month = date.getMonth()
  const year = date.getFullYear()
  if (type === 'day') {
    date.setDate(date.getDate() + shift)
  } else if (type === 'month') {
    clampDate(date, 'month', month + shift)
  } else if (type === 'year') {
    clampDate(date, 'year', year + shift)
  } /* type === 'weekday' */ else {
    date.setDate(date.getDate() + shift - date.getDay())
  }
  // This is an overflow, so we can't just set the focus.
  if (date.getMonth() !== month || date.getFullYear() !== year) {
    return date
  }
  dates[date.getDate() - 1].focus()
}

const onGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  switch (e.key) {
    case 'ArrowLeft':
      return setGridFocus(e, -1, 'day')
    case 'ArrowRight':
      return setGridFocus(e, 1, 'day')
    case 'ArrowUp':
      return setGridFocus(e, -7, 'day')
    case 'ArrowDown':
      return setGridFocus(e, 7, 'day')
    case 'PageUp':
      return setGridFocus(e, -1, e.shiftKey ? 'year' : 'month')
    case 'PageDown':
      return setGridFocus(e, 1, e.shiftKey ? 'year' : 'month')
    case 'Home':
      return setGridFocus(e, 0, 'weekday')
    case 'End':
      return setGridFocus(e, 6, 'weekday')
  }
}

type ISODates = string[] | [Set<string>]
const isStringArray = (x: string[] | Date[]): x is string[] => typeof x[0] === 'string'
const containsAll = (s: Set<string>, a: string[]) => s.size === a.length && a.every(s.has, s)

const makeIsSelected = (...isoDates: ISODates): ((d: string) => boolean) => {
  const date = isoDates[0]
  if (date instanceof Set) {
    return Set.prototype.has.bind(date)
  } else if (isoDates.length > 1) {
    return Array.prototype.includes.bind(isoDates)
  } else if (date) {
    return (d: string) => d === date
  }
  return stubFalse
}

const compareSelected = (old: ISODates, selected: BaseProps['selected']): ISODates => {
  const first = old[0] || ''
  let date = ''
  if (Array.isArray(selected)) {
    const isoDates: string[] = isStringArray(selected) ? selected : selected.map(toISODate)
    // If the new array has the same contents as the previous one, just keep the old.
    if (
      old === isoDates ||
      (!isoDates.length && !first) ||
      (first instanceof Set && containsAll(first, isoDates)) ||
      (old.length === isoDates.length && isoDates.every((d: any) => old.includes(d)))
    ) {
      return old
    } else if (isoDates.length > 30) {
      // For longish arrays, converting to a Set should save some CPU cycles.
      const dates = new Set<string>()
      isoDates.forEach(Set.prototype.add, dates)
      return [dates]
    }
    return isoDates
  } else if (selected instanceof Date) {
    date = toISODate(selected)
  } else if (selected) {
    date = selected
  }
  return date === first ? old : [date]
}

const overflowReducer = (state: GridState, [str, dt]: [string, Date]): GridState => ({
  overflow: str,
  year: dt.getFullYear(),
  month: dt.getMonth(),
  day: dt.getDate(),
})

export const initGridState = (initialFocus: BaseProps['initialFocus']): GridState => {
  let year: number, month: number, day: number
  if (typeof initialFocus === 'string') {
    ;[year, month, day] = dateParts(initialFocus)
  } else {
    let date: Date
    if (initialFocus instanceof Date) {
      date = initialFocus
      year = initialFocus.getFullYear()
    } else {
      date = new Date()
      year = initialFocus?.year ?? date.getFullYear()
      clampDate(date, 'year', year, initialFocus?.month, initialFocus?.day)
    }
    month = date.getMonth()
    day = date.getDate()
  }
  return { overflow: null, year, month, day }
}

const getFocusDay = (initialFocus: FocusProps['initialFocus']) => {
  if (typeof initialFocus === 'string') {
    return parseInt(initialFocus.slice(8))
  } else if (initialFocus instanceof Date) {
    return initialFocus.getDate()
  } else {
    return initialFocus?.day
  }
}

const CalendarGridBase = ({
  initialFocus,
  month: monthProp,
  year: yearProp,
  locale,
  labels = {},
  isValidDate,
  selected,
  onFocusOverflow,
  onClick,
  onKeyDown,
  onFocus,
  onBlur,
  ...rest
}: BaseProps) => {
  const gridRef = React.useRef<HTMLDivElement>(null)
  const [state, setOverflow] = React.useReducer(overflowReducer, initialFocus, initGridState)
  const year = yearProp ?? state.year
  const month = monthProp ?? state.month
  const isSelected = useValue(makeIsSelected, selected, compareSelected)
  // First effect: if we've just had an overflow event, refocus on the grid.
  React.useEffect(() => {
    if (gridRef.current && state.overflow) {
      queryDate(gridRef.current, state.overflow)?.focus()
    }
  }, [state.overflow])
  // Second effect: if the grid is not currently focused,
  // make sure there's exactly one gridcell with tabIndex == 0.
  React.useEffect(() => {
    const gridElement = gridRef.current
    const active = document.activeElement as HTMLElement | null
    // If the grid is currently focused, we don't need to do anything.
    if (gridElement && !(active?.dataset.date && gridElement.contains(active))) {
      const old = gridElement.querySelector<HTMLElement>('[tabindex="0"]')
      let toFocus: HTMLElement | null = old
      // First choice is the selected date (first one this month if there's multiple).
      if (isSelected !== stubFalse) {
        toFocus = gridElement.querySelector<HTMLElement>(
          '[aria-selected="true"]:not(.outside-date)'
        )
      }
      if (!toFocus) {
        const focusDay = getFocusDay(initialFocus) || state.day
        const fd = toISODate(clampDate(new Date(year, month, 1), 'day', focusDay))
        toFocus = queryDate(gridElement, fd) || gridElement.querySelector<HTMLElement>(INSIDE_DATE)
      }
      if (toFocus) {
        if (old && old !== toFocus) {
          old.tabIndex = -1
        }
        toFocus.tabIndex = 0
      }
    }
  }, [isSelected, month, year]) // eslint-disable-line react-hooks/exhaustive-deps
  const props: React.HTMLAttributes<HTMLDivElement> = rest
  props.onFocus = (e) => {
    e.target.tabIndex = -1
    onFocus?.(e)
  }
  props.onBlur = (e) => {
    // Set tabIndex so that focus will pick up where it left off when returning to the grid.
    if (isFocusOut(e) && e.target.dataset.date) {
      e.target.tabIndex = 0
    }
    onBlur?.(e)
  }
  props.onClick = (e) => {
    onClick?.(e)
    const target = e.target as HTMLElement
    const selector = '.outside-date[aria-disabled="false"]'
    if (!e.isDefaultPrevented() && target.matches(selector)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const dateStr: string = target.dataset.date!
      const date = new Date(...dateParts(dateStr))
      setOverflow([dateStr, date])
      onFocusOverflow?.(date, e)
    }
  }
  props.onKeyDown = (e) => {
    onKeyDown?.(e)
    if (!e.isDefaultPrevented() && (e.target as HTMLElement).dataset.date) {
      const overflowDate = onGridKeyDown(e)
      if (overflowDate) {
        setOverflow([toISODate(overflowDate), overflowDate])
        onFocusOverflow?.(overflowDate, e)
      }
    }
  }

  const { labelDate, labelDisabled, weekdays } = labels
  const header = useValue(makeGridHeader, [locale, weekdays])
  const grid = useValue(makeGrid, [month, year, locale, isValidDate, labelDate, labelDisabled])
  return (
    <div {...props} key={`${year}-${month}`} ref={gridRef} role="grid">
      {header && (
        <div role="row" key="header">
          {header}
        </div>
      )}
      {grid.map((row, ix) => (
        <div role="row" key={ix}>
          {row.map((dateProps, jx) => {
            // The default `labelDate` function includes the weekday but we
            // can't tell with a custom one, so add describedby just in case.
            if (header && labelDate) {
              dateProps['aria-describedby'] = header[jx].props.id
            }
            dateProps['aria-selected'] = isSelected(dateProps['data-date'])
            return <span {...dateProps} key={jx} ref={setTabIndex} role="gridcell" />
          })}
        </div>
      ))}
    </div>
  )
}

// TODO Figure out the right style for selected `.outside-date`
const OUTLINE = { thin: '2px' }
export const CalendarGrid = styled(CalendarGridBase)
  .withConfig(omitProps<CalendarGridProps>(margin))
  .attrs({ as: CalendarGridBase })`
  box-sizing: border-box;
  display: inline-block;
  width: 300px;
  padding: 0 10px;
  ${margin}
  ${textStyle('small')}
  ${colorStyle('lightContrast')}
  border-radius: ${radius(20)};
  text-align: center;

  [role='row'] {
    display: flex;
  }

  span {
    box-sizing: border-box;
    display: inline-block;
    padding: 8px 0;
    border-radius: 50%;
    flex: 0 0 40px;
    outline: none;
  }

  [role='columnheader'] {
    font-weight: 600;
  }

  [aria-disabled='true'] {
    color: ${color('mediumContrast')};
    :focus {
      background-color: ${color('errorLight')};
    }
  }

  [aria-disabled='false'] {
    cursor: pointer;
    :focus {
      background-color: ${color('lightCallToAction')};
    }
    :focus-visible {
      background-color: transparent;
      ${insetBorder('callToAction', undefined, OUTLINE)};
    }
    :hover {
      background-color: ${color('lightCallToAction')};
    }
  }

  .outside-date {
    color: ${color('mediumContrast')};
  }

  && span[aria-selected='true'] {
    ${colorStyle('callToAction')}
    :focus-visible {
      border: ${border('callToAction', OUTLINE)};
      ${insetBorder('white', undefined, OUTLINE)};
      padding: 6px 0;
    }
    &.outside-date {
      opacity: .6;
    }
  }
`
CalendarGrid.displayName = 'Calendar.Grid'

export default CalendarGrid
