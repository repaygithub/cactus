import { act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import animationRender from '../../tests/helpers/animationRender'
import renderWithTheme from '../../tests/helpers/renderWithTheme'
import { PartialDate } from '../helpers/dates'
import KeyCodes from '../helpers/keyCodes'
import Modal from '../Modal/Modal'
import DateInput from './DateInput'

describe('component: DateInput', () => {
  describe('can be controlled', () => {
    test('with value as a Date', () => {
      const value = new Date(2018, 8, 30)
      const { getByLabelText, rerender } = renderWithTheme(
        <DateInput name="date-input" id="date-input" value={new Date(+value)} />
      )
      expect(getByLabelText('year')).toHaveProperty('value', '2018')
      expect(getByLabelText('month')).toHaveProperty('value', '09')
      expect(getByLabelText('day of month')).toHaveProperty('value', '30')

      value.setDate(12)

      rerender(<DateInput name="date-input" id="date-input" value={new Date(+value)} />)

      expect(getByLabelText('year')).toHaveProperty('value', '2018')
      expect(getByLabelText('month')).toHaveProperty('value', '09')
      expect(getByLabelText('day of month')).toHaveProperty('value', '12')
    })

    test('when initial value = null then a Date is raised', () => {
      let value: any = null
      const handleChange = jest.fn((e) => {
        value = e.target.value
      })
      const { getByLabelText } = renderWithTheme(
        <DateInput name="date-input" id="date-input" value={value} onChange={handleChange} />
      )

      userEvent.type(getByLabelText('month'), '2')
      expect(Number.isNaN(value)).toBe(true)
      userEvent.type(getByLabelText('day of month'), '14')
      expect(Number.isNaN(value)).toBe(true)
      userEvent.type(getByLabelText('year'), '2019')
      expect(value).toEqual(new Date(2019, 1, 14))

      expect(handleChange).toHaveBeenCalledTimes(7)
    })

    test('with value as a string', () => {
      const value = new PartialDate('2018-09-30', 'YYYY-MM-dd')
      const { getByLabelText, rerender } = renderWithTheme(
        <DateInput name="date-input" id="date-input" format="YYYY-MM-dd" value={value.format()} />
      )
      expect(getByLabelText('year')).toHaveProperty('value', '2018')
      expect(getByLabelText('month')).toHaveProperty('value', '09')
      expect(getByLabelText('day of month')).toHaveProperty('value', '30')

      value.setDate(12)

      act(() => {
        rerender(
          <DateInput name="date-input" id="date-input" format="YYYY-MM-dd" value={value.format()} />
        )
      })

      expect(getByLabelText('year')).toHaveProperty('value', '2018')
      expect(getByLabelText('month')).toHaveProperty('value', '09')
      expect(getByLabelText('day of month')).toHaveProperty('value', '12')
    })

    test('when initial value = undefined then a string is raised', () => {
      let value = undefined
      const handleChange = jest.fn((e) => {
        value = e.target.value
      })
      const { getByLabelText } = renderWithTheme(
        <DateInput name="date-input" id="date-input" value={value} onChange={handleChange} />
      )

      userEvent.type(getByLabelText('month'), '2')
      expect(Number.isNaN(value)).toBe(true)
      userEvent.type(getByLabelText('day of month'), '14')
      expect(Number.isNaN(value)).toBe(true)
      userEvent.type(getByLabelText('year'), '2019')
      expect(value).toEqual('2019-02-14')

      expect(handleChange).toHaveBeenCalledTimes(7)
    })

    test.each([
      { date: '2019-09-16', clear: '', repr: 'empty string' },
      { date: new Date(2019, 8, 16), clear: null, repr: 'null' },
    ])('Clear the value with $repr', ({ date, clear }) => {
      const { getByLabelText, rerender } = renderWithTheme(
        <DateInput name="date-input" id="date-input" value={date} />
      )

      expect(getByLabelText('year')).toHaveProperty('value', '2019')
      expect(getByLabelText('month')).toHaveProperty('value', '09')
      expect(getByLabelText('day of month')).toHaveProperty('value', '16')

      rerender(<DateInput name="date-input" id="date-input" value={clear} />)

      expect(getByLabelText('year')).toHaveProperty('value', '')
      expect(getByLabelText('month')).toHaveProperty('value', '')
      expect(getByLabelText('day of month')).toHaveProperty('value', '')
    })

    test.each([
      { initFocus: '2019-09-16', repr: 'string' },
      { initFocus: new Date(2019, 8, 16), repr: 'date' },
      { initFocus: { year: 2019, month: 8, day: 16 }, repr: 'object' },
    ])('Initially focus a date using $repr', async ({ initFocus }) => {
      const { getByLabelText, getByRole } = renderWithTheme(
        <DateInput name="date-input" id="date-input" initialFocus={initFocus} />
      )

      userEvent.click(getByLabelText('Open date picker'))

      await animationRender()

      expect(getByRole('button', { name: 'September' })).toBeInTheDocument()
      expect(getByRole('button', { name: '2019' })).toBeInTheDocument()
      expect(getByLabelText('Monday, September 16, 2019')).toHaveFocus()
    })

    test('Ignore initialFocus if value is already set', async () => {
      const value = new Date(2022, 2, 3)
      const initFocus = new Date(2019, 8, 16)
      const { getByLabelText, getByRole } = renderWithTheme(
        <DateInput name="date-input" id="date-input" value={value} initialFocus={initFocus} />
      )

      userEvent.click(getByLabelText('Open date picker'))

      await animationRender()

      expect(getByRole('button', { name: 'March' })).toBeInTheDocument()
      expect(getByRole('button', { name: '2022' })).toBeInTheDocument()
      expect(getByLabelText('Thursday, March 3, 2022')).toHaveFocus()
    })

    test('Ignores value prop when NaN', () => {
      const { getByLabelText, rerender } = renderWithTheme(
        <DateInput name="date-input" id="date-input" value="2019-09-16" />
      )

      expect(getByLabelText('year')).toHaveProperty('value', '2019')
      expect(getByLabelText('month')).toHaveProperty('value', '09')
      expect(getByLabelText('day of month')).toHaveProperty('value', '16')

      rerender(<DateInput name="date-input" id="date-input" value={NaN} />)

      expect(getByLabelText('year')).toHaveProperty('value', '2019')
      expect(getByLabelText('month')).toHaveProperty('value', '09')
      expect(getByLabelText('day of month')).toHaveProperty('value', '16')
    })
  })

  describe('using inputs', () => {
    test('the up arrow increases value', async () => {
      let value = new Date(2018, 8, 30)
      const onChange = jest.fn((e) => {
        value = e.target.value
      })
      const { getByLabelText } = renderWithTheme(
        <DateInput name="date-input" id="date-input" value={new Date(+value)} onChange={onChange} />
      )
      const MM = getByLabelText('month')
      // @ts-ignore
      fireEvent.keyDown(MM, { key: 'ArrowUp', target: MM })

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(value).toEqual(new Date(2018, 9, 30))
    })

    test('the down arrow decreases value', async () => {
      let value = new Date(2018, 8, 30)
      const onChange = jest.fn((e) => {
        value = e.target.value
      })
      const { getByLabelText } = renderWithTheme(
        <DateInput name="date-input" id="date-input" value={new Date(+value)} onChange={onChange} />
      )
      const dd = getByLabelText('day of month')
      // @ts-ignore
      fireEvent.keyDown(dd, { key: 'ArrowDown', target: dd })

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(value).toEqual(new Date(2018, 8, 29))
    })

    test('the down arrow will loop when value is 1', async () => {
      let value = new Date(2018, 8, 1)
      const onChange = jest.fn((e) => {
        value = e.target.value
      })
      const { getByLabelText } = renderWithTheme(
        <DateInput name="date-input" id="date-input" value={new Date(+value)} onChange={onChange} />
      )
      const dd = getByLabelText('day of month')
      // @ts-ignore
      fireEvent.keyDown(dd, { key: 'ArrowDown', target: dd })

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(value).toEqual(new Date(2018, 8, 30))
    })

    test('the up arrow will loop when value is last day of month', async () => {
      let value = new Date(2018, 8, 30)
      const onChange = jest.fn((e) => {
        value = e.target.value
      })
      const { getByLabelText } = renderWithTheme(
        <DateInput name="date-input" id="date-input" value={new Date(+value)} onChange={onChange} />
      )
      const dd = getByLabelText('day of month')
      // @ts-ignore
      fireEvent.keyDown(dd, { key: 'ArrowUp', target: dd })

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(value).toEqual(new Date(2018, 8, 1))
    })

    test('looping works with February and leap year', async () => {
      let value = new Date(2020, 1, 28)
      const onChange = jest.fn((e) => {
        value = e.target.value
      })
      const { getByLabelText, rerender } = renderWithTheme(
        <DateInput name="date-input" id="date-input" value={new Date(+value)} onChange={onChange} />
      )
      const dd = getByLabelText('day of month')
      // @ts-ignore
      fireEvent.keyDown(dd, { key: 'ArrowUp', target: dd })

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(value).toEqual(new Date(2020, 1, 29))

      rerender(
        <DateInput name="date-input" id="date-input" value={new Date(+value)} onChange={onChange} />
      )
      // @ts-ignore
      fireEvent.keyDown(dd, { key: 'ArrowUp', target: dd })
      expect(onChange).toHaveBeenCalledTimes(2)
      expect(value).toEqual(new Date(2020, 1, 1))
    })
  })

  describe('type=date (default)', () => {
    test('renders date picker button', () => {
      const { getByLabelText } = renderWithTheme(<DateInput name="date-input" id="date-input" />)

      expect(getByLabelText('Open date picker')).toBeInTheDocument()
    })

    test('can open portal', () => {
      const { getByLabelText, getByRole } = renderWithTheme(
        <DateInput name="date-input" id="date-input" />
      )

      const portalTrigger = getByLabelText('Open date picker')
      act(() => {
        // mouse down and touch start used to ensure raised before blur events
        fireEvent.mouseDown(portalTrigger)
        fireEvent.click(portalTrigger)
      })
      expect(getByRole('dialog')).toBeInTheDocument()
    })

    test('can close calendar on blur, even inside a modal', () => {
      const { getByLabelText, getByText } = renderWithTheme(
        <Modal isOpen={true} onClose={() => undefined}>
          <div>Click here to blur the calendar</div>
          <DateInput name="date-input" id="date-input" />
        </Modal>
      )
      const portalTrigger = getByLabelText('Open date picker')
      userEvent.click(portalTrigger)
      const elementInDialog = getByLabelText('Click to go forward one month')
      expect(elementInDialog).toBeVisible()
      userEvent.click(getByText('Click here to blur the calendar'))
      expect(elementInDialog).not.toBeInTheDocument()
    })

    test('focus set to current date when no value selected', async () => {
      const { getByLabelText } = renderWithTheme(<DateInput name="date-input" id="date-input" />)

      const portalTrigger = getByLabelText('Open date picker')
      userEvent.click(portalTrigger)
      await animationRender()
      const today = PartialDate.from(new Date(), { type: 'date', format: 'YYYY-MM-dd' })
      expect(document.activeElement).toBe(getByLabelText(today.toLocaleSpoken('date')))
    })

    test('can select date from date picker and use month year selection', async () => {
      let value: any
      const handleChange = jest.fn((e) => {
        value = e.target.value
      })
      const { getByLabelText, getByRole, getByText } = renderWithTheme(
        <DateInput
          name="date_input"
          id="date-input"
          format="YYYY-MM-dd"
          onChange={handleChange}
          defaultValue="2021-06-15"
        />
      )

      const portalTrigger = getByLabelText('Open date picker')
      userEvent.click(portalTrigger)
      await animationRender()
      const desiredDate = PartialDate.from('2018-03-23', { type: 'date', format: 'YYYY-MM-dd' })
      userEvent.click(getByRole('button', { name: 'June' }))
      userEvent.click(getByText('March'))
      userEvent.click(getByRole('button', { name: '2021' }))
      userEvent.click(getByText('2018'))
      // @ts-ignore
      userEvent.click(getByLabelText(desiredDate.toLocaleSpoken('date')))
      expect(handleChange).toHaveBeenCalledTimes(3)
      expect(value).toEqual('2018-03-23')
    })

    test('can change month using left arrow', async () => {
      let value: any
      const handleChange = jest.fn((e) => {
        value = e.target.value
      })
      const { getByLabelText } = renderWithTheme(
        <DateInput
          name="date_input"
          id="date-input"
          format="YYYY-MM-dd"
          value="2018-03-23"
          onChange={handleChange}
        />
      )

      const portalTrigger = getByLabelText('Open date picker')
      userEvent.click(portalTrigger)
      await animationRender()
      await act(async () => {
        fireEvent.click(getByLabelText('Click to go back one month'))
        await animationRender()
      })
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(value).toEqual('2018-02-23')
    })

    test('can change month using right arrow', async () => {
      let value: any
      const handleChange = jest.fn((e) => {
        value = e.target.value
      })
      const { getByLabelText } = renderWithTheme(
        <DateInput
          name="date_input"
          id="date-input"
          format="YYYY-MM-dd"
          value="2018-03-23"
          onChange={handleChange}
        />
      )

      const portalTrigger = getByLabelText('Open date picker')
      userEvent.click(portalTrigger)
      await animationRender()
      await act(async () => {
        fireEvent.click(getByLabelText('Click to go forward one month'))
        await animationRender()
      })
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(value).toEqual('2018-04-23')
    })

    /**
     * js-dom doesn't properly apply user interactions like tabs changing focus
     * or Space / Enter clicking buttons so we fake those a little here.
     */
    describe('keyboard usage', () => {
      test('can navigate and select dates using the keyboard', async () => {
        let value: any
        const handleChange = jest.fn((e) => {
          value = e.target.value
        })
        const { getByLabelText } = renderWithTheme(
          <DateInput
            name="date_input"
            id="date-input"
            format="YYYY-MM-dd"
            value="2018-03-22"
            onChange={handleChange}
          />
        )

        const portalTrigger = getByLabelText('Open date picker')
        act(() => {
          fireEvent.keyDown(portalTrigger, { key: ' ', keyCode: KeyCodes.SPACE })
          fireEvent.click(portalTrigger)
        })
        await animationRender()
        // @ts-ignore
        expect(document.activeElement.dataset.date).toEqual('2018-03-22')
        await act(async () => {
          // @ts-ignore
          fireEvent.keyDown(document.activeElement, {
            key: 'ArrowRight',
            target: document.activeElement,
          })
          await animationRender()
          // @ts-ignore
          fireEvent.click(document.activeElement, {
            target: document.activeElement,
          })
        })
        expect(handleChange).toHaveBeenCalledTimes(1)
        expect(value).toEqual('2018-03-23')
      })

      test('can change months using keyboard', async () => {
        const { getByLabelText, getByRole } = renderWithTheme(
          <DateInput
            name="date_input"
            id="date-input"
            format="YYYY-MM-dd"
            defaultValue="2018-03-22"
          />
        )

        const portalTrigger = getByLabelText('Open date picker')
        userEvent.type(portalTrigger, '{space}')
        await animationRender()
        // @ts-ignore
        expect(document.activeElement.dataset.date).toEqual('2018-03-22')
        const button = getByRole('button', { name: 'March' })
        userEvent.click(button)
        const listbox = getByLabelText('Click to change month')
        userEvent.keyboard('{arrowup}')
        userEvent.keyboard('{space}')
        expect(button).toHaveTextContent('February')
        expect(listbox).not.toBeVisible()
      })

      test('can change years using keyboard', async () => {
        const { getByLabelText, getByRole } = renderWithTheme(
          <DateInput
            name="date_input"
            id="date-input"
            format="YYYY-MM-dd"
            defaultValue="2018-03-22"
          />
        )

        const portalTrigger = getByLabelText('Open date picker')
        userEvent.type(portalTrigger, '{space}')
        await animationRender()
        // @ts-ignore
        expect(document.activeElement.dataset.date).toEqual('2018-03-22')
        const button = getByRole('button', { name: '2018' })
        userEvent.click(button)
        const listbox = getByLabelText('Click to change year')
        userEvent.keyboard('{arrowup}')
        userEvent.keyboard('{space}')
        expect(button).toHaveTextContent('2017')
        expect(listbox).not.toBeVisible()
      })
    })
  })

  describe('type=datetime', () => {
    test('renders all date and time inputs', () => {
      const value = new PartialDate('2018-09-30 11:34 AM', 'YYYY-MM-dd hh:mm aa')
      const { getByLabelText } = renderWithTheme(
        <DateInput name="date-input" id="date-input" type="datetime" value={value.toDate()} />
      )
      expect(getByLabelText('year')).toHaveProperty('value', '2018')
      expect(getByLabelText('month')).toHaveProperty('value', '09')
      expect(getByLabelText('day of month')).toHaveProperty('value', '30')
      expect(getByLabelText('hours')).toHaveProperty('value', '11')
      expect(getByLabelText('minutes')).toHaveProperty('value', '34')
      expect(getByLabelText('time period')).toHaveProperty('value', 'AM')
    })

    test('renders date picker button', () => {
      const { getByLabelText } = renderWithTheme(<DateInput name="date-input" id="date-input" />)

      expect(getByLabelText('Open date picker')).toBeInTheDocument()
    })

    test('input type persists when value is Date and set externally', () => {
      const value = new PartialDate('2018-09-30 11:34 AM', 'YYYY-MM-dd hh:mm aa')
      const { getByLabelText, rerender } = renderWithTheme(
        <DateInput name="date-input" id="date-input" type="datetime" value={value.toDate()} />
      )
      expect(getByLabelText('year')).toHaveProperty('value', '2018')
      expect(getByLabelText('month')).toHaveProperty('value', '09')
      expect(getByLabelText('day of month')).toHaveProperty('value', '30')
      expect(getByLabelText('hours')).toHaveProperty('value', '11')
      expect(getByLabelText('minutes')).toHaveProperty('value', '34')
      expect(getByLabelText('time period')).toHaveProperty('value', 'AM')

      value.setDate(20)
      rerender(
        <DateInput name="date-input" id="date-input" type="datetime" value={value.toDate()} />
      )
      expect(getByLabelText('year')).toHaveProperty('value', '2018')
      expect(getByLabelText('month')).toHaveProperty('value', '09')
      expect(getByLabelText('day of month')).toHaveProperty('value', '20')
      expect(getByLabelText('hours')).toHaveProperty('value', '11')
      expect(getByLabelText('minutes')).toHaveProperty('value', '34')
      expect(getByLabelText('time period')).toHaveProperty('value', 'AM')
    })

    test('can open portal with time input', () => {
      const { getByLabelText, getAllByLabelText, getByRole } = renderWithTheme(
        <DateInput name="date-input" id="date-input" type="datetime" />
      )

      const portalTrigger = getByLabelText('Open date picker')
      act(() => {
        // mouse down and touch start used to ensure raised before blur events
        fireEvent.mouseDown(portalTrigger)
        fireEvent.click(portalTrigger)
      })
      const hoursInputs = getAllByLabelText('hours')
      const dialog = getByRole('dialog')
      expect(hoursInputs).toHaveLength(2)
      expect(dialog).not.toContainElement(hoursInputs[0])
      expect(dialog).toContainElement(hoursInputs[1])
    })

    test('can type into time input in portal', () => {
      const value = PartialDate.from('2018-03-01 20:18', 'YYYY-MM-dd HH:mm')
      const handleChange = jest.fn((e) => {
        value.parse(e.target.value, 'YYYY-MM-dd HH:mm')
      })
      const { getByLabelText, getAllByLabelText, rerender } = renderWithTheme(
        <DateInput
          name="date_input"
          id="date-input"
          type="datetime"
          value={value.format()}
          onChange={handleChange}
          format="YYYY-MM-dd HH:mm"
        />
      )

      const renderNewValue = () => {
        rerender(
          <DateInput
            name="date_input"
            id="date-input"
            type="datetime"
            value={value.format()}
            onChange={handleChange}
            format="YYYY-MM-dd HH:mm"
          />
        )
      }

      const portalTrigger = getByLabelText('Open date picker')
      act(() => {
        // mouse down and touch start used to ensure raised before blur events
        fireEvent.mouseDown(portalTrigger)
        fireEvent.click(portalTrigger)
      })

      act(() => {
        userEvent.type(getAllByLabelText('hours')[1], '1')
        renderNewValue()
        userEvent.type(getAllByLabelText('minutes')[1], '3')
        renderNewValue()
        userEvent.type(getAllByLabelText('minutes')[1], '3')
        renderNewValue()
        userEvent.type(getAllByLabelText('time period')[1], 'p')
        renderNewValue()
      })

      expect(handleChange).toHaveBeenCalledTimes(4)
      expect(value.format()).toEqual('2018-03-01 13:33')
    })
  })

  describe('type=time', () => {
    test('renders expected time inputs', () => {
      const value = '15:22'
      const { getByLabelText } = renderWithTheme(
        <DateInput name="date-input" id="date-input" type="time" value={value} format="HH:mm" />
      )
      expect((): HTMLElement => getByLabelText('year')).toThrow()
      expect((): HTMLElement => getByLabelText('month')).toThrow()
      expect((): HTMLElement => getByLabelText('day of month')).toThrow()
      expect(getByLabelText('hours')).toHaveProperty('value', '03')
      expect(getByLabelText('minutes')).toHaveProperty('value', '22')
      expect(getByLabelText('time period')).toHaveProperty('value', 'PM')
    })

    test('does not render picker button', () => {
      const value = '15:22'
      const { getByLabelText } = renderWithTheme(
        <DateInput name="date-input" id="date-input" type="time" value={value} format="HH:mm" />
      )
      expect((): HTMLElement => getByLabelText('Open date picker')).toThrow()
    })
  })

  describe('with theme customization', () => {
    test('should have 2px border', () => {
      const { asFragment } = renderWithTheme(
        <DateInput name="thin" id="not-thicc" value="2020-01-01" data-testid="dateInput" />,
        { border: 'thick' }
      )
      const dateInput = asFragment().firstElementChild?.firstElementChild?.firstElementChild
      const styles = window.getComputedStyle(dateInput as Element)
      expect(styles.borderWidth).toBe('2px')
    })

    test('should match intermediate shape styles', () => {
      const { asFragment } = renderWithTheme(
        <DateInput name="intermediate" id="not-round" value="2020-01-01" />,
        { shape: 'intermediate' }
      )
      const dateInput = asFragment().firstElementChild?.firstElementChild?.firstElementChild
      const styles = window.getComputedStyle(dateInput as Element)

      expect(styles.borderRadius).toBe('8px')
    })

    test('should match square shape styles', () => {
      const { asFragment } = renderWithTheme(
        <DateInput name="square" id="not-round" value="2020-01-01" />,
        { shape: 'square' }
      )

      const dateInput = asFragment().firstElementChild?.firstElementChild?.firstElementChild
      const styles = window.getComputedStyle(dateInput as Element)

      expect(styles.borderRadius).toBe('0px')
    })

    test('should not have box shadows set', () => {
      const { asFragment } = renderWithTheme(
        <DateInput name="shadows" id="none-of-em" value="2020-01-01" />,
        { boxShadows: false }
      )

      const dateInput = asFragment().firstElementChild?.firstElementChild?.firstElementChild
      const styles = window.getComputedStyle(dateInput as Element)

      expect(styles.boxShadow).toBe('')
    })
  })
})
