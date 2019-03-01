import * as React from 'react'
import { cleanup, render } from 'react-testing-library'
import AppRoot, { Text, I18nController } from '../src/index'

afterEach(cleanup)

describe('cactus-fwk', () => {
  describe('<AppRoot/>', () => {
    test('allows Text to render translations when provided', () => {
      const global = { this_is_the_key: 'This should render' }
      const i18nController = new I18nController({ defaultLang: 'en', global })
      const { container } = render(
        <AppRoot lang="en" withI18n={i18nController}>
          <Text get="this_is_the_key">This is the default content.</Text>
        </AppRoot>
      )
      expect(container).toHaveTextContent('This should render')
    })

    test('should render key from default language when key does not exist for requested language', () => {
      const global = { this_is_the_key: 'This should render' }
      const i18nController = new I18nController({ defaultLang: 'en', global })
      const { container } = render(
        <AppRoot lang="es" withI18n={i18nController}>
          <Text get="this_is_the_key">This is the default content.</Text>
        </AppRoot>
      )
      expect(container).toHaveTextContent('This should render')
    })
  })
})
