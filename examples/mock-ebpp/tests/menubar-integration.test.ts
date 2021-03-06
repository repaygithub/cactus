import { queryByText } from '@testing-library/testcafe'
import * as path from 'path'
import { ClientFunction, Selector } from 'testcafe'

import startStaticServer from './helpers/static-server'

// eslint-disable-next-line no-undef
fixture('Menu bar integration test')
  .before(async (ctx): Promise<void> => {
    ctx.server = startStaticServer({
      directory: path.join(process.cwd(), 'dist'),
      port: 33567,
      singlePageApp: true,
    })
  })
  .after(async (ctx): Promise<void> => {
    await ctx.server.close()
  })
  .page('http://localhost:33567/')

const getUrl = ClientFunction(() => window.location.href)
const getWindowHeight = ClientFunction(() => window.innerHeight)

test('Navigate to faq page', async (t: TestController): Promise<void> => {
  await t.click(Selector('a').withText('FAQ'))
  let url = await getUrl()
  await t.expect(url).eql('http://localhost:33567/faq')
  if (t.browser.name === 'Internet Explorer') {
    await t.click(Selector('a').withText('Rules'))
  } else {
    await t.click(Selector('a').withText('RULES'))
  }
  url = await getUrl()
  await t.expect(url).eql('http://localhost:33567/rules')
})

test('Interact with dropdown', async (t: TestController): Promise<void> => {
  if (t.browser.name === 'Internet Explorer') {
    await t.click(Selector('span').withText('Accounts'))
  } else {
    await t.click(Selector('span').withText('ACCOUNTS'))
  }
  await t.click(Selector('a').withText('Dhalton Huber'))
  const url = await getUrl()
  await t.expect(url).eql('http://localhost:33567/account/45789')
})

test('Can click item when MenuBar is overflowed', async (t: TestController): Promise<void> => {
  const innerHeight = await getWindowHeight()
  await t.resizeWindow(1024, innerHeight)
  const scrollIcon = Selector('nav').child('div').nth(-1)
  await t.click(scrollIcon)
  await t.click(scrollIcon)
  await t.click(scrollIcon)
  await t.click(scrollIcon)
  await t.click(scrollIcon)
  await t.click(scrollIcon)
  await t.click(scrollIcon)
  if (t.browser.name === 'Internet Explorer') {
    await t.click(Selector('span').withText('Explore our modules on GitHub'))
  } else {
    await t.click(Selector('span').withText('EXPLORE OUR MODULES ON GITHUB'))
  }
  await t.expect(queryByText('Cactus Framework').exists).ok()
})
