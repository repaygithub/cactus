import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { getFormatter } from '../helpers/dates'
import { useRefWithId } from '../helpers/useId'
import { omitProps } from '../helpers/omit'
import { textStyle } from '../helpers/theme'
import { isFocusOut } from '../helpers/events'

export type CalendarDate = string | Date
export type CalendarValue = CalendarDate | string[] | Date[] | null
export type WeekdayLabel = string | {
  long: string
  short: string
}

export interface CalendarGridLabels {
  labelDate?: (d: Date) => string
  labelDisabled?: (normalLabel: string) => string
  weekdays?: WeekdayLabel[]
}

interface BaseProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: never
  focusDate?: Date
  locale?: string
  isValidDate?: (d: Date) => boolean
  selected?: CalendarValue
  labels?: CalendarGridLabels
}

export interface CalendarGridProps extends BaseProps, MarginProps {
  radius?: number
}

// toISOString messes with timezones and can return the wrong date;
// similarly `new Date(string)` treats ISO date strings like midnight UTC.
export const toISODate = (date: Date): string => [
  ('000' + date.getFullYear()).slice(0, 4),
  ('0' + (date.getMonth() + 1)).slice(0, 2),
  ('0' + date.getDate()).slice(0, 2),
].join('-')
export const dateParts = (date: string): [number, number, number] => {
  const [year, month, day] = date.split('-')
  return [parseInt(year), parseInt(month), parseInt(day)]
}

