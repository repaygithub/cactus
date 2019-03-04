import * as React from 'react'
import { cleanup, render, act, RenderResult } from 'react-testing-library'
import MockPromise from './helpers/MockPromise'
import AppRoot, { BaseI18nController, KeyDictionary, I18nSection, I18nText } from '../src/index'

class I18nController extends BaseI18nController {
  load(arg: { lang: string; section: string }) {
    return Promise.resolve({})
  }
}

afterEach(cleanup)

describe('i18n functionality', () => {
  describe('<AppRoot />', () => {
    test('can use AppRoot without an i18n controller', () => {
      const { container } = render(
        <AppRoot>
          <I18nText get="this_is_the_key">This is the default content.</I18nText>
        </AppRoot>
      )
      expect(container).toHaveTextContent('This is the default content.')
    })

    test('allows I18nText to render translations when provided', () => {
      const global = { this_is_the_key: 'This should render' }
      const i18nController = new I18nController({ defaultLang: 'en', global })
      const { container } = render(
        <AppRoot lang="en" withI18n={i18nController}>
          <I18nText get="this_is_the_key">This is the default content.</I18nText>
        </AppRoot>
      )
      expect(container).toHaveTextContent('This should render')
    })

    test('should load translations for requested language', () => {
      const global = { this_is_the_key: 'This should not render' }
      const esGlobal: KeyDictionary = { this_is_the_key: 'este texto debe mostrar' }
      const i18nController = new I18nController({ defaultLang: 'en', global })
      const esGlobalPromise = MockPromise.resolve(esGlobal)
      // @ts-ignore
      i18nController.load = jest.fn(() => esGlobalPromise)
      let tester: RenderResult
      act(() => {
        tester = render(
          <AppRoot lang="es" withI18n={i18nController}>
            <I18nText get="this_is_the_key">This is the default content.</I18nText>
          </AppRoot>
        )
        esGlobalPromise._call()
      })
      // @ts-ignore
      expect(tester.container).toHaveTextContent('este texto debe mostrar')
    })

    test('should render key from default language when key does not exist for requested language', () => {
      const global = { this_is_the_key: 'This should render' }
      const i18nController = new I18nController({ defaultLang: 'en', global })
      const esGlobalPromise = MockPromise.resolve({})
      //@ts-ignore
      i18nController.load = jest.fn(() => esGlobalPromise)
      let container
      act(() => {
        let tester = render(
          <AppRoot lang="es" withI18n={i18nController}>
            <I18nText get="this_is_the_key">This is the default content.</I18nText>
          </AppRoot>
        )
        esGlobalPromise._call()
        container = tester.container
      })
      expect(container).toHaveTextContent('This should render')
    })
  })

  describe('I18nController class', () => {
    test('load() should throw when not overridden', () => {
      //@ts-ignore
      class BadI18nController extends BaseI18nController {}
      expect(() => new BadI18nController({ defaultLang: 'en' })).toThrowError(
        'You must override the `load` method!'
      )
    })

    test('Should load default global when none is provided', () => {
      const mockLoad = jest.fn((...args) => MockPromise.resolve({}))
      class Controller extends BaseI18nController {
        //@ts-ignore
        load(...args) {
          return mockLoad(...args)
        }
      }
      new Controller({ defaultLang: 'en' })
      expect(mockLoad).toHaveBeenCalled()
    })
  })

  describe('<I18nSection />', () => {
    test('can be rendered without providing context', () => {
      const { container } = render(
        <I18nSection name="blank">
          <I18nText get="this_is_the_key">This is the default content.</I18nText>
        </I18nSection>
      )
      expect(container).toHaveTextContent('This is the default content.')
    })

    test('should override global context', () => {
      const controller = new I18nController({ defaultLang: 'en', global: {} })
      const sectionPromise = MockPromise.resolve({ 'runny-nose': 'This text should render' })
      //@ts-ignore
      controller.load = jest.fn(() => sectionPromise)
      let container
      act(() => {
        let tester = render(
          <AppRoot withI18n={controller}>
            <I18nSection name="kleenex">
              <I18nText get="runny-nose" />
            </I18nSection>
          </AppRoot>
        )
        sectionPromise._call()
        container = tester.container
      })
      expect(container).toHaveTextContent('This text should render')
    })
  })

  describe('<I18nText />', () => {
    test('can render get id', () => {
      const { container } = render(<I18nText get="this_is_my_key" />)
      expect(container).toHaveTextContent('this_is_my_key')
    })

    test('renders children when no dictionary is present', () => {
      const { container } = render(
        <I18nText get="this_is_my_key">This is the default content.</I18nText>
      )
      expect(container).toHaveTextContent('This is the default content.')
    })
  })
})
