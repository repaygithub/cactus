import * as path from 'path'
import { queryAllByText, queryByTestId, queryByText } from '@testing-library/testcafe'
import { Selector } from 'testcafe'
import startStaticServer from './helpers/static-server'

fixture('Account Integration Tests')
  .before(async (ctx) => {
    ctx.server = startStaticServer({
      directory: path.join(process.cwd(), 'dist'),
      port: 33567,
      singlePageApp: true,
    })
  })
  .after(async (ctx) => {
    await ctx.server.close()
  })
  .page('http://localhost:33567/accounts')

test('navigate to account page using SplitButton', async (t: TestController) => {
  await t.click(queryAllByText('View Account').nth(0))
  await t.expect(queryByText('Account 85963').exists).ok()
})

test('delete account with using SplitButton', async (t: TestController) => {
  await t.click(Selector('button').withAttribute('data-reach-menu-button').nth(0))
  await t.pressKey('down enter')
  await t.expect(queryByText('Account 85963 deleted successfully').exists).ok()
})
