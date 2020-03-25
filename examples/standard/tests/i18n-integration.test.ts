import * as path from 'path'
import { getDocument, queries } from 'pptr-testing-library'
import puppeteer from 'puppeteer'
import startStaticServer, { ServerObj } from './helpers/static-server'
import { doesNotReject } from 'assert'

const { getByText } = queries

function getLangJs(lang: string, languages: Array<string> = [lang]) {
  // overwrite the navigator.languages properties to use a custom getter
  return `
Object.defineProperties(navigator, {
  "languages": {
    get() {
      return ${JSON.stringify(languages)};
    }
  },
  "language": {
    get() {
      return ${JSON.stringify(lang)};
    }
  }
});`
}

describe('I18n Integration tests', () => {
  let page: puppeteer.Page
  let server: ServerObj

  beforeAll(async () => {
    page = await global.__BROWSER__.newPage()
    server = startStaticServer({
      directory: path.join(process.cwd(), 'dist'),
      port: 33567,
      singlePageApp: true,
    })
  })

  afterAll(async () => {
    await server.close()
  })

  describe('when navigator.language is en-US', () => {
    beforeEach(async () => {
      await page.evaluateOnNewDocument(getLangJs('en-US', ['en-US', 'en']))
      await page.goto('http://localhost:33567', { waitUntil: 'domcontentloaded' })
    })

    test('we can see the rendered content', async () => {
      const doc = await getDocument(page)
      expect(
        await getByText(
          doc,
          'Welcome to the standard application using `@repay/cactus-i18n` demonstrating the basic usages,'
        )
      ).not.toBeNull()
    })

    test('we can set the language manually', async () => {
      await page.setExtraHTTPHeaders  ({
        'Accept-Language': 'es-MX'
      })
      const doc = await getDocument(page)
      expect(
        await getByText(
          doc,
          'Bienvenido a la aplicación estándar usando `@repay/cactus-i18n` demostrando los usos básicos'
        )
      ).not.toBeNull()
    })
  })

  describe('when browser language is es-MX', () => {
    beforeAll(async () => {
      page = await global.__BROWSER__.newPage()
      await page.setExtraHTTPHeaders  ({
        'Accept-Language': 'es-MX'
      })
    })
    beforeEach(async () => {
      await page.evaluateOnNewDocument(getLangJs('es-MX', ['es-MX', 'es']))
      await page.goto('http://localhost:33567', { waitUntil: 'domcontentloaded' })
    })

    test('we can see the rendered content', async () => {
      const doc = await getDocument(page)
      expect(
        await getByText(
          doc,
          'Bienvenido a la aplicación estándar usando `@repay/cactus-i18n` demostrando los usos básicos'
        )
      ).not.toBeNull()
    })
  })
})