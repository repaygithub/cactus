import { queryByLabelText } from '@testing-library/testcafe'
import * as path from 'path'
import { Selector } from 'testcafe'

import makeActions, { clickWorkaround } from './helpers/actions'
import startStaticServer from './helpers/static-server'

// eslint-disable-next-line no-undef
fixture('DateInput Integration Tests')
  .before(
    async (ctx): Promise<void> => {
      ctx.server = startStaticServer({
        directory: path.join(process.cwd(), 'dist'),
        port: 33567,
        singlePageApp: true,
      })
    }
  )
  .after(
    async (ctx): Promise<void> => {
      await ctx.server.close()
    }
  )
  .page('http://localhost:33567/date-test')

const scopedSelector = (container: string, selector: string) =>
  Selector(
    () => {
      const c = document.querySelector(container)
      return (c?.querySelector?.(selector) as Node) || null
    },
    { dependencies: { container, selector } }
  )

const selectType = async (t: TestController, itype: string) => {
  await t.click('#input-type')
  await t.click(`#input-type-${itype}`)
}

const dateInput = '[aria-labelledby="date-test-label"]'
const dateDialog = '[role="dialog"][aria-labelledby]'

const textField = Selector('#unified-value')
const monthInput = queryByLabelText('month')
const dayInput = queryByLabelText('day of month')
const yearInput = queryByLabelText('year')
const hourInput = scopedSelector(dateInput, '[aria-label="hours"]')
const minuteInput = scopedSelector(dateInput, '[aria-label="minutes"]')
const ampmInput = scopedSelector(dateInput, '[aria-label="time period"]')
const upButton = scopedSelector(dateInput, 'svg[data-name="ArrowUp"]')
const downButton = scopedSelector(dateInput, 'svg[data-name="ArrowDown"]')

test('enter date by typing', async (t): Promise<void> => {
  await t.click(monthInput)

  await t.expect(monthInput.focused).ok('month not focused').expect(monthInput.value).eql('10')

  await t.typeText(monthInput, '9').pressKey('tab')
  await t.expect(monthInput.value).eql('09')
  await t.expect(dayInput.focused).ok('day not focused').expect(dayInput.value).eql('16')

  await t.typeText(dayInput, '23')
  await t.expect(dayInput.value).eql('23')
  await t.expect(yearInput.focused).ok('year not focused').expect(yearInput.value).eql('2019')

  await t.typeText(yearInput, '1999')
  await t
    .expect(yearInput.focused)
    .ok('year not focused')
    .expect(yearInput.value)
    .eql('1999')
    .expect(textField.value)
    .eql('1999-09-23')
})

test('enter datetime by typing', async (t): Promise<void> => {
  await selectType(t, 'datetime')
  await t.click(monthInput)

  await t.expect(monthInput.focused).ok('month not focused').expect(monthInput.value).eql('10')

  await t.typeText(monthInput, '9').pressKey('tab')
  await t.expect(monthInput.value).eql('09')
  await t.expect(dayInput.focused).ok('day not focused').expect(dayInput.value).eql('16')

  await t.typeText(dayInput, '23')
  await t.expect(dayInput.value).eql('23')
  await t.expect(yearInput.focused).ok('year not focused').expect(yearInput.value).eql('2019')

  await t.typeText(yearInput, '1999')
  await t.expect(yearInput.value).eql('1999')
  await t.expect(hourInput.focused).ok('hour not focused')
  // For hours, IE includes the leading 0.
  //.expect(hourInput.value).eql('1')

  await t.typeText(hourInput, '3').pressKey('tab')
  //await t.expect(hourInput.value).eql('3')
  await t.expect(minuteInput.focused).ok('minute not focused').expect(minuteInput.value).eql('02')

  await t.typeText(minuteInput, '42')
  await t.expect(minuteInput.value).eql('42')
  await t.expect(ampmInput.focused).ok('ampm not focused').expect(ampmInput.value).eql('AM')

  await t.typeText(ampmInput, 'p')
  await t
    .expect(ampmInput.focused)
    .ok('ampm not focused')
    .expect(ampmInput.value)
    .eql('PM')
    .expect(textField.value)
    .eql('1999-09-23T15:42')
})

test('enter time by typing', async (t): Promise<void> => {
  await selectType(t, 'time')
  await t.click(hourInput)

  await t.expect(hourInput.focused).ok('hour not focused').expect(hourInput.value).eql('11')

  await t.typeText(hourInput, '3').pressKey('tab')
  //await t.expect(hourInput.value).eql('3')
  await t.expect(minuteInput.focused).ok('minute not focused').expect(minuteInput.value).eql('57')

  await t.typeText(minuteInput, '42')
  await t.expect(minuteInput.value).eql('42')
  await t.expect(ampmInput.focused).ok('ampm not focused').expect(ampmInput.value).eql('PM')

  await t.typeText(ampmInput, 'a')
  await t
    .expect(ampmInput.focused)
    .ok('ampm not focused')
    .expect(ampmInput.value)
    .eql('AM')
    .expect(textField.value)
    .eql('03:42')
})

test('select date with popup', async (t): Promise<void> => {
  await clickWorkaround(queryByLabelText('Open date picker'))

  await clickWorkaround(queryByLabelText('Click to change month'))
  await t.click('#date-test-February')
  await clickWorkaround(queryByLabelText('Click to change year'))
  await t.click('#date-test-2005')
  await clickWorkaround(Selector('[data-date="2005-02-28"]'))
  await t
    .expect(textField.value)
    .eql('2005-02-28')
    .expect(Selector(dateDialog).filterHidden().exists)
    .ok('Dialog is hidden')
})

