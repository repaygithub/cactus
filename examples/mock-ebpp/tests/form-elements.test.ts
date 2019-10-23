import * as path from 'path'
import { ApiData } from '../types'
import {
  clickByText,
  fillTextField,
  getInputValueByLabel,
  selectDropdownOption,
  uploadFile,
} from './helpers/form-actions'
import { getActiveElement, sleep } from './helpers/wait'
import { getDocument, queries } from 'pptr-testing-library'
import puppeteer, { ElementHandle } from 'puppeteer'
import startStaticServer, { ServerObj } from './helpers/static-server'

const { getByLabelText } = queries

// async function getActiveElement(page: puppeteer.Page) {
//   return (page.evaluateHandle(() => document.activeElement) as unknown) as ElementHandle<Element>
// }

async function getActiveAccessibility(page: puppeteer.Page) {
  await sleep(0.2)
  let activeElHandle = await getActiveElement(page)
  let activeEl = await activeElHandle.asElement()
  if (activeEl === null) {
    return
  }
  return page.accessibility.snapshot({ root: activeEl })
}

describe('UI Config Form', () => {
  let page: puppeteer.Page
  let server: ServerObj
  beforeAll(async () => {
    page = await global.__BROWSER__.newPage()
    server = startStaticServer({
      directory: path.join(process.cwd(), 'dist'),
      port: 33567,
      singlePageApp: true,
    })
    await page.goto('http://localhost:33567/ui-config')
  })

  beforeEach(async () => {
    await page.reload({ waitUntil: 'domcontentloaded' })
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be titled "UI Config"', async () => {
    await expect(page.title()).resolves.toMatch('UI Config')
  })

  it('should fill out and submit the entire form', async () => {
    const doc = await getDocument(page)
    await fillTextField(doc, 'Display Name', 'Test Merchant')
    await fillTextField(doc, 'Merchant Name', 'tst-mrchnt')
    await fillTextField(doc, 'Terms and Conditions', 'You must be this tall to test')
    await fillTextField(doc, 'Welcome Content', 'Welcome to the integration test app')
    await fillTextField(doc, 'Footer Content', 'Powered by coffee and sheer willpower')
    await selectDropdownOption(page, doc, 'Notification Email', 'dhuber@repay.com')
    await uploadFile(page, doc, 'Upload Logo')
    await clickByText(doc, 'Blue')
    await clickByText(doc, 'Allow Customer Login')
    await clickByText(doc, 'Use Cactus Styles')
    await clickByText(doc, 'Submit')

    const apiData: ApiData = await page.evaluate(() => (window as any).apiData)
    expect(apiData).toMatchObject({
      display_name: 'Test Merchant',
      merchant_name: 'tst-mrchnt',
      terms_and_conditions: 'You must be this tall to test',
      welcome_content: 'Welcome to the integration test app',
      footer_content: 'Powered by coffee and sheer willpower',
      notification_email: 'dhuber@repay.com',
      allow_customer_login: true,
      use_cactus_styles: true,
      select_color: 'blue',
      file_input: [{ fileName: 'test-logo.jpg', contents: 'data:', status: 'loaded' }],
    })
  })

  // TODO: Add tests for field errors, partially filled out forms, etc

  describe('<DateInputField />', () => {
    // initial value is 2019-10-16

    test('moves focus to date picker on click', async () => {
      const doc = await getDocument(page)
      let activeEl
      const datePickerTrigger = await getByLabelText(doc, 'Open date picker')
      await datePickerTrigger.click()
      await page.keyboard.press('Tab')
      activeEl = await getActiveElement(page)
      let monthSelect = (await activeEl.asElement()) || undefined
      let monthSelectAccess = await page.accessibility.snapshot({ root: monthSelect })

      expect(monthSelectAccess).toEqual({
        role: 'button',
        name: 'Click to change month and year',
        roledescription: 'toggles between calendar and month year selectors',
        focused: true,
      })
    })

    test('locks focus to date picker', async () => {
      const doc = await getDocument(page)

      const datePickerTrigger = await getByLabelText(doc, 'Open date picker')
      await datePickerTrigger.click()
      let dateButtonAccess = await getActiveAccessibility(page)
      expect(dateButtonAccess).toEqual({
        role: 'gridcell',
        name: 'Wednesday, October 16, 2019',
        focused: true,
        selected: true,
      })

      // tab and expect focus to circle back to Month select
      await page.keyboard.press('Tab')
      let monthSelectAccess = await getActiveAccessibility(page)
      expect(monthSelectAccess).toEqual({
        role: 'button',
        name: 'Click to change month and year',
        roledescription: 'toggles between calendar and month year selectors',
        focused: true,
      })

      // tab again should be back at dateButton
      await page.keyboard.press('Tab')
      let dateButtonAccess2 = await getActiveAccessibility(page)
      expect(dateButtonAccess2).toEqual(dateButtonAccess)
    })

    test('move and select date with keyboard', async () => {
      const doc = await getDocument(page)

      const datePickerTrigger = await getByLabelText(doc, 'Open date picker')
      await datePickerTrigger.click()
      let dateButtonAccess = await getActiveAccessibility(page)
      expect(dateButtonAccess).toEqual({
        role: 'gridcell',
        name: 'Wednesday, October 16, 2019',
        focused: true,
        selected: true,
      })

      // move right
      await page.keyboard.press('ArrowRight')
      dateButtonAccess = await getActiveAccessibility(page)
      expect(dateButtonAccess).toEqual({
        role: 'gridcell',
        name: 'Thursday, October 17, 2019',
        focused: true,
        selected: true,
      })

      // move up
      await page.keyboard.press('ArrowUp')
      dateButtonAccess = await getActiveAccessibility(page)
      expect(dateButtonAccess).toEqual({
        role: 'gridcell',
        name: 'Thursday, October 10, 2019',
        focused: true,
        selected: true,
      })

      // select currently focused date
      await page.keyboard.press('Enter')
      const year = await getInputValueByLabel(doc, 'year')
      const month = await getInputValueByLabel(doc, 'month')
      const day = await getInputValueByLabel(doc, 'day of month')
      expect(year).toEqual('2019')
      expect(month).toEqual('10')
      expect(day).toEqual('10')
    })
  })
})