const makeGridHeader = (idPrefix: string, locale?: string, weekdayLabels: WeekdayLabel[] = []) => {
  if (weekdayLabels === null) return null

  const fmtShort = getFormatter({ weekday: 'short' }, locale)
  const fmtLong = getFormatter({ weekday: 'long' }, locale)
  const cells: React.ReactElement<React.HTMLAttributes<any>>[] = []
  for (let i = 0; i < 7; i++) {
    const props = { id: `${idPrefix}-col${i}`, key: i, children: '', 'aria-label': '' }
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

const makeGrid = (month: number, year: number, locale?: string, isValidDate?: (d: Date) => boolean, labelDate?: (d: Date) => string, labelDisabled?: (l: string) => string) => {
  const rows: GridCellProps[][] = []
  let date = new Date(year, month, 1)
  date.setDate(-date.getDay() + 1)
  if (!labelDate) {
    labelDate = getFormatter('date', locale)
  }
  while (date.getMonth() <= month && date.getFullYear() <= year) {
    const row: GridCellProps[] = []
    for (let i = 0; i < 7; i++) {
      const day = date.getDate()
      const isValid = isValidDate?.(date) ?? true
      const label = labelDate(date)
      row.push({
        children: day,
        'aria-disabled': !isValid,
        'aria-label': (!isValid && labelDisabled) ? labelDisabled(label) : label,
        'data-date': toISODate(date),
        className: date.getMonth() !== month ? 'outside-date' : undefined,
      })
      date.setDate(day + 1)
    }
    rows.push(row)
  }
  return rows
}

export const INSIDE_DATE = '[data-date]:not(.outside-date)'
export const queryDate = (root: HTMLElement, date: string): HTMLElement | null =>
  root.querySelector<HTMLElement>(`[data-date='${date}']:not(.outside-date)`)

const useTabIndexCallback = (
  focusDate: CalendarDate,
  gridRef: React.RefObject<HTMLDivElement>,
  props: React.HTMLAttributes<HTMLDivElement>,
): (d: string) => number => {
  const focusRef = React.useRef<string | null>(null)
  const focusStr = typeof focusDate === 'object' ? toISODate(focusDate) : focusDate
  React.useEffect(() => {
    if (gridRef.current && !gridRef.current.contains(document.activeElement)) {
      const focus = (queryDate(gridRef.current, focusStr) || gridRef.current.querySelector(INSIDE_DATE)) as HTMLElement
      focusRef.current = focus.dataset.date as string
      focus.tabIndex = 0
    }
  }, [focusStr, gridRef])

  const { onFocus, onBlur } = props
  props.onFocus = (e) => {
    focusRef.current = null
    e.target.tabIndex = -1
    onFocus?.(e)
  }
  props.onBlur = (e) => {
    if (isFocusOut(e) && e.target.dataset.date) {
      focusRef.current = e.target.dataset.date
      e.target.tabIndex = 0
    }
    onBlur?.(e)
  }
  return (date: string) => date === focusRef.current ? 0 : -1
}

const isDateArray = (a: string[] | Date[]): a is Date[] => typeof a[0] === 'object'

const makeSelectedCallback = (selected: BaseProps['selected']): (d: string) => boolean => {
  if (!selected) {
    return () => false
  } else if (Array.isArray(selected)) {
    if (selected.length > 50) {
      const vals = new Set<string>()
      if (isDateArray(selected)) {
        selected.forEach((d) => vals.add(toISODate(d)))
      } else {
        selected.forEach(vals.add, vals)
      }
      return Set.prototype.has.bind(vals)
    } else if (isDateArray(selected)) {
      selected = selected.map(toISODate)
    }
    return Array.prototype.includes.bind(selected as string[])
  } else {
    const isoSelected = typeof selected === 'string' ? selected : toISODate(selected)
    return (d) => d === isoSelected
  }
}

const TODAY = new Date()

const CalendarGridBase = ({ focusDate = TODAY, locale, labels = {}, isValidDate, selected, ...props }: BaseProps) => {
  const gridRef = useRefWithId<HTMLDivElement>(props.id)
  const id = gridRef.current.id
  const { labelDate, labelDisabled, weekdays } = labels
  const header = React.useMemo(() => makeGridHeader(id, locale, weekdays), [id, locale, weekdays])

  let month: number, year: number
  if (typeof focusDate === 'string') {
    [year, month] = dateParts(focusDate)
  } else {
    month = focusDate.getMonth()
    year = focusDate.getFullYear()
  }
  const grid = React.useMemo(
    () => makeGrid(month, year, locale, isValidDate, labelDate, labelDisabled),
    [month, year, locale, isValidDate, labelDate, labelDisabled]
  )
  const getTabIndex = useTabIndexCallback(focusDate, gridRef, props)
  const isSelected = React.useMemo(() => makeSelectedCallback(selected), [selected])
  return (
    <div {...props} id={id} ref={gridRef} role="grid">
      {header && <div role="row" key="header">{header}</div>}
      {grid.map((row, ix) => (
        <div role="row" key={ix}>
          {row.map((dateProps, jx) => {
            if (header) {
              dateProps['aria-describedby'] = header[jx].props.id
            }
            dateProps['aria-selected'] = isSelected(dateProps['data-date'])
            dateProps.tabIndex = getTabIndex(dateProps['data-date'])
            return (
              <span {...dateProps} key={jx} role="gridcell" />
            )
          })}
        </div>
      ))}
    </div>
  )
}

// TODO Switch to cactus-theme helpers
export const CalendarGrid = styled(CalendarGridBase).withConfig(
  omitProps<CalendarGridProps>(margin, 'radius')
)`
  ${(p) => textStyle(p.theme, 'small')};
  text-align: center;
  color: ${(p) => p.theme.colors.darkestContrast};
  background-color: ${(p) => p.theme.colors.lightContrast};
  padding: 0 10px;
  box-sizing: border-box;
  display: inline-block;
  width: 300px;

  ${margin}
  ${(p) => p.radius && `border-radius: ${radius(p, p.radius)};`}

  [role='row'] {
    display: flex;
  }

  span {
    box-sizing: border-box;
    display: inline-block;
    padding: 8px 0;
    text-align: 0;
    border-radius: 50%;
    flex: 0 0 40px;
  }

  [role='columnheader'] {
    font-weight: 600;
  }

  .outside-date {
    color: ${(p) => p.theme.colors.mediumContrast};
  }

  *:focus {
    outline: none;
    background-color: ${(p) => p.theme.colors.lightCallToAction};

    &[aria-disabled='true'] {
      background-color: ${(p) => p.theme.colors.errorLight};
    }
  }

  [aria-disabled='true'] {
    color: ${(p) => p.theme.colors.mediumContrast};
  }

  [aria-disabled='false'] {
    cursor: pointer;
    :hover {
      background-color: ${(p) => p.theme.colors.lightCallToAction};
    }
  }

  [aria-selected='true'] {
    background-color: ${(p) => p.theme.colors.callToAction};
    color: ${(p) => p.theme.colors.white};

    &.outside-date {
      color: ${(p) => p.theme.colors.darkContrast};
      background-color: ${(p) => p.theme.colors.lightCallToAction};
    }
  }
` as React.FC<CalendarGridProps>

export default CalendarGrid