test('select datetime with popup', async (t): Promise<void> => {
  await selectType(t, 'datetime')
  await clickWorkaround(queryByLabelText('Open date picker'))

  await clickWorkaround(queryByLabelText('Click to go back one month'))
  await clickWorkaround(Selector('[data-date="2019-09-29"]'))
  await t
    .typeText(scopedSelector(dateDialog, '[aria-label="hours"]'), '11')
    .pressKey('up')
    .click(scopedSelector(dateDialog, 'svg[data-name="ArrowUp"]'))
    .pressKey('tab')
    .pressKey('down')
  await t
    .expect(textField.value)
    .eql('2019-09-29T23:04')
    .expect(Selector(dateDialog).filterVisible().exists)
    .ok('Dialog is visible')
})

test('scroll months back', async (t): Promise<void> => {
  await t.typeText(monthInput, '1').typeText(dayInput, '31')
  await clickWorkaround(queryByLabelText('Open date picker'))

  const backButton = queryByLabelText('Click to go back one month')
  await clickWorkaround(backButton)
  await t.expect(textField.value).eql('2018-12-31')
  await clickWorkaround(backButton)
  await t.expect(textField.value).eql('2018-11-30')
})

test('scroll months forward', async (t): Promise<void> => {
  await t.typeText(monthInput, '12').typeText(dayInput, '31')
  await clickWorkaround(queryByLabelText('Open date picker'))

  const forwardButton = queryByLabelText('Click to go forward one month')
  await clickWorkaround(forwardButton)
  await t.expect(textField.value).eql('2020-01-31')
  await clickWorkaround(forwardButton)
  await t.expect(textField.value).eql('2020-02-29')
})

test('enter datetime with arrow keys/buttons', async (t): Promise<void> => {
  await selectType(t, 'datetime')
  await t.typeText(textField, '2020-02-29T23:58', { replace: true })
  await t.click(monthInput)

  await t
    .expect(monthInput.focused)
    .ok('month not focused')
    .click(upButton)
    .click(downButton)
    .pressKey('down')
    .pressKey('down')
    .pressKey('tab')
  await t
    .expect(dayInput.focused)
    .ok('day not focused')
    .click(upButton)
    .pressKey('up')
    .click(downButton)
    .click(upButton)
    .pressKey('up')
    .pressKey('tab')
  await t
    .expect(yearInput.focused)
    .ok('year not focused')
    .click(upButton)
    .pressKey('up')
    .click(downButton)
    .pressKey('tab')
  await t
    .expect(hourInput.focused)
    .ok('hour not focused')
    .click(upButton)
    .pressKey('up')
    .click(downButton)
    .pressKey('tab')
  await t.expect(textField.value).eql('2021-12-01T00:58')
  await t
    .expect(minuteInput.focused)
    .ok('minute not focused')
    .click(upButton)
    .pressKey('up')
    .click(downButton)
    .pressKey('up')
    .pressKey('tab')
  await t
    .expect(ampmInput.focused)
    .ok('ampm not focused')
    .click(upButton)
    .pressKey('up')
    .click(downButton)
    .pressKey('tab')
  await t.expect(textField.value).eql('2021-12-01T12:00')
})

test('locks focus to date picker', async (t: TestController): Promise<void> => {
  const { getActiveElement } = makeActions(t)
  const datePickerTrigger = queryByLabelText('Open date picker')
  await clickWorkaround(datePickerTrigger)

  const dateButtonActiveEl = await getActiveElement()
  await t
    .expect(dateButtonActiveEl.attributes?.role)
    .eql('gridcell')
    .expect(dateButtonActiveEl.attributes?.['data-date'])
    .eql('2019-10-16')
    .expect(dateButtonActiveEl.focused)
    .ok('Date button not focused')

  // tab and expect focus to circle back to Month select
  await t.pressKey('tab')
  const monthSelectActiveEl = await getActiveElement()
  await t
    .expect(monthSelectActiveEl.tagName)
    .eql('button')
    .expect(monthSelectActiveEl.attributes?.['aria-label'])
    .eql('Click to go back one month')
    .expect(monthSelectActiveEl.attributes?.['aria-roledescription'])
    .eql('moves date back one month')
    .expect(monthSelectActiveEl.focused)
    .ok('Date button not focused')
})

test('move and select date with keyboard', async (t: TestController): Promise<void> => {
  const { getActiveElement } = makeActions(t)
  const datePickerTrigger = queryByLabelText('Open date picker')
  await clickWorkaround(datePickerTrigger)

  // move right
  await t.pressKey('right')
  const dateButtonActiveEl = await getActiveElement()
  await t
    .expect(dateButtonActiveEl.attributes?.role)
    .eql('gridcell')
    .expect(dateButtonActiveEl.attributes?.['data-date'])
    .eql('2019-10-17')
    .expect(dateButtonActiveEl.focused)
    .ok('Date button not focused')

  // move up
  await t.pressKey('up')
  const dateButtonActiveEl2 = await getActiveElement()
  await t
    .expect(dateButtonActiveEl2.attributes?.role)
    .eql('gridcell')
    .expect(dateButtonActiveEl2.attributes?.['data-date'])
    .eql('2019-10-10')
    .expect(dateButtonActiveEl2.focused)
    .ok('Date button not focused')

  // select currently focused date
  await t.pressKey('enter')
  await t
    .expect(queryByLabelText('year').value)
    .eql('2019')
    .expect(queryByLabelText('month').value)
    .eql('10')
    .expect(queryByLabelText('day of month').value)
    .eql('10')
})
