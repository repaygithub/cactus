import * as path from 'path'
import { ApiData } from '../types'
import { getActiveElement, sleep } from './helpers/wait'
import { getDocument, queries } from 'pptr-testing-library'
import devices from 'puppeteer/DeviceDescriptors'
import FormActions from './helpers/form-actions'
import puppeteer from 'puppeteer'
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
  let mobilePage: puppeteer.Page
  let server: ServerObj
  beforeAll(async () => {
    page = await global.__BROWSER__.newPage()
    mobilePage = await global.__BROWSER__.newPage()
    const iPhoneX = devices['iPhone X']
    mobilePage.emulate(iPhoneX)
    server = startStaticServer({
      directory: path.join(process.cwd(), 'dist'),
      port: 33567,
      singlePageApp: true,
    })
    await page.goto('http://localhost:33567/ui-config')
    await mobilePage.goto('http://localhost:33567/ui-config')
  })

  beforeEach(async () => {
    await page.reload({ waitUntil: 'domcontentloaded' })
  })

  afterAll(async () => {
    await server.close()
  })

  test('should be testled "UI Config"', async () => {
    await expect(page.title()).resolves.toMatch('UI Config')
  })

  test('should fill out and submit the entire form', async () => {
    const doc = await getDocument(page)
    const actions = new FormActions(doc, page)

    await actions.fillTextField('Display Name', 'Test Merchant')
    await actions.fillTextField('Merchant Name', 'tst-mrchnt')
    await actions.fillTextField('Terms and Conditions', 'You must be this tall to test')
    await actions.fillTextField('Welcome Content', 'Welcome to the integration test app')
    await actions.fillTextField('Footer Content', 'Powered by coffee and sheer willpower')
    await actions.selectDropdownOption('Notification Email', 'dhuber@repay.com')
    await actions.selectDropdownOption('All Locations', ['Tempe', 'Phoenix'])
    await actions.searchComboBox('Most Popular Location', 'Tempe')
    await actions.searchComboBox('Card Brands', ['MasterCard', 'FakeBrand'])
    await actions.uploadFile('Upload Logo')
    await actions.clickByText('Blue')
    await actions.clickByText('Allow Customer Login')
    await actions.clickByText('Use Cactus Styles')
    await actions.clickByText('Submit')

    const apiData: ApiData = await actions.page.evaluate(() => (window as any).apiData)
    expect(apiData).toMatchObject({
      display_name: 'Test Merchant',
      merchant_name: 'tst-mrchnt',
      terms_and_conditions: 'You must be this tall to test',
      welcome_content: 'Welcome to the integration test app',
      footer_content: 'Powered by coffee and sheer willpower',
      notification_email: 'dhuber@repay.com',
      all_locations: ['Tempe', 'Phoenix'],
      mp_location: 'Tempe',
      card_brands: ['MasterCard', 'FakeBrand'],
      allow_customer_login: true,
      use_cactus_styles: true,
      select_color: 'blue',
      file_input: [{ fileName: 'test-logo.jpg', contents: 'data:', status: 'loaded' }],
    })
  })

  describe('Mobile Views', () => {
    describe('<SelectField />', () => {
      test('should present the mobile view for multiple=false comboBox=false', async () => {
        const doc = await getDocument(mobilePage)
        const actions = new FormActions(doc, mobilePage)
        await actions.selectMobileDropdownOption('Notification Email', 'dhuber@repay.com')
        const select = await getByLabelText(doc, 'Notification Email')
        expect(await select.$eval('span', node => (node as HTMLElement).innerText)).toBe(
          'dhuber@repay.com'
        )
      })

      test('should present the mobile view for multiple=true comboBox=false', async () => {
        const doc = await getDocument(mobilePage)
        const actions = new FormActions(doc, mobilePage)
        await actions.selectMobileDropdownOption('All Locations', ['Tempe', 'Phoenix'])
        const select = await getByLabelText(doc, 'All Locations')
        expect(await select.$eval('span', node => (node as HTMLElement).innerText)).toBe(
          'TempePhoenix'
        )
      })

      // TODO: Finish mobile combo box tests after we research more on mobile accessibility
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
      const actions = new FormActions(doc, page)

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
      const year = await actions.getInputValueByLabel('year')
      const month = await actions.getInputValueByLabel('month')
      const day = await actions.getInputValueByLabel('day of month')
      expect(year).toEqual('2019')
      expect(month).toEqual('10')
      expect(day).toEqual('10')
    })
  })
})
