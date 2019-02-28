import * as React from 'react'
import { cleanup, render } from 'react-testing-library'
import AppRoot, { Text, I18nController } from './index'

afterEach(cleanup)

describe('@repay/cactus-fwk', () => {
  describe('<Text />', () => {
    test('can render get id', () => {
      const { container } = render(<Text get="this_is_my_key" />)
      expect(container).toHaveTextContent('this_is_my_key')
    })

    test('renders children when no dictionary is present', () => {
      const { container } = render(<Text get="this_is_my_key">This is the default content.</Text>)
      expect(container).toHaveTextContent('This is the default content.')
    })

    test('should render transalation when provided', () => {
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
