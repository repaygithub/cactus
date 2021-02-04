import { queryByText } from '@testing-library/testcafe'
import * as path from 'path'
import { ClientFunction } from 'testcafe'

import { UIConfigData } from '../types'
import makeActions, { clickWorkaround } from './helpers/actions'
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
  await fillTextField('month', '2')
  await fillTextField('day of month', '28')
  await fillTextField('year', '2019')
  await clickWorkaround(queryByText('Submit'))

  const apiData: UIConfigData = await getApiData()
  const fileContents = apiData.fileInput[0].contents
  // IE spits out null for the contents if the file is 0 bytes; other browsers vary.
  if (fileContents !== null) {
    await t.expect(fileContents.startsWith('data:')).ok()
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
    fileInput: [{ fileName: 'test-logo.jpg', contents: fileContents, status: 'loaded' }],
    establishedDate: '2019-02-28',
  })
})
