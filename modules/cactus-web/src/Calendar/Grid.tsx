import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { getFormatter } from '../helpers/dates'
import useId from '../helpers/useId'
import { omitProps } from '../helpers/omit'
import { textStyle } from '../helpers/theme'

export type CalendarDate = string | Date
export type CalendarValue = CalendarDate | CalendarDate[]
export type WeekdayLabel = string | {
  long: string
  short: string
}

interface BaseProps extends React.HTMLAttributes<HTMLDivElement> {
  children: never
  month: number
  year: number
  locale?: string
  isValidDate?: (d: Date) => boolean
  selected?: CalendarValue
  labels?: {
    labelDate?: (d: Date) => string
    labelDisabled?: (normalLabel: string) => string
    weekdays?: WeekdayLabel[]
  }
}

export interface CalendarGridProps extends BaseProps, MarginProps {
  radius?: number
}

export const toISODate = (date: Date): string => date.toISOString().slice(0, 10)

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

const CalendarGridBase = ({ month, year, locale, labels = {}, isValidDate, selected, ...props }: BaseProps) => {
  const id = useId(props.id)
  const { labelDate, labelDisabled, weekdays } = labels
  const header = React.useMemo(() => makeGridHeader(id, locale, weekdays), [id, locale, weekdays])
  const grid = React.useMemo(
    () => makeGrid(month, year, locale, isValidDate, labelDate, labelDisabled),
    [month, year, locale, isValidDate, labelDate, labelDisabled]
  )
  let isSelected: (d: string) => boolean
  if (!selected) {
    isSelected = () => false
  } else if (Array.isArray(selected)) {
    isSelected = Array.prototype.includes.bind(typeof selected[0] === 'string' ? selected : (selected as Date[]).map(toISODate))
  } else {
    const isoSelected = typeof selected === 'string' ? selected : toISODate(selected)
    isSelected = (d) => d === isoSelected
  }
  return (
    <div {...props} id={id} role="grid">
      {header && <div role="row" key="header">{header}</div>}
      {grid.map((row, ix) => (
        <div role="row" key={ix}>
          {row.map((dateProps, jx) => {
            if (header) {
              dateProps['aria-describedby'] = header[jx].props.id
            }
            dateProps['aria-selected'] = isSelected(dateProps['data-date'])
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
  omitProps<CalendarGridProps>(margin)
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
