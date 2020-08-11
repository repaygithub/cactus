import { queryAllByText, queryByText } from '@testing-library/testcafe'
import * as path from 'path'
import { Selector } from 'testcafe'

import startStaticServer from './helpers/static-server'

// eslint-disable-next-line no-undef
fixture('Account Integration Tests')
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
  .page('http://localhost:33567/accounts')

test('DataGrid interactions in table view', async (t: TestController): Promise<void> => {
  // Set desktop screen size
  await t.resizeWindow(1600, 1200)
  // Sort by first name
  await t.click(queryByText('First Name'))
  await t.expect(queryByText('Anita').exists).ok()
  await t.expect(queryByText('James').exists).ok()
  await t.expect(queryByText('Victoria').exists).notOk()

  // Change sort order
  await t.click(queryByText('First Name'))
  await t.expect(queryByText('Victoria').exists).ok()
  await t.expect(queryByText('Chris').exists).ok()
  await t.expect(queryByText('Anita').exists).notOk()

  // Go to second page
  await t.click(Selector('a').withAttribute('aria-label', 'Go to page 2'))
  await t.expect(queryByText('Apple').exists).ok()
  await t.expect(queryByText('Anita').exists).ok()

  // Delete account using SplitButton
  await t.click(Selector('button').withAttribute('data-reach-menu-button').nth(0))
  await t.click(
    Selector('div').withAttribute('data-reach-menu-item').withText('Delete Account 76324')
  )
  await t.expect(queryByText('Account 76324 deleted successfully').exists).ok()

  // Navigate to account page using SplitButton
  await t.click(queryAllByText('View Account').nth(0))
  await t.expect(queryByText('Account 36521').exists).ok()
})

test('DataGrid interactions in card view', async (t: TestController): Promise<void> => {
  // Set iPad screen size
  await t.resizeWindow(834, 1112)
  // Sort by first name
  await t.click(queryByText('Sort by'))
  await t.click(Selector('div').withAttribute('data-reach-menu-item').withText('First Name'))
  await t.expect(queryByText('Anita').exists).ok()
  await t.expect(queryByText('James').exists).ok()
  await t.expect(queryByText('Victoria').exists).notOk()

  // Change sort order
  await t.click(queryByText('Order'))
  await t.click(Selector('div').withAttribute('data-reach-menu-item').withText('Ascending'))
  await t.expect(queryByText('Victoria').exists).ok()
  await t.expect(queryByText('Chris').exists).ok()
  await t.expect(queryByText('Anita').exists).notOk()

  // // Go to second page
  await t.click(Selector('a').withAttribute('aria-label', 'Go to page 2'))
  await t.expect(queryByText('Apple').exists).ok()
  await t.expect(queryByText('Anita').exists).ok()

  // // Delete account using SplitButton
  await t.click(Selector('button').withAttribute('data-reach-menu-button').nth(2))
  await t.click(
    Selector('div').withAttribute('data-reach-menu-item').withText('Delete Account 76324')
  )
  await t.expect(queryByText('Account 76324 deleted successfully').exists).ok()

  // Navigate to account page using SplitButton
  await t.click(queryAllByText('View Account').nth(0))
  await t.expect(queryByText('Account 36521').exists).ok()
})
