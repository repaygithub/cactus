import * as React from 'react'
import { cleanup, render, act, RenderResult } from 'react-testing-library'
import AppRoot, { Text, BaseI18nController, KeyDictionary, Section } from '../src/index'

type MaybeFunc = ((params: any) => any) | null

class MockPromise {
  _then: MaybeFunc = null
  _catch: MaybeFunc = null
  _chain: MockPromise | null = null
  _value: any

  constructor(value?: any) {
    this._value = value
  }

  _setValue(value: any) {
    this._value = value
  }

  _call(value?: any, hasThrown?: boolean) {
    let callback = hasThrown ? this._catch : this._then
    value = value || this._value
    let threwAgain = false
    let nextValue: any
    try {
      nextValue = callback !== null && callback(value)
    } catch (e) {
      threwAgain = true
      nextValue = e
    }

    if (this._chain !== null) {
      this._chain._call(nextValue, threwAgain)
    }
  }

  then(callback: (params: any) => any): MockPromise {
    this._then = callback
    return (this._chain = new MockPromise())
  }

  catch(callback: (params: any) => any): MockPromise {
    this._catch = callback
    return (this._chain = new MockPromise())
  }

  static resolve(value: any): MockPromise {
    return new MockPromise(value)
  }
}

class I18nController extends BaseI18nController {
  load(arg: { lang: string; section: string }) {
    return Promise.resolve({})
  }
}

afterEach(cleanup)

describe('cactus-fwk', () => {
  describe('<AppRoot />', () => {
    test('can use AppRoot without i18n', () => {
      const { container } = render(
        <AppRoot>
          <Text get="this_is_the_key">This is the default content.</Text>
        </AppRoot>
      )
      expect(container).toHaveTextContent('This is the default content.')
    })

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
            <Text get="this_is_the_key">This is the default content.</Text>
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
            <Text get="this_is_the_key">This is the default content.</Text>
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

  describe('<Section />', () => {
    test('can be rendered without providing context', () => {
      const { container } = render(
        <Section name="blank">
          <Text get="this_is_the_key">This is the default content.</Text>
        </Section>
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
            <Section name="kleenex">
              <Text get="runny-nose" />
            </Section>
          </AppRoot>
        )
        sectionPromise._call()
        container = tester.container
      })
      expect(container).toHaveTextContent('This text should render')
    })
  })
})
