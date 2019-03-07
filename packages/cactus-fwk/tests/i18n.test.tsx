import * as React from 'react'
import { cleanup, render, act, RenderResult } from 'react-testing-library'
import MockPromise from './helpers/MockPromise'
import AppRoot, { BaseI18nController, I18nSection, I18nText } from '../src/index'
import { KeyDictionary } from '../src/types'

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

    test('should load default global when none is provided', () => {
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

    test('can access translations outside React context', () => {
      const global = { key_for_the_people: 'We are the people!' }
      const controller = new I18nController({ defaultLang: 'en', global })
      expect(controller.get({ id: 'key_for_the_people' })).toBe('We are the people!')
      const spanish = { key_for_the_people: 'Nosotros somos personas!' }
      controller.setLang('es')
      controller.setDict('es', 'global', spanish)
      expect(controller.get({ id: 'key_for_the_people' })).toBe('Nosotros somos personas!')
    })

    test('keeps track of failed resources', () => {
      const globalPromise = MockPromise.reject(Error('failed to load requested resource'))
      const mockLoad = jest.fn((...args) => globalPromise)
      class Controller extends BaseI18nController {
        //@ts-ignore
        load(...args) {
          return mockLoad(...args)
        }
      }
      const controller = new Controller({ defaultLang: 'en' })
      globalPromise._call()
      expect(controller._loadingState['en/global']).toBe('failed')
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
      const globalPromise = MockPromise.resolve({ 'runny-nose': 'WRONG KEY' })
      const sectionPromise = MockPromise.resolve({ 'runny-nose': 'This text should render' })
      //@ts-ignore
      controller.load = jest.fn(({ section }) =>
        section === 'global' ? globalPromise : sectionPromise
      )
      let container
      act(() => {
        let tester = render(
          <AppRoot withI18n={controller}>
            <I18nSection name="kleenex">
              <I18nText get="runny-nose" />
            </I18nSection>
          </AppRoot>
        )
        globalPromise._call()
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

    test('can override section', () => {
      const global = { key_for_the_people: 'We are the people!' }
      const controller = new I18nController({ defaultLang: 'en-US', global })
      controller.setDict('en-US', 'kleenex', { key_for_the_people: 'We are NOT the people!' })
      let container
      act(() => {
        let tester = render(
          <AppRoot withI18n={controller}>
            <I18nSection name="kleenex">
              <I18nText get="key_for_the_people" section="global" />
            </I18nSection>
          </AppRoot>
        )
        container = tester.container
      })
      expect(container).toHaveTextContent('We are the people!')
    })
  })
})
