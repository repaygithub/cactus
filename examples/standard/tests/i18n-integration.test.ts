import { queryByTestId, queryByText } from '@testing-library/testcafe'
import * as path from 'path'
import { Selector } from 'testcafe' // eslint-disable-line @typescript-eslint/no-unused-vars

import startStaticServer from './helpers/static-server'

// eslint-disable-next-line no-undef
fixture('I18n Integration tests')
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

test.page('http://localhost:33567?lang=en-US')(
  'we can see the rendered content when navigator.language is en-US',
  async (t): Promise<void> => {
    await t
      .expect(
        queryByText(
          'Welcome to the standard application using `@repay/cactus-i18n` demonstrating the basic usages,'
        ).exists
      )
      .ok('Could not find translated text')
  }
)

test.page('http://localhost:33567?lang=en-US')(
  'we can set the language manually when navigator.language is en-US',
  async (t): Promise<void> => {
    await t.click(queryByTestId('select-language')).pressKey('down down enter')
    await t
      .expect(
        queryByText(
          'Bienvenido a la aplicación estándar usando `@repay/cactus-i18n` demostrando los usos básicos'
        ).exists
      )
      .ok('Could not find Spanish translation')
  }
)

test.page('http://localhost:33567?lang=es-MX')(
  'we can see the rendered content when browser language is es-MX',
  async (t): Promise<void> => {
    await t
      .expect(
        queryByText(
          'Bienvenido a la aplicación estándar usando `@repay/cactus-i18n` demostrando los usos básicos'
        ).exists
      )
      .ok('Could not find translated text')
  }
)
