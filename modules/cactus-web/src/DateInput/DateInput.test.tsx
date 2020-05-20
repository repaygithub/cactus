import * as React from 'react'

import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { generateTheme } from '@repay/cactus-theme'
import { PartialDate } from '../helpers/dates'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import DateInput from './DateInput'
import KeyCodes from '../helpers/keyCodes'
import userEvent from '@testing-library/user-event'

afterEach(cleanup)

function animationRender() {
  return new Promise(resolve => {
    setTimeout(() => {
      window.requestAnimationFrame(resolve)
    }, 0)
  })
}

describe('component: DateInput', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <DateInput name="date-input" id="date-input" />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  describe('can be controlled', () => {
    test('with value as a Date', () => {
      let value = new Date(2018, 8, 30)
      let { getByLabelText, rerender } = render(
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

    test('when initial value = null then a Date is raised', () => {
      let value = null
      const handleChange = jest.fn((_, v) => {
        value = v
      })
      let { getByLabelText } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" value={value} onChange={handleChange} />
        </StyleProvider>
      )

      userEvent.type(getByLabelText('month'), '2')
      userEvent.type(getByLabelText('day of month'), '14')
      userEvent.type(getByLabelText('year'), '2019')

      expect(handleChange).not.toHaveBeenCalledWith('date-input', expect.any(String))
      expect(handleChange).toHaveBeenLastCalledWith('date-input', expect.any(Date))
      expect(handleChange).toHaveBeenLastCalledWith('date-input', new Date(2019, 1, 14))
    })

    test('with value as a string', () => {
      let value = new PartialDate('2018-09-30', 'YYYY-MM-dd')
      let { getByLabelText, rerender } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" format="YYYY-MM-dd" value={value.format()} />
        </StyleProvider>
      )
      expect(getByLabelText('year')).toHaveProperty('value', '2018')
      expect(getByLabelText('month')).toHaveProperty('value', '09')
      expect(getByLabelText('day of month')).toHaveProperty('value', '30')

      value.setDate(12)

      act(() => {
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

    test('when initial value = undefined then a string is raised', () => {
      let value = undefined
      const handleChange = jest.fn((_, v) => {
        value = v
      })
      let { getByLabelText } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" value={value} onChange={handleChange} />
        </StyleProvider>
      )

      userEvent.type(getByLabelText('month'), '2')
      userEvent.type(getByLabelText('day of month'), '14')
      userEvent.type(getByLabelText('year'), '2019')

      expect(handleChange).not.toHaveBeenCalledWith('date-input', expect.any(Date))
      expect(handleChange).toHaveBeenLastCalledWith('date-input', expect.any(String))
      expect(handleChange).toHaveBeenLastCalledWith('date-input', '2019-02-14')
    })
  })

  describe('using inputs', () => {
    test('the up arrow increases value', async () => {
      let value = new Date(2018, 8, 30)
      let onChange = jest.fn((_, v) => {
        value = v
      })
      let { getByLabelText } = render(
        <StyleProvider>
          <DateInput
            name="date-input"
            id="date-input"
            value={new Date(+value)}
            onChange={onChange}
          />
        </StyleProvider>
      )
      let MM = getByLabelText('month')
      // @ts-ignore
      fireEvent.keyDown(MM, { key: 'ArrowUp', target: MM })

      expect(onChange).toHaveBeenCalledWith('date-input', new Date(2018, 9, 30))
    })

    test('the down arrow decreases value', async () => {
      let value = new Date(2018, 8, 30)
      let onChange = jest.fn((_, v) => {
        value = v
      })
      let { getByLabelText } = render(
        <StyleProvider>
          <DateInput
            name="date-input"
            id="date-input"
            value={new Date(+value)}
            onChange={onChange}
          />
        </StyleProvider>
      )
      let dd = getByLabelText('day of month')
      // @ts-ignore
      fireEvent.keyDown(dd, { key: 'ArrowDown', target: dd })

      expect(onChange).toHaveBeenCalledWith('date-input', new Date(2018, 8, 29))
    })

    test('the down arrow will loop when value is 1', async () => {
      let value = new Date(2018, 8, 1)
      let onChange = jest.fn((_, v) => {
        value = v
      })
      let { getByLabelText } = render(
        <StyleProvider>
          <DateInput
            name="date-input"
            id="date-input"
            value={new Date(+value)}
            onChange={onChange}
          />
        </StyleProvider>
      )
      let dd = getByLabelText('day of month')
      // @ts-ignore
      fireEvent.keyDown(dd, { key: 'ArrowDown', target: dd })

      expect(onChange).toHaveBeenCalledWith('date-input', new Date(2018, 8, 30))
    })

    test('the up arrow will loop when value is last day of month', async () => {
      let value = new Date(2018, 8, 30)
      let onChange = jest.fn((_, v) => {
        value = v
      })
      let { getByLabelText } = render(
        <StyleProvider>
          <DateInput
            name="date-input"
            id="date-input"
            value={new Date(+value)}
            onChange={onChange}
          />
        </StyleProvider>
      )
      let dd = getByLabelText('day of month')
      // @ts-ignore
      fireEvent.keyDown(dd, { key: 'ArrowUp', target: dd })

      expect(onChange).toHaveBeenCalledWith('date-input', new Date(2018, 8, 1))
    })

    test('looping works with February and leap year', async () => {
      let value = new Date(2020, 1, 28)
      let onChange = jest.fn((_, v) => {
        value = v
      })
      let { getByLabelText, rerender } = render(
        <StyleProvider>
          <DateInput
            name="date-input"
            id="date-input"
            value={new Date(+value)}
            onChange={onChange}
          />
        </StyleProvider>
      )
      let dd = getByLabelText('day of month')
      // @ts-ignore
      fireEvent.keyDown(dd, { key: 'ArrowUp', target: dd })

      expect(onChange).toHaveBeenCalledWith('date-input', new Date(2020, 1, 29))

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
      expect(onChange).toHaveBeenCalledWith('date-input', new Date(2020, 1, 1))
    })
  })

  describe('type=date (default)', () => {
    test('renders date picker button', () => {
      const { getByLabelText } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" />
        </StyleProvider>
      )

      expect(getByLabelText('Open date picker')).toBeInTheDocument()
    })

    test('can open portal', () => {
      const { getByLabelText, getByRole } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" />
        </StyleProvider>
      )

      let portalTrigger = getByLabelText('Open date picker')
      act(() => {
        // mouse down and touch start used to ensure raised before blur events
        fireEvent.mouseDown(portalTrigger)
        fireEvent.click(portalTrigger)
      })
      expect(getByRole('dialog')).toBeInTheDocument()
    })

    test('focus set to current date when no value selected', async () => {
      const { getByLabelText, getByText } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" />
        </StyleProvider>
      )

      let portalTrigger = getByLabelText('Open date picker')
      act(() => {
        fireEvent.mouseDown(portalTrigger)
        fireEvent.click(portalTrigger)
      })
      await animationRender()
      let today = PartialDate.from(new Date(), { type: 'date', format: 'YYYY-MM-dd' })
      expect(document.activeElement).toBe(getByText(today.toLocaleSpoken('date')).parentElement)
    })

    test('can select date from date picker and use month year selection', async () => {
      let handleChange = jest.fn()
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

      let portalTrigger = getByLabelText('Open date picker')
      act(() => {
        fireEvent.mouseDown(portalTrigger)
        fireEvent.click(portalTrigger)
      })
      await animationRender()
      let desiredDate = PartialDate.from('2018-03-23', { type: 'date', format: 'YYYY-MM-dd' })
      await act(async () => {
        fireEvent.click(getByLabelText('Click to change month and year'))
        await animationRender()
        fireEvent.click(getByText('March'))
        fireEvent.click(getByText('2018'))
        fireEvent.click(getByLabelText('Click to use calendar picker'))
        await animationRender()
        // @ts-ignore
        fireEvent.click(getByText(desiredDate.toLocaleSpoken('date')).parentElement)
      })
      expect(handleChange).toHaveBeenCalledWith('date_input', '2018-03-23')
    })

    /**
     * js-dom doesn't properly apply user interactions like tabs changing focus
     * or Space / Enter clicking buttons so we fake those a little here.
     */
    describe('keyboard usage', () => {
      test('can navigate and select dates using the keyboard', async () => {
        let handleChange = jest.fn()
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

        let portalTrigger = getByLabelText('Open date picker')
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
        expect(handleChange).toHaveBeenCalledWith('date_input', '2018-03-23')
      })

      test('can change months using keyboard', async () => {
        const pd = PartialDate.from('2018-03-22', 'YYYY-MM-dd')
        const handleChange = jest.fn((_, value) => {
          pd.parse(value, 'YYYY-MM-dd')
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

        let portalTrigger = getByLabelText('Open date picker')
        act(() => {
          fireEvent.keyDown(portalTrigger, { key: ' ', keyCode: KeyCodes.SPACE })
          fireEvent.click(portalTrigger)
        })
        await animationRender()
        // @ts-ignore
        expect(document.activeElement.dataset.date).toEqual('2018-03-22')
        await act(async () => {
          fireEvent.click(getByLabelText('Click to change month and year'))
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
          // @ts-ignore
          let selected = document.getElementById(monthList.getAttribute('aria-activedescendant'))
          // @ts-ignore
          fireEvent.click(selected, {
            target: selected,
          })
          await animationRender()
        })
        expect(getByLabelText('Click to use calendar picker')).toHaveTextContent('February 2018')
      })

      test('can change years using keyboard', async () => {
        const pd = PartialDate.from('2018-03-22', 'YYYY-MM-dd')
        const handleChange = jest.fn((_, value) => {
          pd.parse(value, 'YYYY-MM-dd')
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

        let portalTrigger = getByLabelText('Open date picker')
        act(() => {
          fireEvent.keyDown(portalTrigger, { key: ' ', keyCode: KeyCodes.SPACE })
          fireEvent.click(portalTrigger)
        })
        await animationRender()
        // @ts-ignore
        expect(document.activeElement.dataset.date).toEqual('2018-03-22')
        await act(async () => {
          fireEvent.click(getByLabelText('Click to change month and year'))
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
          let selected = document.getElementById(yearList.getAttribute('aria-activedescendant'))
          // @ts-ignore
          fireEvent.click(selected, {
            target: selected,
          })
          await animationRender()
        })
        expect(getByLabelText('Click to use calendar picker')).toHaveTextContent('March 2017')
      })
    })
  })

  describe('type=datetime', () => {
    test('renders all date and time inputs', () => {
      let value = new PartialDate('2018-09-30 11:34 AM', 'YYYY-MM-dd hh:mm aa')
      let { getByLabelText } = render(
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

    test('renders date picker button', () => {
      const { getByLabelText } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" />
        </StyleProvider>
      )

      expect(getByLabelText('Open date picker')).toBeInTheDocument()
    })

    test('input type persists when value is Date and set externally', () => {
      let value = new PartialDate('2018-09-30 11:34 AM', 'YYYY-MM-dd hh:mm aa')
      let { getByLabelText, rerender } = render(
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

    test('can open portal with time input', () => {
      const { getByLabelText, getAllByLabelText, getByRole } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" type="datetime" />
        </StyleProvider>
      )

      let portalTrigger = getByLabelText('Open date picker')
      act(() => {
        // mouse down and touch start used to ensure raised before blur events
        fireEvent.mouseDown(portalTrigger)
        fireEvent.click(portalTrigger)
      })
      let hoursInputs = getAllByLabelText('hours')
      let dialog = getByRole('dialog')
      expect(hoursInputs).toHaveLength(2)
      expect(dialog).not.toContainElement(hoursInputs[0])
      expect(dialog).toContainElement(hoursInputs[1])
    })

    test('can type into time input in portal', () => {
      let value = PartialDate.from('2018-03-01 20:18', 'YYYY-MM-dd HH:mm')
      const handleChange = jest.fn((_, update) => {
        value.parse(update, 'YYYY-MM-dd HH:mm')
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

      const renderNewValue = () => {
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

      let portalTrigger = getByLabelText('Open date picker')
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

      expect(handleChange).toHaveBeenLastCalledWith('date_input', '2018-03-01 13:33')
    })
  })

  describe('type=time', () => {
    test('renders expeced time inputs', () => {
      let value = '15:22'
      let { getByLabelText } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" type="time" value={value} format="HH:mm" />
        </StyleProvider>
      )
      expect(() => getByLabelText('year')).toThrow()
      expect(() => getByLabelText('month')).toThrow()
      expect(() => getByLabelText('day of month')).toThrow()
      expect(getByLabelText('hours')).toHaveProperty('value', '3')
      expect(getByLabelText('minutes')).toHaveProperty('value', '22')
      expect(getByLabelText('time period')).toHaveProperty('value', 'PM')
    })

    test('does not render picker button', () => {
      let value = '15:22'
      let { getByLabelText } = render(
        <StyleProvider>
          <DateInput name="date-input" id="date-input" type="time" value={value} format="HH:mm" />
        </StyleProvider>
      )
      expect(() => getByLabelText('Open date picker')).toThrow()
    })
  })

  describe('with theme customization', () => {
    test('should have 2px border', () => {
      const theme = generateTheme({ primaryHue: 200, border: 'thick' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <DateInput name="thin" id="not-thicc" />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test('should match intermediate shape styles', () => {
      const theme = generateTheme({ primaryHue: 200, shape: 'intermediate' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <DateInput name="intermediate" id="not-round" />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test('should match square shape styles', () => {
      const theme = generateTheme({ primaryHue: 200, shape: 'square' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <DateInput name="square" id="not-round" />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test('should not have box shadows set', () => {
      const theme = generateTheme({ primaryHue: 200, boxShadows: false })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <DateInput name="shadows" id="none-of-em" />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
