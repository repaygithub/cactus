import { queryByLabelText, queryByText } from '@testing-library/testcafe'
import * as path from 'path'
import { ClientFunction } from 'testcafe'

import { UIConfigData } from '../types'
import makeActions from './helpers/actions'
import startStaticServer from './helpers/static-server'

const getApiData = ClientFunction((): UIConfigData => (window as any).apiData)

// eslint-disable-next-line no-undef
fixture('UI Config Integration Tests')
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
  .page('http://localhost:33567/ui-config')

test('should fill out and submit the entire form', async (t): Promise<void> => {
  const { fillTextField, searchComboBox, selectDropdownOption, uploadFile } = makeActions(t)

  await fillTextField('Display Name', 'Test Merchant')
  await fillTextField('Merchant Name', 'tst-mrchnt')
  await fillTextField('Terms and Conditions', 'You must be this tall to test')
  await fillTextField('Welcome Content', 'Welcome to the integration test app')
  await fillTextField('Footer Content', 'Powered by coffee and sheer willpower')
  await selectDropdownOption('Notification Email', 'dhuber@repay.com')
  await selectDropdownOption('All Locations', ['Tempe', 'Phoenix'])
  await searchComboBox('Most Popular Location', 'Tempe')
  await selectDropdownOption('Card Brands', ['MasterCard', 'Visa'])
  await uploadFile()
  await t.click(queryByText('Blue'))
  await t.click(queryByText('Allow Customer Login'))
  await t.click(queryByText('Use Cactus Styles'))
  await t.click(queryByText('Submit'))

  const apiData: UIConfigData = await getApiData()
  if (apiData.fileInput[0].contents === null) {
    // IE spits out null for the contents if the file is 0 bytes
    apiData.fileInput[0].contents = 'data:'
  }

  await t.expect(apiData).eql({
    displayName: 'Test Merchant',
    merchantName: 'tst-mrchnt',
    termsAndConditions: 'You must be this tall to test',
    welcomeContent: 'Welcome to the integration test app',
    footerContent: 'Powered by coffee and sheer willpower',
    notificationEmail: 'dhuber@repay.com',
    allLocations: ['Tempe', 'Phoenix'],
    mpLocation: 'Tempe',
    cardBrands: ['MasterCard', 'Visa'],
    allowCustomerLogin: true,
    useCactusStyles: true,
    selectColor: 'blue',
    fileInput: [{ fileName: 'test-logo.jpg', contents: 'data:', status: 'loaded' }],
    establishedDate: '2019-10-16',
  })
})

test('moves focus to date picker on click', async (t): Promise<void> => {
  const { getActiveElement } = makeActions(t)
  const datePickerTrigger = queryByLabelText('Open date picker')
  await t.click(datePickerTrigger).pressKey('tab')
  const activeEl = await getActiveElement()

  await t
    .expect(activeEl.attributes?.['aria-label'])
    .eql('Click to change month and year')
    .expect(activeEl.attributes?.['aria-roledescription'])
    .eql('toggles between calendar and month year selectors')
    .expect(activeEl.focused)
    .ok('Date picker is not focused')
})

test('locks focus to date picker', async (t: TestController): Promise<void> => {
  const { getActiveElement } = makeActions(t)
  const datePickerTrigger = queryByLabelText('Open date picker')
  await t.click(datePickerTrigger)

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
    .eql('Click to change month and year')
    .expect(monthSelectActiveEl.attributes?.['aria-roledescription'])
    .eql('toggles between calendar and month year selectors')
    .expect(monthSelectActiveEl.focused)
    .ok('Date button not focused')
})

test('move and select date with keyboard', async (t: TestController): Promise<void> => {
  const { getActiveElement } = makeActions(t)
  const datePickerTrigger = queryByLabelText('Open date picker')
  await t.click(datePickerTrigger)

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
