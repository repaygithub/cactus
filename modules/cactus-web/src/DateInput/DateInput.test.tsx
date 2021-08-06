import { generateTheme } from '@repay/cactus-theme'
import { act, fireEvent, render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { PartialDate } from '../helpers/dates'
import KeyCodes from '../helpers/keyCodes'
import Modal from '../Modal/Modal'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import DateInput from './DateInput'

function animationRender(): Promise<void> {
  return new Promise((resolve): void => {
    setTimeout((): void => {
      window.requestAnimationFrame((): void => resolve())
    }, 0)
  })
}

describe('component: DateInput', (): void => {
  describe('can be controlled', (): void => {
    test('with value as a Date', (): void => {
      const value = new Date(2018, 8, 30)
      const { getByLabelText, rerender } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" value={new Date(+value)} />
        </StyleProvider>
      )
      expect(getByLabelText('year')).toHaveProperty('value', '2018')
      expect(getByLabelText('month')).toHaveProperty('value', '09')
      expect(getByLabelText('day of month')).toHaveProperty('value', '30')

      value.setDate(12)

      rerender(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" value={new Date(+value)} />
        </StyleProvider>
      )

      expect(getByLabelText('year')).toHaveProperty('value', '2018')
      expect(getByLabelText('month')).toHaveProperty('value', '09')
      expect(getByLabelText('day of month')).toHaveProperty('value', '12')
    })

    test('when initial value = null then a Date is raised', (): void => {
      let value: any = null
      const handleChange = jest.fn((e): void => {
        value = e.target.value
      })
      const { getByLabelText } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" value={value} onChange={handleChange} />
        </StyleProvider>
      )

      userEvent.type(getByLabelText('month'), '2')
      expect(isNaN(value)).toBe(true)
      expect(value instanceof Date).toBe(true)
      userEvent.type(getByLabelText('day of month'), '14')
      expect(isNaN(value)).toBe(true)
      userEvent.type(getByLabelText('year'), '2019')
      expect(value).toEqual(new Date(2019, 1, 14))

      expect(handleChange).toHaveBeenCalledTimes(7)
    })

    test('with value as a string', (): void => {
      const value = new PartialDate('2018-09-30', 'YYYY-MM-dd')
      const { getByLabelText, rerender } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" format="YYYY-MM-dd" value={value.format()} />
        </StyleProvider>
      )
      expect(getByLabelText('year')).toHaveProperty('value', '2018')
      expect(getByLabelText('month')).toHaveProperty('value', '09')
      expect(getByLabelText('day of month')).toHaveProperty('value', '30')

      value.setDate(12)

      act((): void => {
        rerender(
          <StyleProvider>
            <DateInput
              name="date-input"
              id="date-input"
              format="YYYY-MM-dd"
              value={value.format()}
            />
          </StyleProvider>
        )
      })

      expect(getByLabelText('year')).toHaveProperty('value', '2018')
      expect(getByLabelText('month')).toHaveProperty('value', '09')
      expect(getByLabelText('day of month')).toHaveProperty('value', '12')
    })

    test('when initial value = undefined then a string is raised', (): void => {
      let value = undefined
      const handleChange = jest.fn((e): void => {
        value = e.target.value
      })
      const { getByLabelText } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" value={value} onChange={handleChange} />
        </StyleProvider>
      )

      userEvent.type(getByLabelText('month'), '2')
      expect(value).toEqual('')
      userEvent.type(getByLabelText('day of month'), '14')
      expect(value).toEqual('')
      userEvent.type(getByLabelText('year'), '2019')
      expect(value).toEqual('2019-02-14')

      expect(handleChange).toHaveBeenCalledTimes(7)
    })
  })

  describe('using inputs', (): void => {
    test('the up arrow increases value', async (): Promise<void> => {
      let value = new Date(2018, 8, 30)
      const onChange = jest.fn((e): void => {
        value = e.target.value
      })
      const { getByLabelText } = render(
        <StyleProvider>
          <DateInput
            name="date-input"
            id="date-input"
            value={new Date(+value)}
            onChange={onChange}
          />
        </StyleProvider>
      )
      const MM = getByLabelText('month')
      // @ts-ignore
      fireEvent.keyDown(MM, { key: 'ArrowUp', target: MM })

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(value).toEqual(new Date(2018, 9, 30))
    })

    test('the down arrow decreases value', async (): Promise<void> => {
      let value = new Date(2018, 8, 30)
      const onChange = jest.fn((e): void => {
        value = e.target.value
      })
      const { getByLabelText } = render(
        <StyleProvider>
          <DateInput
            name="date-input"
            id="date-input"
            value={new Date(+value)}
            onChange={onChange}
          />
        </StyleProvider>
      )
      const dd = getByLabelText('day of month')
      // @ts-ignore
      fireEvent.keyDown(dd, { key: 'ArrowDown', target: dd })

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(value).toEqual(new Date(2018, 8, 29))
    })

    test('the down arrow will loop when value is 1', async (): Promise<void> => {
      let value = new Date(2018, 8, 1)
      const onChange = jest.fn((e): void => {
        value = e.target.value
      })
      const { getByLabelText } = render(
        <StyleProvider>
          <DateInput
            name="date-input"
            id="date-input"
            value={new Date(+value)}
            onChange={onChange}
          />
        </StyleProvider>
      )
      const dd = getByLabelText('day of month')
      // @ts-ignore
      fireEvent.keyDown(dd, { key: 'ArrowDown', target: dd })

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(value).toEqual(new Date(2018, 8, 30))
    })

    test('the up arrow will loop when value is last day of month', async (): Promise<void> => {
      let value = new Date(2018, 8, 30)
      const onChange = jest.fn((e): void => {
        value = e.target.value
      })
      const { getByLabelText } = render(
        <StyleProvider>
          <DateInput
            name="date-input"
            id="date-input"
            value={new Date(+value)}
            onChange={onChange}
          />
        </StyleProvider>
      )
      const dd = getByLabelText('day of month')
      // @ts-ignore
      fireEvent.keyDown(dd, { key: 'ArrowUp', target: dd })

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(value).toEqual(new Date(2018, 8, 1))
    })

    test('looping works with February and leap year', async (): Promise<void> => {
      let value = new Date(2020, 1, 28)
      const onChange = jest.fn((e): void => {
        value = e.target.value
      })
      const { getByLabelText, rerender } = render(
        <StyleProvider>
          <DateInput
            name="date-input"
            id="date-input"
            value={new Date(+value)}
            onChange={onChange}
          />
        </StyleProvider>
      )
      const dd = getByLabelText('day of month')
      // @ts-ignore
      fireEvent.keyDown(dd, { key: 'ArrowUp', target: dd })

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(value).toEqual(new Date(2020, 1, 29))

      rerender(
        <StyleProvider>
          <DateInput
            name="date-input"
            id="date-input"
            value={new Date(+value)}
            onChange={onChange}
          />
        </StyleProvider>
      )
      // @ts-ignore
      fireEvent.keyDown(dd, { key: 'ArrowUp', target: dd })
      expect(onChange).toHaveBeenCalledTimes(2)
      expect(value).toEqual(new Date(2020, 1, 1))
    })
  })

  describe('type=date (default)', (): void => {
    test('renders date picker button', (): void => {
      const { getByLabelText } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" />
        </StyleProvider>
      )

      expect(getByLabelText('Open date picker')).toBeInTheDocument()
    })

    test('can open portal', (): void => {
      const { getByLabelText, getByRole } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" />
        </StyleProvider>
      )

      const portalTrigger = getByLabelText('Open date picker')
      act((): void => {
        // mouse down and touch start used to ensure raised before blur events
        fireEvent.mouseDown(portalTrigger)
        fireEvent.click(portalTrigger)
      })
      expect(getByRole('dialog')).toBeInTheDocument()
    })

    test('can close calendar on blur, even inside a modal', () => {
      const { getByLabelText, getByText } = render(
        <StyleProvider>
          <Modal isOpen={true} onClose={() => undefined}>
            <div>Click here to blur the calendar</div>
            <DateInput name="date-input" id="date-input" />
          </Modal>
        </StyleProvider>
      )
      const portalTrigger = getByLabelText('Open date picker')
      userEvent.click(portalTrigger)
      expect(getByLabelText('Click to go forward one month')).toBeVisible()
      userEvent.click(getByText('Click here to blur the calendar'))
      expect(getByLabelText('Click to go forward one month')).not.toBeVisible()
    })

    test('focus set to current date when no value selected', async (): Promise<void> => {
      const { getByLabelText, getByText } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" />
        </StyleProvider>
      )

      const portalTrigger = getByLabelText('Open date picker')
      act((): void => {
        fireEvent.mouseDown(portalTrigger)
        fireEvent.click(portalTrigger)
      })
      await animationRender()
      const today = PartialDate.from(new Date(), { type: 'date', format: 'YYYY-MM-dd' })
      expect(document.activeElement).toBe(getByText(today.toLocaleSpoken('date')).parentElement)
    })

    test('can select date from date picker and use month year selection', async (): Promise<void> => {
      let value: any
      const handleChange = jest.fn((e) => {
        value = e.target.value
      })
      const { getByLabelText, getByText } = render(
        <StyleProvider>
          <DateInput
            name="date_input"
            id="date-input"
            format="YYYY-MM-dd"
            onChange={handleChange}
          />
        </StyleProvider>
      )

      const portalTrigger = getByLabelText('Open date picker')
      act((): void => {
        fireEvent.mouseDown(portalTrigger)
        fireEvent.click(portalTrigger)
      })
      await animationRender()
      const desiredDate = PartialDate.from('2018-03-23', { type: 'date', format: 'YYYY-MM-dd' })
      await act(async (): Promise<void> => {
        fireEvent.click(getByLabelText('Click to change month'))
        await animationRender()
        fireEvent.click(within(getByLabelText('Select a month')).getByText('March'))
        fireEvent.click(getByLabelText('Click to change year'))
        await animationRender()
        fireEvent.click(getByText('2018'))
        await animationRender()
        // @ts-ignore
        fireEvent.click(getByText(desiredDate.toLocaleSpoken('date')).parentElement)
      })
      expect(handleChange).toHaveBeenCalledTimes(3)
      expect(value).toEqual('2018-03-23')
    })

    test('can change month using left arrow', async (): Promise<void> => {
      let value: any
      const handleChange = jest.fn((e) => {
        value = e.target.value
      })
      const { getByLabelText } = render(
        <StyleProvider>
          <DateInput
            name="date_input"
            id="date-input"
            format="YYYY-MM-dd"
            value="2018-03-23"
            onChange={handleChange}
          />
        </StyleProvider>
      )

      const portalTrigger = getByLabelText('Open date picker')
      userEvent.click(portalTrigger)
      await animationRender()
      await act(async (): Promise<void> => {
        fireEvent.click(getByLabelText('Click to go back one month'))
        await animationRender()
      })
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(value).toEqual('2018-02-23')
    })

    test('can change month using right arrow', async (): Promise<void> => {
      let value: any
      const handleChange = jest.fn((e) => {
        value = e.target.value
      })
      const { getByLabelText } = render(
        <StyleProvider>
          <DateInput
            name="date_input"
            id="date-input"
            format="YYYY-MM-dd"
            value="2018-03-23"
            onChange={handleChange}
          />
        </StyleProvider>
      )

      const portalTrigger = getByLabelText('Open date picker')
      userEvent.click(portalTrigger)
      await animationRender()
      await act(async (): Promise<void> => {
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
    describe('keyboard usage', (): void => {
      test('can navigate and select dates using the keyboard', async (): Promise<void> => {
        let value: any
        const handleChange = jest.fn((e) => {
          value = e.target.value
        })
        const { getByLabelText } = render(
          <StyleProvider>
            <DateInput
              name="date_input"
              id="date-input"
              format="YYYY-MM-dd"
              value="2018-03-22"
              onChange={handleChange}
            />
          </StyleProvider>
        )

        const portalTrigger = getByLabelText('Open date picker')
        act((): void => {
          fireEvent.keyDown(portalTrigger, { key: ' ', keyCode: KeyCodes.SPACE })
          fireEvent.click(portalTrigger)
        })
        await animationRender()
        // @ts-ignore
        expect(document.activeElement.dataset.date).toEqual('2018-03-22')
        await act(async (): Promise<void> => {
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

      test('can change months using keyboard', async (): Promise<void> => {
        const pd = PartialDate.from('2018-03-22', 'YYYY-MM-dd')
        const handleChange = jest.fn((e): void => {
          pd.parse(e.target.value, 'YYYY-MM-dd')
        })
        const { getByLabelText, rerender } = render(
          <StyleProvider>
            <DateInput
              name="date_input"
              id="date-input"
              format="YYYY-MM-dd"
              value={pd.format()}
              onChange={handleChange}
            />
          </StyleProvider>
        )

        const portalTrigger = getByLabelText('Open date picker')
        act((): void => {
          fireEvent.keyDown(portalTrigger, { key: ' ', keyCode: KeyCodes.SPACE })
          fireEvent.click(portalTrigger)
        })
        await animationRender()
        // @ts-ignore
        expect(document.activeElement.dataset.date).toEqual('2018-03-22')
        await act(async (): Promise<void> => {
          fireEvent.click(getByLabelText('Click to change month'))
          await animationRender()
          const monthList = getByLabelText('Select a month')
          // @ts-ignore
          fireEvent.keyDown(monthList, {
            key: 'ArrowUp',
            target: monthList,
          })
          await animationRender()
          rerender(
            <StyleProvider>
              <DateInput
                name="date_input"
                id="date-input"
                format="YYYY-MM-dd"
                value={pd.format()}
                onChange={handleChange}
              />
            </StyleProvider>
          )
          const selected = document.getElementById(
            // @ts-ignore
            monthList.getAttribute('aria-activedescendant')
          )
          // @ts-ignore
          fireEvent.click(selected, {
            target: selected,
          })
          await animationRender()
        })
        expect(getByLabelText('Click to change month')).toHaveTextContent('February')
      })

      test('can change years using keyboard', async (): Promise<void> => {
        const pd = PartialDate.from('2018-03-22', 'YYYY-MM-dd')
        const handleChange = jest.fn((e): void => {
          pd.parse(e.target.value, 'YYYY-MM-dd')
        })
        const { getByLabelText, rerender } = render(
          <StyleProvider>
            <DateInput
              name="date_input"
              id="date-input"
              format="YYYY-MM-dd"
              value={pd.format()}
              onChange={handleChange}
            />
          </StyleProvider>
        )

        const portalTrigger = getByLabelText('Open date picker')
        act((): void => {
          fireEvent.keyDown(portalTrigger, { key: ' ', keyCode: KeyCodes.SPACE })
          fireEvent.click(portalTrigger)
        })
        await animationRender()
        // @ts-ignore
        expect(document.activeElement.dataset.date).toEqual('2018-03-22')
        await act(async (): Promise<void> => {
          fireEvent.click(getByLabelText('Click to change year'))
          await animationRender()
          const yearList = getByLabelText('Select a year')
          // @ts-ignore
          fireEvent.keyDown(yearList, {
            key: 'ArrowUp',
            target: yearList,
          })
          await animationRender()
          rerender(
            <StyleProvider>
              <DateInput
                name="date_input"
                id="date-input"
                format="YYYY-MM-dd"
                value={pd.format()}
                onChange={handleChange}
              />
            </StyleProvider>
          )
          // @ts-ignore
          const selected = document.getElementById(yearList.getAttribute('aria-activedescendant'))
          // @ts-ignore
          fireEvent.click(selected, {
            target: selected,
          })
          await animationRender()
        })
        expect(getByLabelText('Click to change year')).toHaveTextContent('2017')
      })
    })
  })

  describe('type=datetime', (): void => {
    test('renders all date and time inputs', (): void => {
      const value = new PartialDate('2018-09-30 11:34 AM', 'YYYY-MM-dd hh:mm aa')
      const { getByLabelText } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" type="datetime" value={value.toDate()} />
        </StyleProvider>
      )
      expect(getByLabelText('year')).toHaveProperty('value', '2018')
      expect(getByLabelText('month')).toHaveProperty('value', '09')
      expect(getByLabelText('day of month')).toHaveProperty('value', '30')
      expect(getByLabelText('hours')).toHaveProperty('value', '11')
      expect(getByLabelText('minutes')).toHaveProperty('value', '34')
      expect(getByLabelText('time period')).toHaveProperty('value', 'AM')
    })

    test('renders date picker button', (): void => {
      const { getByLabelText } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" />
        </StyleProvider>
      )

      expect(getByLabelText('Open date picker')).toBeInTheDocument()
    })

    test('input type persists when value is Date and set externally', (): void => {
      const value = new PartialDate('2018-09-30 11:34 AM', 'YYYY-MM-dd hh:mm aa')
      const { getByLabelText, rerender } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" type="datetime" value={value.toDate()} />
        </StyleProvider>
      )
      expect(getByLabelText('year')).toHaveProperty('value', '2018')
      expect(getByLabelText('month')).toHaveProperty('value', '09')
      expect(getByLabelText('day of month')).toHaveProperty('value', '30')
      expect(getByLabelText('hours')).toHaveProperty('value', '11')
      expect(getByLabelText('minutes')).toHaveProperty('value', '34')
      expect(getByLabelText('time period')).toHaveProperty('value', 'AM')

      value.setDate(20)
      rerender(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" type="datetime" value={value.toDate()} />
        </StyleProvider>
      )
      expect(getByLabelText('year')).toHaveProperty('value', '2018')
      expect(getByLabelText('month')).toHaveProperty('value', '09')
      expect(getByLabelText('day of month')).toHaveProperty('value', '20')
      expect(getByLabelText('hours')).toHaveProperty('value', '11')
      expect(getByLabelText('minutes')).toHaveProperty('value', '34')
      expect(getByLabelText('time period')).toHaveProperty('value', 'AM')
    })

    test('can open portal with time input', (): void => {
      const { getByLabelText, getAllByLabelText, getByRole } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" type="datetime" />
        </StyleProvider>
      )

      const portalTrigger = getByLabelText('Open date picker')
      act((): void => {
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

    test('can type into time input in portal', (): void => {
      const value = PartialDate.from('2018-03-01 20:18', 'YYYY-MM-dd HH:mm')
      const handleChange = jest.fn((e): void => {
        value.parse(e.target.value, 'YYYY-MM-dd HH:mm')
      })
      const { getByLabelText, getAllByLabelText, rerender } = render(
        <StyleProvider>
          <DateInput
            name="date_input"
            id="date-input"
            type="datetime"
            value={value.format()}
            onChange={handleChange}
            format="YYYY-MM-dd HH:mm"
          />
        </StyleProvider>
      )

      const renderNewValue = (): void => {
        rerender(
          <StyleProvider>
            <DateInput
              name="date_input"
              id="date-input"
              type="datetime"
              value={value.format()}
              onChange={handleChange}
              format="YYYY-MM-dd HH:mm"
            />
          </StyleProvider>
        )
      }

      const portalTrigger = getByLabelText('Open date picker')
      act((): void => {
        // mouse down and touch start used to ensure raised before blur events
        fireEvent.mouseDown(portalTrigger)
        fireEvent.click(portalTrigger)
      })

      act((): void => {
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

  describe('type=time', (): void => {
    test('renders expected time inputs', (): void => {
      const value = '15:22'
      const { getByLabelText } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" type="time" value={value} format="HH:mm" />
        </StyleProvider>
      )
      expect((): HTMLElement => getByLabelText('year')).toThrow()
      expect((): HTMLElement => getByLabelText('month')).toThrow()
      expect((): HTMLElement => getByLabelText('day of month')).toThrow()
      expect(getByLabelText('hours')).toHaveProperty('value', '03')
      expect(getByLabelText('minutes')).toHaveProperty('value', '22')
      expect(getByLabelText('time period')).toHaveProperty('value', 'PM')
    })

    test('does not render picker button', (): void => {
      const value = '15:22'
      const { getByLabelText } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" type="time" value={value} format="HH:mm" />
        </StyleProvider>
      )
      expect((): HTMLElement => getByLabelText('Open date picker')).toThrow()
    })
  })

  describe('with theme customization', (): void => {
    test('should have 2px border', (): void => {
      const theme = generateTheme({ primaryHue: 200, border: 'thick' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <DateInput name="thin" id="not-thicc" value="2020-01-01" data-testid="dateInput" />
        </StyleProvider>
      )
      const dateInput = asFragment().firstElementChild?.firstElementChild?.firstElementChild
      const styles = window.getComputedStyle(dateInput as Element)
      expect(styles.borderWidth).toBe('2px')
    })

    test('should match intermediate shape styles', (): void => {
      const theme = generateTheme({ primaryHue: 200, shape: 'intermediate' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <DateInput name="intermediate" id="not-round" value="2020-01-01" />
        </StyleProvider>
      )
      const dateInput = asFragment().firstElementChild?.firstElementChild?.firstElementChild
      const styles = window.getComputedStyle(dateInput as Element)

      expect(styles.borderRadius).toBe('8px')
    })

    test('should match square shape styles', (): void => {
      const theme = generateTheme({ primaryHue: 200, shape: 'square' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <DateInput name="square" id="not-round" value="2020-01-01" />
        </StyleProvider>
      )

      const dateInput = asFragment().firstElementChild?.firstElementChild?.firstElementChild
      const styles = window.getComputedStyle(dateInput as Element)

      expect(styles.borderRadius).toBe('1px')
    })

    test('should not have box shadows set', (): void => {
      const theme = generateTheme({ primaryHue: 200, boxShadows: false })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <DateInput name="shadows" id="none-of-em" value="2020-01-01" />
        </StyleProvider>
      )

      const dateInput = asFragment().firstElementChild?.firstElementChild?.firstElementChild
      const styles = window.getComputedStyle(dateInput as Element)

      expect(styles.boxShadow).toBe('')
    })
  })
})
