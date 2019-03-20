import * as React from 'react'
import { cleanup, render, act, fireEvent, RenderResult } from 'react-testing-library'
import MockPromise from './helpers/MockPromise'
import AppRoot, {
  BaseI18nController,
  I18nSection,
  I18nElement,
  I18nText,
  I18nFormatted,
} from '../src/index'
import { ResourceDefinition } from '../src/types'

class I18nController extends BaseI18nController {
  load(arg: { lang: string; section: string }) {
    console.error('This should not be called')
    return Promise.resolve([])
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
      const global = `this_is_the_key = This should render`
      const i18nController = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en'],
        global,
      })
      const { container } = render(
        <AppRoot lang="en" withI18n={i18nController}>
          <I18nText get="this_is_the_key">This is the default content.</I18nText>
        </AppRoot>
      )
      expect(container).toHaveTextContent('This should render')
    })

    test('should load translations for requested language', () => {
      const globalEn = 'this-is-the-key = This should not render'
      const globalEs = 'this-is-the-key = Este texto debe mostrar'
      const globalEsResDef: ResourceDefinition = { lang: 'es', ftl: globalEs }
      const i18nController = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en', 'es'],
        global: globalEn,
      })
      const esGlobalPromise = MockPromise.resolve([globalEsResDef])
      // @ts-ignore
      i18nController.load = jest.fn(() => esGlobalPromise)
      let tester: RenderResult
      act(() => {
        tester = render(
          <AppRoot lang="es" withI18n={i18nController}>
            <I18nText get="this-is-the-key">This is the default content.</I18nText>
          </AppRoot>
        )
        esGlobalPromise._call()
      })
      // @ts-ignore
      expect(tester.container).toHaveTextContent('Este texto debe mostrar')
    })

    test('should render key from default language when key does not exist for requested language', () => {
      const global = `this_is_the_key = This should render`
      const i18nController = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en', 'es'],
        global,
      })
      const esGlobalPromise = MockPromise.resolve([{ lang: 'es', ftl: '' }])
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
    test('should throw error when no supported languages are given', () => {
      //@ts-ignore
      expect(() => new BaseI18nController({ defaultLang: 'en' })).toThrowError(
        'You must provide supported languages'
      )
    })

    test('load() should throw when not overridden', () => {
      //@ts-ignore
      class BadI18nController extends BaseI18nController {}
      expect(
        () => new BadI18nController({ defaultLang: 'en', supportedLangs: ['en'] })
      ).toThrowError('You must override the `load` method')
    })

    test('should load default global when none is provided', () => {
      const mockLoad = jest.fn((...args) => MockPromise.resolve([{ lang: 'en', ftl: '' }]))
      class Controller extends BaseI18nController {
        //@ts-ignore
        load(...args) {
          return mockLoad(...args)
        }
      }
      new Controller({ defaultLang: 'en', supportedLangs: ['en'] })
      expect(mockLoad).toHaveBeenCalled()
    })

    test('can access translations outside React context', () => {
      const global = `
key_for_the_people = We are the people!
  .aria-label=anything { $value }
  .name=test
key-for-no-people = blah blah blue stew`
      const controller = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en', 'es'],
        global,
      })
      expect(controller.getText({ id: 'key_for_the_people', args: { value: 'foo' } })).toBe(
        'We are the people!'
      )
      expect(controller.getText({ id: 'key-for-no-people' })).toBe('blah blah blue stew')
      const spanish = `key_for_the_people = Nosotros somos personas!`
      controller.setLang('es')
      controller.setDict('es', 'global', spanish)
      expect(controller.getText({ id: 'key_for_the_people' })).toBe('Nosotros somos personas!')
    })

    describe('with mocked console.error and console.warn', () => {
      let _error: any
      let _warn: any
      beforeEach(() => {
        _error = console.error
        _warn = console.warn
        console.warn = jest.fn()
        console.error = jest.fn()
      })
      afterEach(() => {
        console.error = _error
        console.warn = _warn
      })

      test('get() should gracefully handle missing id', () => {
        const global = `this_is_the_key = This should render`
        const i18nController = new I18nController({
          defaultLang: 'en',
          lang: 'es',
          supportedLangs: ['en', 'es'],
          global,
          debugMode: true
        })
        expect(i18nController.get({ id: 'bogogo' })).toEqual([null, {}])
        expect(console.warn).toHaveBeenCalledWith(
          `The requested id bogogo for section global does not exist in these translations: es, en`
        )
      })

      test('get() should gracefully handle missing section', () => {
        const global = `this_is_the_key = This should render`
        const i18nController = new I18nController({
          defaultLang: 'en',
          supportedLangs: ['en', 'es'],
          global,
          debugMode: true
        })
        expect(i18nController.get({ section: 'foobar', id: 'bogogo' })).toEqual([null, {}])
        expect(console.warn).toHaveBeenCalledWith(
          `The requested section foobar does not exist when requesting id bogogo`
        )
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
        const controller = new Controller({ defaultLang: 'en', supportedLangs: ['en'] })
        globalPromise._call()
        expect(controller._loadingState['global/en']).toBe('failed')
      })
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
      const controller = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en', 'en-US'],
        global: `runny-nose = WRONG KEY`,
      })
      const globalPromise = MockPromise.resolve([{ lang: 'en-US', ftl: `runny-nose = WRONG KEY` }])
      const sectionPromise = MockPromise.resolve([
        {
          lang: 'en-US',
          ftl: `runny-nose = This text should render`,
        },
      ])
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

    test('can render variables in a translation', () => {
      const global = `key-for-the-group= We are the { $groupName }!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      const { container } = render(
        <AppRoot withI18n={controller}>
          <I18nText get="key-for-the-group" args={{ groupName: 'people' }} />
        </AppRoot>
      )
      expect(container).toHaveTextContent('We are the \u2068people\u2069!')
    })

    test('can override section', () => {
      const global = `key_for_the_people= We are the people!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      controller.setDict('en-US', 'kleenex', `key_for_the_people = We are NOT the people!`)
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

  describe('<I18nElement />', () => {
    test('can render get id when no context present', () => {
      const { container } = render(<I18nElement get="this_is_my_key" as="div" />)
      expect(container).toHaveTextContent('this_is_my_key')
    })

    test('can render variables in a translation', () => {
      const global = `key-for-the-group= We are the { $groupName }!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      const { container } = render(
        <AppRoot withI18n={controller}>
          <I18nElement get="key-for-the-group" as="div" args={{ groupName: 'people' }} />
        </AppRoot>
      )
      expect(container).toHaveTextContent('We are the \u2068people\u2069!')
    })

    test('can render an element with attributes', () => {
      const global = `
key-for-the-group= We are the { $groupName }!
  .aria-label = { $groupName} run the world`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      const { getByLabelText } = render(
        <AppRoot withI18n={controller}>
          <I18nElement get="key-for-the-group" as="div" args={{ groupName: 'people' }} />
        </AppRoot>
      )
      expect(getByLabelText('\u2068people\u2069 run the world')).not.toBeNull()
    })

    test('should pass additional props to rendered element', () => {
      const global = `
key-for-the-group= We are the people!
  .aria-label = people run the world`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      const handleClick = jest.fn()
      const { getByLabelText } = render(
        <AppRoot withI18n={controller}>
          <I18nElement get="key-for-the-group" as="div" onClick={handleClick} />
        </AppRoot>
      )
      fireEvent.click(getByLabelText('people run the world'))
      expect(handleClick).toHaveBeenCalled()
    })
  })

  describe('<I18nFormatted />', () => {
    test('should handle additional formatting', () => {
      const global = `key-for-the-group= We are the people!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      const formatter = jest.fn((text: string) => {
        return <div data-testid="hoobla">{text}</div>
      })
      const { getByTestId } = render(
        <AppRoot withI18n={controller}>
          <I18nFormatted get="key-for-the-group" formatter={formatter} />
        </AppRoot>
      )
      expect(getByTestId('hoobla')).toHaveTextContent('We are the people!')
    })
  })
})
