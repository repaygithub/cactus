import * as path from 'path'
import { ApiData } from '../types'
import {
  clickByText,
  fillTextField,
  selectDropdownOption,
  uploadFile,
} from './helpers/form-actions'
import { getDocument } from 'pptr-testing-library'
import puppeteer from 'puppeteer'
import startStaticServer, { ServerObj } from './helpers/static-server'

describe('UI Config Form', () => {
  let page: puppeteer.Page
  let server: ServerObj
  beforeAll(async () => {
    page = await global.__BROWSER__.newPage()
    server = startStaticServer({
      directory: path.join(process.cwd(), 'dist'),
      port: 3436,
      singlePageApp: true,
    })
    await page.goto('http://localhost:3436/ui-config')
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

    const apiData: ApiData = await page.evaluate(() => window.apiData)
    expect(apiData).toMatchObject({
      display_name: 'Test Merchant',
      merchant_name: 'tst-mrchnt',
      terms_and_conditions: 'You must be this tall to test',
      welcome_content: 'Welcome to the integration test app',
      footer_content: 'Powered by coffee and sheer willpower',
      allow_customer_login: true,
      use_cactus_styles: true,
      select_color: 'blue',
      file_input: [{ fileName: 'test-logo.jpg', contents: 'data:', status: 'loaded' }],
    })
  })

  // TODO: Add tests for field errors, partially filled out forms, etc
})
