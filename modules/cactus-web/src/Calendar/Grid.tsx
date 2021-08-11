import { border, color, colorStyle, insetBorder, radius, textStyle } from '@repay/cactus-theme'
import React from 'react'
import styled, { DefaultTheme, StyledComponent } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { isActionKey } from '../helpers/a11y'
import { getFormatter } from '../helpers/dates'
import { isFocusOut } from '../helpers/events'
import { omitProps } from '../helpers/omit'
import generateId from '../helpers/generateId'
import { getCurrentFocusIndex } from '../helpers/focus'

export type CalendarDate = string | Date
export type CalendarValue = CalendarDate | string[] | Date[] | null
export type WeekdayLabel = string | ComplexWeekdayLabel
interface ComplexWeekdayLabel {
  long: string
  short: string
}

export interface CalendarGridLabels {
  labelDate?: (d: Date) => string
  labelDisabled?: (normalLabel: string) => string
  weekdays?: WeekdayLabel[] | null
}

interface BaseProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: never
  locale?: string
  isValidDate?: (d: Date) => boolean
  selected?: CalendarValue
  labels?: CalendarGridLabels
  onFocusOverflow?: (d: Date) => void
}

export interface CalendarGridProps extends BaseProps, MarginProps {
  focusDate?: CalendarDate
}

interface InnerProps extends BaseProps {
  focusStr: string
  month: number
  year: number
}

// toISOString messes with timezones and can return the wrong date;
// similarly `new Date(string)` treats ISO date strings like midnight UTC.
const zfill = (pad: string, num: number) => {
  const result = pad + num
  return result.slice(result.length - pad.length - 1)
}
export const toISODate = (date: Date): string =>
  [
    zfill('000', date.getFullYear()),
    zfill('0', date.getMonth() + 1),
    zfill('0', date.getDate()),
  ].join('-')
export const dateParts = (date: string): [number, number, number] => {
  const [year, month, day] = date.split('-')
  return [parseInt(year), parseInt(month) - 1, parseInt(day)]
}
export const clampDate = (date: Date, method: 'setDate' | 'setMonth' | 'setFullYear', value: number): void => {
  const month = method !== 'setMonth' ? date.getMonth() : value < 0 ? 12 + value : value % 12
  date[method](value)
  if (date.getMonth() !== month) {
    date.setDate(0)
  }
}

const makeGridHeader = (locale?: string, weekdayLabels: WeekdayLabel[] | null = []) => {
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
  const last = new Date(year, month + 1, 1).valueOf()
  while (date.valueOf() < last) {
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

export const queryDate = (root: HTMLElement, date: string): HTMLElement | null =>
  root.querySelector<HTMLElement>(`[data-date='${date}']:not(.outside-date)`)

const useFocusBehavior = (
  focusStr: string,
  onFocusOverflow: undefined | ((d: Date) => void),
  props: React.HTMLAttributes<HTMLDivElement>
): ((d: string) => number) => {
  const focusRef = React.useRef<string | null>(focusStr)
  const { onClick, onKeyDown, onFocus, onBlur } = props
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
  props.onClick = (e) => {
    onClick?.(e)
    const target = e.target as HTMLElement
    if (!e.isDefaultPrevented() && onFocusOverflow && target.matches('.outside-date')) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onFocusOverflow(new Date(...dateParts(target.dataset.date!)))
    }
  }
  props.onKeyDown = (e) => {
    onKeyDown?.(e)
    if (!e.isDefaultPrevented() && (e.target as HTMLElement).dataset.date) {
      const overflowDate = onGridKeyDown(e)
      if (onFocusOverflow && overflowDate) {
        onFocusOverflow(overflowDate)
      }
    }
  }
  return (date: string) => (date === focusRef.current ? 0 : -1)
}

type FocusShift = 'day' | 'month' | 'year' | 'weekday'
const setGridFocus = (e: React.KeyboardEvent<HTMLDivElement>, shift: number, type: FocusShift) => {
  e.stopPropagation()
  const dates = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[data-date]:not(.outside-date)'))
  const index = getCurrentFocusIndex(dates, 0)
  // The query guarantees it has a `data-date` attribute.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const date = new Date(...dateParts(dates[index].dataset.date!))
  const month = date.getMonth()
  const year = date.getFullYear()
  if (type === 'day') {
    date.setDate(date.getDate() + shift)
  } else if (type === 'month') {
    clampDate(date, 'setMonth', month + shift)
  } else if (type === 'year') {
    clampDate(date, 'setFullYear', year + shift)
  } else {
    // type === 'weekday'
    date.setDate(date.getDate() + shift - date.getDay())
  }
  // Only set the focusDate when the month/year changes, otherwise manage focus internally.
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

const isDateArray = (a: string[] | Date[]): a is Date[] => typeof a[0] === 'object'

const makeSelectedCallback = (selected: BaseProps['selected']): ((d: string) => boolean) => {
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

const CalendarGridBase = ({
  focusStr,
  month,
  year,
  locale,
  labels = {},
  isValidDate,
  selected,
  onFocusOverflow,
  ...props
}: InnerProps) => {
  const { labelDate, labelDisabled, weekdays } = labels
  const header = React.useMemo(() => makeGridHeader(locale, weekdays), [locale, weekdays])

  const grid = React.useMemo(
    () => makeGrid(month, year, locale, isValidDate, labelDate, labelDisabled),
    [month, year, locale, isValidDate, labelDate, labelDisabled]
  )
  const getTabIndex = useFocusBehavior(focusStr, onFocusOverflow, props)
  const isSelected = React.useMemo(() => makeSelectedCallback(selected), [selected])
  return (
    <div {...props} role="grid">
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
            dateProps.tabIndex = getTabIndex(dateProps['data-date'])
            return <span {...dateProps} key={jx} role="gridcell" />
          })}
        </div>
      ))}
    </div>
  )
}

const deriveAttrs = ({ focusDate = new Date() }: CalendarGridProps) => {
  let month: number, year: number
  let focusStr = focusDate as string
  if (typeof focusDate === 'object') {
    focusStr = toISODate(focusDate)
    month = focusDate.getMonth()
    year = focusDate.getFullYear()
  } else {
    ;[year, month] = dateParts(focusDate)
  }
  // Set `key` to force a remount when the month/year changes.
  return { as: CalendarGridBase, key: focusStr.slice(0, 7), focusStr, month, year }
}

// TODO Figure out the right style for selected `.outside-date`
const OUTLINE = { thin: '2px' }
export const CalendarGrid = styled(CalendarGridBase)
  .withConfig(omitProps<any>(margin, 'focusDate'))
  .attrs(deriveAttrs)`
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
` as StyledComponent<React.FC<CalendarGridProps>, DefaultTheme>

export default CalendarGrid
