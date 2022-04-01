import { act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import { toISODate } from '../helpers/dates'
import Calendar, { MonthChange } from './Calendar'

const NOW = new Date()
const ISO_NOW = toISODate(NOW)
const TODAY = ISO_NOW.slice(8)
const THIS_YEAR = ISO_NOW.slice(0, 4)
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const queryByAttr = (root: Element, attr: string, value: unknown) =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  root.querySelector<HTMLElement>(`[${attr}="${value}"]`)!

const queryAllByAttr = (root: Element, attr: string, value: unknown) =>
  root.querySelectorAll<HTMLElement>(`[${attr}="${value}"]`)

const getRelatedElement = (attr: string, elem = document.activeElement) =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById(elem?.getAttribute(attr) || '')!

const action = (method: keyof typeof userEvent, ...args: any[]) =>
  act(() => {
    ;(userEvent[method] as any)(...args)
  })

describe('component: Calendar', () => {
  describe('subcomponent: Grid', () => {
    describe('Grid props', () => {
      test('initialFocus controls displayed month', () => {
        const { container } = renderWithTheme(<Calendar.Grid initialFocus="2021-08-25" />)
        const days = queryAllByAttr(container, 'role', 'gridcell')
        expect(days).toHaveLength(35)
        expect(days[0]).toHaveAttribute('data-date', '2021-08-01')
        // Overflows into September.
        expect(days[34]).toHaveAttribute('data-date', '2021-09-04')
        expect(days[24]).toHaveAttribute('data-date', '2021-08-25')
        const focused = Array.prototype.filter.call(days, (x) => x.tabIndex === 0)
        expect(focused).toEqual([days[24]])
      })

      test('month/year override initialFocus month/year', () => {
        const { container } = renderWithTheme(
          <Calendar.Grid initialFocus={NOW} month={6} year={2021} />
        )
        const days = queryAllByAttr(container, 'role', 'gridcell')
        expect(days).toHaveLength(35)
        // Overflows into June.
        expect(days[0]).toHaveAttribute('data-date', '2021-06-27')
        expect(days[34]).toHaveAttribute('data-date', '2021-07-31')
        const focused = queryAllByAttr(container, 'tabindex', '0')
        expect(focused).toHaveLength(1)
        expect(focused[0]).toHaveAttribute('data-date', `2021-07-${TODAY}`)
      })

      test('selected can override initialFocus day', () => {
        const { container } = renderWithTheme(
          <>
            <Calendar.Grid initialFocus="2020-09-03" selected="2020-09-15" />
            <Calendar.Grid initialFocus="2021-09-03" selected="2021-10-15" />
          </>
        )
        const focused = queryAllByAttr(container, 'tabindex', '0')
        expect(focused).toHaveLength(2)
        expect(focused[0]).toHaveAttribute('data-date', '2020-09-15')
        expect(focused[0]).toHaveAttribute('aria-selected', 'true')
        // Because the year & month don't match, selected doesn't override day.
        expect(focused[1]).toHaveAttribute('data-date', '2021-09-03')
      })

      test('isValidDate disables matching dates', () => {
        const { container } = renderWithTheme(
          <Calendar.Grid isValidDate={(d) => !!(d.getDate() % 10)} />
        )
        const query = queryAllByAttr(container, 'aria-disabled', 'true')
        const disabled = Array.prototype.filter.call(query, (x) => !x.matches('.outside-date'))
        expect(disabled).toHaveLength(NOW.getMonth() === 1 ? 2 : 3)
        const ym = ISO_NOW.slice(0, 8)
        expect(disabled[0]).toHaveAttribute('data-date', ym + '10')
        expect(disabled[1]).toHaveAttribute('data-date', ym + '20')
      })

      test('locale affects default labels', () => {
        const { container } = renderWithTheme(
          <Calendar.Grid initialFocus="2020-05-24" locale="es-US" />
        )
        const sunday = queryByAttr(container, 'role', 'columnheader')
        expect(sunday).toHaveTextContent('do')
        expect(sunday).toHaveAttribute('aria-label', 'domingo')
        const cell = queryByAttr(container, 'data-date', '2020-05-15')
        expect(cell).toHaveAttribute('aria-label', 'viernes, 15 de mayo de 2020')
      })

      test('labelDisabled is applied to disabled date labels', () => {
        const { container } = renderWithTheme(
          <Calendar.Grid
            labels={{
              labelDate: toISODate,
              labelDisabled: (l) => 'DISABLED: ' + l,
            }}
            isValidDate={() => Math.random() > 0.5}
          />
        )
        const disabled = queryByAttr(container, 'aria-disabled', 'true')
        expect(disabled).toHaveAttribute('aria-label', `DISABLED: ${disabled?.dataset.date}`)
        const enabled = queryByAttr(container, 'aria-disabled', 'false')
        expect(enabled).toHaveAttribute('aria-label', enabled?.dataset.date)
      })

      test('weekday labels: null removes header row', () => {
        const { container, queryByRole } = renderWithTheme(
          <Calendar.Grid labels={{ weekdays: null }} />
        )
        expect(queryByRole('columnheader')).toBe(null)
        expect(queryByAttr(container, 'role', 'gridcell')).not.toBe(null)
      })

      test('weekday labels: string array controls visual text', () => {
        const weekdays = ['I', 'saw', 'the', 'sun']
        const { container } = renderWithTheme(<Calendar.Grid labels={{ weekdays }} />)
        const days = queryAllByAttr(container, 'role', 'columnheader')
        expect(days).toHaveLength(7)
        weekdays.push('Th', 'Fr', 'Sa')
        for (let i = 0; i < 7; i++) {
          expect(days[i]).toHaveTextContent(weekdays[i])
          expect(days[i]).toHaveAttribute('aria-label', WEEKDAYS[i])
        }
      })

      test('weekday labels: object array controls visual text & labels', () => {
        const weekdays = [
          { short: 'I', long: 'myself' },
          { short: 'saw', long: '' },
          { short: '', long: 'the sun' },
          { short: 'stuff', long: 'John Silver' },
        ]
        const { container } = renderWithTheme(<Calendar.Grid labels={{ weekdays }} />)
        const days = queryAllByAttr(container, 'role', 'columnheader')
        expect(days).toHaveLength(7)
        for (let i = 0; i < 7; i++) {
          const { short, long } = weekdays[i] || {}
          expect(days[i]).toHaveTextContent(short || WEEKDAYS[i].slice(0, 2))
          expect(days[i]).toHaveAttribute('aria-label', long || WEEKDAYS[i])
        }
      })

      test('supports style props: margin', () => {
        const { getByRole } = renderWithTheme(<Calendar.Grid mb={3} ml={4} />)
        expect(getByRole('grid')).toHaveStyle({
          marginTop: '',
          marginRight: '',
          marginBottom: '8px',
          marginLeft: '16px',
        })
      })

      test('can have multiple selected dates', () => {
        // Selected can be in a different month, as long as it's displayed on the grid.
        const selected = ['2021-04-27', '2021-05-13', '2021-05-24', '2022-10-28']
        const { container } = renderWithTheme(
          <Calendar.Grid month={4} year={2021} selected={selected} />
        )
        const cells = queryAllByAttr(container, 'aria-selected', 'true')
        // Three because the fourth isn't displayed on this grid.
        expect(cells).toHaveLength(3)
        for (let i = 0; i < 3; i++) {
          expect(cells[i]).toHaveAttribute('data-date', selected[i])
        }
      })
    })

    describe('Grid focus events', () => {
      test('keyboard controls', () => {
        let lastOverflow = ''
        const onOverflow = jest.fn((d: Date) => {
          lastOverflow = toISODate(d)
        })
        renderWithTheme(<Calendar.Grid initialFocus="2021-12-19" onFocusOverflow={onOverflow} />)
        userEvent.tab()
        expect(document.activeElement).toHaveAttribute('data-date', '2021-12-19')
        userEvent.keyboard('{arrowup}')
        expect(document.activeElement).toHaveAttribute('data-date', '2021-12-12')
        userEvent.keyboard('{arrowleft}')
        expect(document.activeElement).toHaveAttribute('data-date', '2021-12-11')
        userEvent.keyboard('{home}')
        expect(document.activeElement).toHaveAttribute('data-date', '2021-12-05')
        userEvent.keyboard('{end}')
        expect(document.activeElement).toHaveAttribute('data-date', '2021-12-11')
        userEvent.keyboard('{arrowright}')
        expect(document.activeElement).toHaveAttribute('data-date', '2021-12-12')
        userEvent.keyboard('{arrowdown}')
        expect(document.activeElement).toHaveAttribute('data-date', '2021-12-19')

        expect(onOverflow).toHaveBeenCalledTimes(0)
        action('keyboard', '{PageUp}')
        expect(lastOverflow).toBe('2021-11-19')
        expect(document.activeElement).toHaveAttribute('data-date', lastOverflow)
        action('keyboard', '{shift}{PageUp}')
        expect(lastOverflow).toBe('2020-11-19')
        expect(document.activeElement).toHaveAttribute('data-date', lastOverflow)
        action('keyboard', '{PageDown}')
        expect(lastOverflow).toBe('2020-12-19')
        expect(document.activeElement).toHaveAttribute('data-date', lastOverflow)
        action('keyboard', '{shift}{PageDown}')
        expect(lastOverflow).toBe('2021-12-19')
        expect(document.activeElement).toHaveAttribute('data-date', lastOverflow)
        expect(onOverflow).toHaveBeenCalledTimes(4)
      })

      test('keyboard overflow', () => {
        let lastOverflow = ''
        const onOverflow = jest.fn((d: Date) => {
          lastOverflow = toISODate(d)
        })
        // Keyboard focus shifts even when dates are disabled.
        renderWithTheme(
          <Calendar.Grid
            initialFocus="2021-12-01"
            onFocusOverflow={onOverflow}
            isValidDate={() => false}
          />
        )
        userEvent.tab()
        expect(document.activeElement).toHaveAttribute('data-date', '2021-12-01')
        action('keyboard', '{arrowleft}')
        expect(lastOverflow).toBe('2021-11-30')
        expect(document.activeElement).toHaveAttribute('data-date', lastOverflow)
        action('keyboard', '{arrowdown}')
        expect(lastOverflow).toBe('2021-12-07')
        expect(document.activeElement).toHaveAttribute('data-date', lastOverflow)
        expect(onOverflow).toHaveBeenCalledTimes(2)
      })

      test('mouse overflow', () => {
        let lastOverflow = ''
        const onOverflow = jest.fn((d: Date) => {
          lastOverflow = toISODate(d)
        })
        const { getByLabelText } = renderWithTheme(
          <Calendar.Grid
            initialFocus="2021-12-19"
            onFocusOverflow={onOverflow}
            isValidDate={(d) => d.getDate() !== 2}
          />
        )
        action('click', getByLabelText('Monday, November 29, 2021'))
        expect(lastOverflow).toBe('2021-11-29')
        expect(document.activeElement).toHaveAttribute('data-date', lastOverflow)
        // Clicking on disabled dates doesn't lead to overflow.
        action('click', getByLabelText('Thursday, December 2, 2021'))
        expect(lastOverflow).toBe('2021-11-29')
        expect(document.activeElement).toHaveAttribute('data-date', '2021-12-02')
        expect(onOverflow).toHaveBeenCalledTimes(1)
      })

      test('focus shift on controlled month change', () => {
        const { container, rerender } = renderWithTheme(
          <Calendar.Grid initialFocus={{ day: 3 }} month={8} year={2021} />
        )
        expect(queryByAttr(container, 'tabindex', '0')).toHaveAttribute('data-date', '2021-09-03')
        // initialFocus is used in controlled month changes, but only the `day` part.
        rerender(<Calendar.Grid initialFocus={{ day: 17 }} month={2} year={2021} />)
        expect(queryByAttr(container, 'tabindex', '0')).toHaveAttribute('data-date', '2021-03-17')
        // If initialFocus isn't passed, it falls back to the original state.
        rerender(<Calendar.Grid month={2} year={2020} />)
        expect(queryByAttr(container, 'tabindex', '0')).toHaveAttribute('data-date', '2020-03-03')
      })
    })
  })

  describe('Calendar props', () => {
    test('initialFocus controls displayed month', () => {
      const { container } = renderWithTheme(<Calendar initialFocus="2021-08-25" />)
      const dropDowns = queryAllByAttr(container, 'aria-haspopup', 'listbox')
      expect(dropDowns).toHaveLength(2)
      expect(dropDowns[0]).toHaveTextContent('August')
      expect(dropDowns[1]).toHaveTextContent('2021')
      const days = queryAllByAttr(container, 'role', 'gridcell')
      expect(days).toHaveLength(35)
      expect(days[0]).toHaveAttribute('data-date', '2021-08-01')
      // Overflows into September.
      expect(days[34]).toHaveAttribute('data-date', '2021-09-04')
      expect(days[24]).toHaveAttribute('data-date', '2021-08-25')
      const focused = Array.prototype.filter.call(days, (x) => x.tabIndex === 0)
      expect(focused).toEqual([days[24]])
    })

    test('month/year override initialFocus month/year', () => {
      const { container, rerender } = renderWithTheme(
        <Calendar initialFocus="1999-12-31" month={6} year={2021} />
      )
      const dropDowns = queryAllByAttr(container, 'aria-haspopup', 'listbox')
      expect(dropDowns).toHaveLength(2)
      expect(dropDowns[0]).toHaveTextContent('July')
      expect(dropDowns[1]).toHaveTextContent('2021')
      const days = queryAllByAttr(container, 'role', 'gridcell')
      expect(days).toHaveLength(35)
      // Overflows into June.
      expect(days[0]).toHaveAttribute('data-date', '2021-06-27')
      expect(days[34]).toHaveAttribute('data-date', '2021-07-31')
      const focused = queryAllByAttr(container, 'tabindex', '0')
      expect(focused).toHaveLength(1)
      expect(focused[0]).toHaveAttribute('data-date', '2021-07-31')

      rerender(<Calendar month={1} year={2020} />)
      const focused2 = queryAllByAttr(container, 'tabindex', '0')
      expect(focused2).toHaveLength(1)
      expect(focused2[0]).toHaveAttribute('data-date', '2020-02-29')
    })

    test('isValidDate, locale, labels forwarded to Grid', () => {
      const { container } = renderWithTheme(
        <Calendar
          initialFocus="2020-05-24"
          locale="es-US"
          isValidDate={(d) => d.getDate() !== 15}
          labels={{
            labelDisabled: (l) => l + ', deshabilitado',
            weekdays: [{ short: 'Sol', long: 'Day of Sol' }],
          }}
        />
      )
      const weekdays = queryAllByAttr(container, 'role', 'columnheader')
      expect(weekdays[0]).toHaveTextContent('Sol')
      expect(weekdays[0]).toHaveAttribute('aria-label', 'Day of Sol')
      expect(weekdays[1]).toHaveTextContent('lu')
      expect(weekdays[1]).toHaveAttribute('aria-label', 'lunes')
      const cell = queryByAttr(container, 'data-date', '2020-05-15')
      expect(cell).toHaveAttribute('aria-label', 'viernes, 15 de mayo de 2020, deshabilitado')
      // Locale also affects the month drop-down:
      const button = queryByAttr(container, 'aria-haspopup', 'listbox')
      expect(button).toHaveTextContent('mayo')
    })

    test('Calendar control labels', () => {
      const months = ['Janus', 'Februa', 'Mars', 'Aperire', 'Maia', 'Juno', 'Julius', 'Augustus']
      const labels = {
        calendarKeyboardDirections: 'do whatever you want',
        showMonth: 'this is the month listbox',
        showYear: 'this is the year listbox',
        prevMonth: 'travel to the past',
        nextMonth: 'travel to the future',
        months,
      }
      renderWithTheme(<Calendar labels={labels} />)
      // It's a convenient way to collect the controls, so I'll also test tab order.
      userEvent.tab()
      const prevMonth = getRelatedElement('aria-labelledby')
      expect(prevMonth).toHaveTextContent(labels.prevMonth)

      userEvent.tab()
      const showMonth = getRelatedElement('aria-describedby')
      expect(showMonth).toHaveTextContent(labels.showMonth)
      const monthbox = getRelatedElement('aria-controls')
      expect(monthbox).toHaveAttribute('aria-labelledby', showMonth?.id)
      const monthOptions = queryAllByAttr(monthbox, 'role', 'option')
      expect(monthOptions).toHaveLength(12)
      months.push('September', 'October', 'November', 'December')
      for (let i = 0; i < 12; i++) {
        expect(monthOptions[i]).toHaveTextContent(months[i])
        expect(monthOptions[i]).toHaveAttribute('data-value', i.toString())
        if (i === NOW.getMonth()) {
          expect(document.activeElement).toHaveTextContent(months[i])
          expect(monthOptions[i]).toHaveAttribute('aria-selected', 'true')
        } else {
          expect(monthOptions[i]).not.toHaveAttribute('aria-selected')
        }
      }

      userEvent.tab()
      const showYear = getRelatedElement('aria-describedby')
      expect(showYear).toHaveTextContent(labels.showYear)
      const yearbox = getRelatedElement('aria-controls')
      expect(yearbox).toHaveAttribute('aria-labelledby', showYear?.id)
      const selectedYear = queryByAttr(yearbox, 'aria-selected', 'true')
      expect(selectedYear).toHaveTextContent(THIS_YEAR)
      expect(document.activeElement).toHaveTextContent(THIS_YEAR)
      expect(selectedYear).toHaveAttribute('data-value', THIS_YEAR)
      expect(selectedYear).toHaveAttribute('role', 'option')

      userEvent.tab()
      const nextMonth = getRelatedElement('aria-labelledby')
      expect(nextMonth).toHaveTextContent(labels.nextMonth)

      userEvent.tab()
      expect(document.activeElement).toHaveAttribute('role', 'gridcell')
      expect(document.activeElement).toHaveAttribute('data-date', ISO_NOW)
      const grid = document.activeElement?.closest('[role="grid"]') as HTMLElement
      const instructions = getRelatedElement('aria-describedby', grid)
      expect(instructions).toHaveTextContent(labels.calendarKeyboardDirections)
    })

    test('supports style props: margin', () => {
      const { getByRole } = renderWithTheme(<Calendar mb={3} ml={4} />)
      expect(getByRole('group')).toHaveStyle({
        marginTop: '',
        marginRight: '',
        marginBottom: '8px',
        marginLeft: '16px',
      })
    })
  })

  describe('Calendar change events', () => {
    const mockChange = jest.fn()
    afterEach(() => mockChange.mockClear())
    // This is to remove the event from the args list to make assertions easier.
    const onMonthChange = (change: MonthChange) => mockChange(change)
    const onChange = (event: any) => mockChange(event.target.value)

    test('click to change value', () => {
      const { getByLabelText } = renderWithTheme(
        <Calendar initialFocus="1986-04-02" onChange={onChange} />
      )
      const cell = getByLabelText('Sunday, April 13, 1986')
      expect(cell).toHaveAttribute('aria-selected', 'false')
      userEvent.click(cell)
      expect(cell).toHaveAttribute('aria-selected', 'true')
      expect(mockChange.mock.calls).toEqual([['1986-04-13']])
    })

    test('keyboard to change value', () => {
      // Use null so dates will be raised as Date instances.
      renderWithTheme(<Calendar defaultValue={null} onChange={onChange} />)

      userEvent.tab({ shift: true })
      const fromSpace = document.activeElement
      expect(fromSpace).toHaveAttribute('aria-selected', 'false')
      userEvent.keyboard('{space}')
      expect(fromSpace).toHaveAttribute('aria-selected', 'true')

      action('keyboard', '{arrowup}')
      const newDate = new Date(NOW)
      newDate.setDate(NOW.getDate() - 7)
      const fromEnter = document.activeElement
      expect(fromEnter).toHaveAttribute('aria-selected', 'false')
      userEvent.keyboard('{enter}')
      expect(fromEnter).toHaveAttribute('aria-selected', 'true')
      mockChange.mock.calls.forEach((call) => {
        expect(call[0] instanceof Date).toBe(true)
        call[0] = toISODate(call[0])
      })
      expect(mockChange.mock.calls).toEqual([[ISO_NOW], [toISODate(newDate)]])
    })

    test('readOnly prevents value change', () => {
      renderWithTheme(<Calendar onChange={onChange} readOnly />)
      userEvent.tab({ shift: true })
      expect(document.activeElement).toHaveAttribute('data-date', ISO_NOW)
      expect(document.activeElement).toHaveAttribute('aria-selected', 'false')
      userEvent.keyboard('{space}')
      expect(document.activeElement).toHaveAttribute('aria-selected', 'false')
      expect(mockChange).not.toHaveBeenCalled()
    })

    test('disabled prevents value change', () => {
      renderWithTheme(<Calendar onChange={onChange} disabled />)
      userEvent.tab({ shift: true })
      expect(document.activeElement).toHaveAttribute('data-date', ISO_NOW)
      expect(document.activeElement).toHaveAttribute('aria-selected', 'false')
      userEvent.keyboard('{space}')
      expect(document.activeElement).toHaveAttribute('aria-selected', 'false')
      expect(mockChange).not.toHaveBeenCalled()
    })

    test('prevMonth button', async () => {
      const { getByRole } = renderWithTheme(
        <Calendar initialFocus={{ month: 5 }} onMonthChange={onMonthChange} />
      )
      const prevMonth = getByRole('button', { name: 'Click to go back one month' })
      const monthButton = getByRole('button', { name: 'June' })
      userEvent.click(prevMonth)
      await waitFor(() => expect(monthButton).toHaveTextContent('May'))
      expect(mockChange.mock.calls).toEqual([
        [{ month: 4, year: NOW.getFullYear(), isFocusOverflow: false }],
      ])
    })

    test('nextMonth button', async () => {
      const { getByRole } = renderWithTheme(
        <Calendar initialFocus={{ month: 11 }} onMonthChange={onMonthChange} />
      )
      const nextMonth = getByRole('button', { name: 'Click to go forward one month' })
      const monthButton = getByRole('button', { name: 'December' })
      userEvent.click(nextMonth)
      await waitFor(() => expect(monthButton).toHaveTextContent('January'))
      expect(mockChange.mock.calls).toEqual([
        [{ month: 0, year: NOW.getFullYear() + 1, isFocusOverflow: false }],
      ])
    })

    test('click to change month', () => {
      const { getByRole } = renderWithTheme(
        <Calendar initialFocus={{ month: 9 }} onMonthChange={onMonthChange} />
      )
      const monthButton = getByRole('button', { name: 'October' })
      const monthbox = getRelatedElement('aria-controls', monthButton)
      expect(monthbox).not.toBeVisible()
      userEvent.click(monthButton)
      expect(monthbox).toBeVisible()
      // Ideally I'd use `getByRole('option', { name: 'February' })`, but it's about 15x
      // slower for some reason. Even restricted to just the monthbox, it's twice as slow.
      userEvent.click(queryByAttr(monthbox, 'data-value', '1'))
      expect(monthbox).not.toBeVisible()
      expect(monthButton).toHaveTextContent('February')
      expect(mockChange.mock.calls).toEqual([
        [{ month: 1, year: NOW.getFullYear(), isFocusOverflow: false }],
      ])
    })

    test('keyboard to change month', () => {
      const { getByRole } = renderWithTheme(
        <Calendar initialFocus={{ month: 9 }} onMonthChange={onMonthChange} />
      )
      const monthButton = getByRole('button', { name: 'October' })
      monthButton.focus()
      const monthbox = getRelatedElement('aria-controls', monthButton)
      expect(monthbox).not.toBeVisible()
      userEvent.keyboard('{enter}')
      expect(monthbox).toBeVisible()
      expect(document.activeElement).toHaveAttribute('role', 'option')
      userEvent.keyboard('{arrowdown}')
      expect(document.activeElement).toHaveTextContent('November')
      userEvent.keyboard('{PageUp}')
      expect(document.activeElement).toHaveTextContent('April')
      userEvent.keyboard('{home}')
      expect(document.activeElement).toHaveTextContent('January')
      userEvent.keyboard('{arrowup}')
      expect(document.activeElement).toHaveTextContent('December')
      // Pressing escape closes the listbox without changing anything.
      userEvent.keyboard('{esc}')
      expect(monthbox).not.toBeVisible()
      expect(monthButton).toHaveFocus()
      expect(monthButton).toHaveTextContent('October')
      expect(mockChange).toHaveBeenCalledTimes(0)

      userEvent.keyboard('{space}')
      expect(monthbox).toBeVisible()
      expect(document.activeElement).toHaveAttribute('role', 'option')
      userEvent.keyboard('{end}')
      expect(document.activeElement).toHaveTextContent('December')
      userEvent.keyboard('{PageDown}')
      expect(document.activeElement).toHaveTextContent('July')
      userEvent.keyboard('{space}')
      expect(monthbox).not.toBeVisible()
      expect(monthButton).toHaveFocus()
      expect(monthButton).toHaveTextContent('July')
      // Note that even though we wrapped around the list, the year doesn't change.
      expect(mockChange.mock.calls).toEqual([
        [{ month: 6, year: NOW.getFullYear(), isFocusOverflow: false }],
      ])
    })

    test('click to change year', () => {
      const { getByRole } = renderWithTheme(<Calendar onMonthChange={onMonthChange} />)
      const yearButton = getByRole('button', { name: THIS_YEAR })
      const yearbox = getRelatedElement('aria-controls', yearButton)
      expect(yearbox).not.toBeVisible()
      userEvent.click(yearButton)
      expect(yearbox).toBeVisible()
      // If getByRole was slow with 12 months, I shudder to think how it would fare with 200 years.
      userEvent.click(queryByAttr(yearbox, 'data-value', '1986'))
      expect(yearbox).not.toBeVisible()
      expect(yearButton).toHaveTextContent('1986')
      expect(mockChange.mock.calls).toEqual([
        [{ month: NOW.getMonth(), year: 1986, isFocusOverflow: false }],
      ])
    })

    test('keyboard to change year', () => {
      // This uses the same component as months, so I'm not going to re-test all the controls.
      const { getByRole } = renderWithTheme(<Calendar onMonthChange={onMonthChange} />)
      const yearButton = getByRole('button', { name: THIS_YEAR })
      const yearbox = getRelatedElement('aria-controls', yearButton)
      yearButton.focus()
      expect(yearbox).not.toBeVisible()
      userEvent.keyboard('{space}')
      expect(yearbox).toBeVisible()
      expect(document.activeElement).toHaveAttribute('role', 'option')
      expect(document.activeElement).toHaveAttribute('aria-selected', 'true')
      userEvent.keyboard('{arrowdown}{PageUp}{space}')
      expect(yearbox).not.toBeVisible()
      const year = NOW.getFullYear() - 6
      expect(yearButton).toHaveTextContent(year.toString())
      expect(mockChange.mock.calls).toEqual([
        [{ month: NOW.getMonth(), year, isFocusOverflow: false }],
      ])
    })

    test('click to change value + grid overflow', () => {
      const { getByLabelText } = renderWithTheme(
        <Calendar initialFocus="2021-08-01" onChange={onChange} onMonthChange={onMonthChange} />
      )
      const cell = getByLabelText('Thursday, September 2, 2021')
      userEvent.click(cell)
      expect(cell).not.toBeInTheDocument()
      expect(mockChange.mock.calls).toEqual([
        ['2021-09-02'],
        [{ month: 8, year: 2021, isFocusOverflow: true }],
      ])
    })

    test('keyboard grid overflow', () => {
      renderWithTheme(<Calendar initialFocus="2021-12-31" onMonthChange={onMonthChange} />)
      userEvent.tab({ shift: true })
      action('keyboard', '{arrowright}')
      expect(document.activeElement).toHaveAttribute('data-date', '2022-01-01')
      action('keyboard', '{PageUp}')
      expect(document.activeElement).toHaveAttribute('data-date', '2021-12-01')
      action('keyboard', '{shift}{PageDown}')
      expect(document.activeElement).toHaveAttribute('data-date', '2022-12-01')
      expect(mockChange.mock.calls).toEqual([
        [{ month: 0, year: 2022, isFocusOverflow: true }],
        [{ month: 11, year: 2021, isFocusOverflow: true }],
        [{ month: 11, year: 2022, isFocusOverflow: true }],
      ])
    })
  })
})
