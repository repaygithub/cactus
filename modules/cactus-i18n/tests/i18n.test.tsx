import { act, cleanup, fireEvent, render } from '@testing-library/react'
import * as React from 'react'

import I18nProvider, {
  BaseI18nController,
  I18nElement,
  I18nFormatted,
  I18nResource,
  I18nSection,
  I18nText,
  useI18nResource,
  useI18nText,
} from '../src/index'
import { ResourceDefinition } from '../src/types'
import MockPromise from './helpers/MockPromise'

class I18nController extends BaseI18nController {
  public load(): Promise<never[]> {
    console.error('This should not be called')
    return Promise.resolve([])
  }
}

afterEach(cleanup)

describe('i18n functionality', (): void => {
  describe('<I18nProvider />', (): void => {
    test('allows I18nText to render translations when provided', (): void => {
      const global = `this_is_the_key = This should render`
      const i18nController = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en'],
        global,
      })
      const { container } = render(
        <I18nProvider lang="en" controller={i18nController}>
          <I18nText get="this_is_the_key">This is the default content.</I18nText>
        </I18nProvider>
      )
      expect(container).toHaveTextContent('This should render')
    })

    test('should load translations for requested language', (): void => {
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
      i18nController.load = jest.fn((): MockPromise => esGlobalPromise)
      const { container } = render(
        <I18nProvider lang="es" controller={i18nController}>
          <I18nText get="this-is-the-key">This is the default content.</I18nText>
        </I18nProvider>
      )
      act((): void => {
        esGlobalPromise._call()
      })
      // @ts-ignore
      expect(container).toHaveTextContent('Este texto debe mostrar')
    })

    test('should render key from default language when key does not exist for requested language', (): void => {
      const global = `this_is_the_key = This should render`
      const i18nController = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en', 'es'],
        global,
      })
      const esGlobalPromise = MockPromise.resolve([{ lang: 'es', ftl: '' }])
      //@ts-ignore
      i18nController.load = jest.fn((): MockPromise => esGlobalPromise)
      let { container } = render(
        <I18nProvider lang="es" controller={i18nController}>
          <I18nText get="this_is_the_key">This is the default content.</I18nText>
        </I18nProvider>
      )
      act((): void => {
        esGlobalPromise._call()
      })
      expect(container).toHaveTextContent('This should render')
    })

    describe('with mocked console.error', (): void => {
      let _error: any
      beforeEach((): void => {
        _error = console.error
        console.error = jest.fn()
      })
      afterEach((): void => {
        console.error = _error
      })

      test('throws when I18nProvider is rendered without a controller', (): void => {
        expect((): void => {
          render(
            // @ts-ignore
            <I18nProvider>
              <I18nText get="this_is_the_key">This is the default content.</I18nText>
            </I18nProvider>
          )
        }).toThrowError()
      })
    })
  })

  describe('I18nController class', (): void => {
    test('should throw error when no supported languages are given', (): void => {
      //@ts-ignore
      expect((): BaseI18nController => new BaseI18nController({ defaultLang: 'en' })).toThrowError(
        'You must provide supported languages'
      )
    })

    test('load() should throw when not overridden', (): void => {
      //@ts-ignore
      class BadI18nController extends BaseI18nController {}
      expect(
        (): BaseI18nController =>
          new BadI18nController({ defaultLang: 'en', supportedLangs: ['en'] })
      ).toThrowError('You must override the `load` method')
    })

    test('should load default global when none is provided', (): void => {
      const mockLoad = jest.fn((): MockPromise => MockPromise.resolve([{ lang: 'en', ftl: '' }]))
      class Controller extends BaseI18nController {
        //@ts-ignore
        public load(): MockPromise {
          return mockLoad()
        }
      }
      new Controller({ defaultLang: 'en', supportedLangs: ['en'] })
      expect(mockLoad).toHaveBeenCalled()
    })

    test('can access translations outside React context', (): void => {
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

    test('defaults to use bidi isolating', (): void => {
      const global = `for-all-to-see = You can't see why this fails { $foo }`
      const controller = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en', 'es'],
        global,
      })
      expect(controller.getText({ id: 'for-all-to-see', args: { foo: 'bar' } })).toBe(
        `You can't see why this fails \u2068bar\u2069`
      )
    })

    test('can disabled bidi isolating characters', (): void => {
      const global = `for-all-to-see = No hidden characters here { $foo }`
      const controller = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en', 'es'],
        global,
        useIsolating: false,
      })
      expect(controller.getText({ id: 'for-all-to-see', args: { foo: 'bar' } })).toBe(
        'No hidden characters here bar'
      )
    })

    test('should only attempt to load supported languages', (): void => {
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
      // @ts-ignore
      controller.load = jest.fn(
        (): MockPromise => MockPromise.resolve([{ lang: 'en', ftl: global }])
      )
      controller._load({ lang: 'de-DE', section: 'global' })
      expect(controller.load).not.toBeCalled()
    })

    describe('with mocked console.error and console.warn', (): void => {
      let _error: any
      let _warn: any
      beforeEach((): void => {
        _error = console.error
        _warn = console.warn
        console.warn = jest.fn()
        console.error = jest.fn()
      })
      afterEach((): void => {
        console.error = _error
        console.warn = _warn
      })

      test('get() should gracefully handle missing id', (): void => {
        const global = `this_is_the_key = This should render`
        const i18nController = new I18nController({
          defaultLang: 'en',
          lang: 'es',
          supportedLangs: ['en', 'es'],
          global,
          debugMode: true,
        })
        expect(i18nController.get({ id: 'bogogo' })).toEqual([null, {}])
        expect(console.warn).toHaveBeenCalledWith(
          `The requested message bogogo does not exist in these translations: es, en`
        )
      })

      test('get() should gracefully handle missing section', (): void => {
        const global = `this_is_the_key = This should render`
        const i18nController = new I18nController({
          defaultLang: 'en',
          supportedLangs: ['en', 'es'],
          global,
          debugMode: true,
        })
        expect(i18nController.get({ section: 'foobar', id: 'bogogo' })).toEqual([null, {}])
        expect(console.warn).toHaveBeenCalledWith(
          `The requested message foobar__bogogo does not exist in these translations: en`
        )
      })

      test('can check for existing messages', (): void => {
        const global = `this_is_the_key = This should render`
        const i18nController = new I18nController({
          defaultLang: 'en',
          supportedLangs: ['en'],
          global,
          debugMode: true,
        })
        expect(i18nController.hasText({ id: 'this_is_the_key' })).toEqual(true)
        expect(i18nController.hasText({ section: 'other', id: 'not' })).toEqual(false)
        expect(console.warn).not.toHaveBeenCalled()
      })

      test('keeps track of failed resources', (): void => {
        const globalPromise = MockPromise.reject(Error('failed to load requested resource'))
        const mockLoad = jest.fn((): MockPromise => globalPromise)
        class Controller extends BaseI18nController {
          //@ts-ignore
          public load(): MockPromise {
            return mockLoad()
          }
        }
        const controller = new Controller({ defaultLang: 'en', supportedLangs: ['en'] })
        globalPromise._call()
        //@ts-ignore
        expect(controller._loadingState['global/en']).toBe('failed')
      })
    })
  })

  describe('<I18nSection />', (): void => {
    test('can be rendered without providing context', (): void => {
      const { container } = render(
        <I18nSection name="blank">
          <I18nText get="this_is_the_key">This is the default content.</I18nText>
        </I18nSection>
      )
      expect(container).toHaveTextContent('This is the default content.')
    })

    test('passed extra data to load()', (): void => {
      const controller = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en', 'en-US'],
        global: `runny-nose = WRONG KEY`,
      })
      const sectionPromise = MockPromise.resolve([
        {
          lang: 'en',
          ftl: `kleenex__runny-nose = This text should render`,
        },
      ])
      //@ts-ignore
      controller.load = jest.fn((): MockPromise => sectionPromise)

      render(
        <I18nProvider controller={controller}>
          <I18nSection name="kleenex" dynamic>
            <I18nText get="runny-nose" />
          </I18nSection>
        </I18nProvider>
      )
      act((): void => {
        sectionPromise._call()
      })
      expect(controller.load).toHaveBeenCalledWith(
        { section: 'kleenex', lang: 'en' },
        { dynamic: true }
      )
    })

    describe('should override', (): void => {
      test('section name', (): void => {
        const controller = new I18nController({
          defaultLang: 'en',
          supportedLangs: ['en', 'en-US'],
          global: `runny-nose = WRONG KEY`,
        })
        const globalPromise = MockPromise.resolve([{ lang: 'en', ftl: `runny-nose = WRONG KEY` }])
        const sectionPromise = MockPromise.resolve([
          {
            lang: 'en',
            ftl: `kleenex__runny-nose = This text should render`,
          },
        ])
        //@ts-ignore
        controller.load = jest.fn(
          ({ section }): MockPromise => (section === 'global' ? globalPromise : sectionPromise)
        )
        let { container } = render(
          <I18nProvider controller={controller}>
            <I18nSection name="kleenex">
              <I18nText get="runny-nose" />
            </I18nSection>
          </I18nProvider>
        )
        act((): void => {
          globalPromise._call()
          sectionPromise._call()
        })
        expect(container).toHaveTextContent('This text should render')
      })

      test('language selection', (): void => {
        const controller = new I18nController({
          defaultLang: 'en',
          supportedLangs: ['en', 'es'],
          global: `runny-nose = WRONG KEY`,
        })
        const globalPromise = MockPromise.resolve([{ lang: 'en', ftl: `runny-nose = WRONG KEY` }])
        const esGlobalPromise = MockPromise.resolve([
          {
            lang: 'es',
            ftl: `runny-nose = This text should render`,
          },
        ])
        //@ts-ignore
        controller.load = jest.fn(
          ({ lang }): MockPromise => (lang === 'en' ? globalPromise : esGlobalPromise)
        )
        const { container } = render(
          <I18nProvider controller={controller}>
            <I18nSection name="global" lang="es">
              <I18nText get="runny-nose" />
            </I18nSection>
          </I18nProvider>
        )
        act((): void => {
          globalPromise._call()
          esGlobalPromise._call()
        })
        expect(container).toHaveTextContent('This text should render')
      })
    })

    test('will load extra dependencies', (): void => {
      const controller = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en', 'en-US'],
        global: `runny-nose = WRONG KEY`,
      })
      const kleenexPromise = MockPromise.resolve([
        {
          lang: 'en',
          ftl: `kleenex__runny-nose = { needed__runny-nose }`,
        },
      ])
      const neededPromise = MockPromise.resolve([
        {
          lang: 'en',
          ftl: `needed__runny-nose = This text should render`,
        },
      ])
      //@ts-ignore
      controller.load = jest.fn(
        ({ section }): MockPromise => (section === 'needed' ? neededPromise : kleenexPromise)
      )

      const { container } = render(
        <I18nProvider controller={controller}>
          <I18nSection name="kleenex" dependencies={['needed']}>
            <I18nText get="runny-nose" />
          </I18nSection>
        </I18nProvider>
      )
      act((): void => {
        kleenexPromise._call()
      })
      // should not render until 'needed' section is also loaded
      expect(container).toHaveTextContent('')
      act((): void => {
        neededPromise._call()
      })
      expect(container).toHaveTextContent('This text should render')
    })

    test('will load extra dependencies with custom props', (): void => {
      const controller = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en', 'en-US'],
        global: `runny-nose = WRONG KEY`,
      })
      const kleenexPromise = MockPromise.resolve([
        {
          lang: 'en',
          ftl: `kleenex__runny-nose = { needed__runny-nose }`,
        },
      ])
      const neededPromise = MockPromise.resolve([
        {
          lang: 'en',
          ftl: `needed__runny-nose = This text should render`,
        },
      ])
      //@ts-ignore
      controller.load = jest.fn(
        ({ section }): MockPromise => (section === 'needed' ? neededPromise : kleenexPromise)
      )

      const i18nDependencies = [{ section: 'needed', extra: 'data', for: 'load function' }]
      render(
        <I18nProvider controller={controller}>
          <I18nSection name="kleenex" dependencies={i18nDependencies}>
            <I18nText get="runny-nose" />
          </I18nSection>
        </I18nProvider>
      )
      expect(controller.load).toHaveBeenCalledWith(
        { section: 'needed', lang: 'en' },
        { extra: 'data', for: 'load function' }
      )
    })
  })

  describe('<I18nText />', (): void => {
    test('can render get id', (): void => {
      const { container } = render(<I18nText get="this_is_my_key" />)
      expect(container).toHaveTextContent('this_is_my_key')
    })

    test('renders children when no dictionary is present', (): void => {
      const { container } = render(
        <I18nText get="this_is_my_key">This is the default content.</I18nText>
      )
      expect(container).toHaveTextContent('This is the default content.')
    })

    test('can render variables in a translation', (): void => {
      const global = `key-for-the-group= We are the { $groupName }!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      const { container } = render(
        <I18nProvider controller={controller}>
          <I18nText get="key-for-the-group" args={{ groupName: 'people' }} />
        </I18nProvider>
      )
      expect(container).toHaveTextContent('We are the \u2068people\u2069!')
    })

    test('can override section', (): void => {
      const global = `key_for_the_people= We are the people!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      controller.setDict('en-US', 'kleenex', `kleenex__key_for_the_people = We are NOT the people!`)
      let container
      act((): void => {
        let tester = render(
          <I18nProvider controller={controller}>
            <I18nSection name="kleenex">
              <I18nText get="key_for_the_people" section="global" />
            </I18nSection>
          </I18nProvider>
        )
        container = tester.container
      })
      expect(container).toHaveTextContent('We are the people!')
    })
  })

  describe('<I18nElement />', (): void => {
    test('can render get id when no context present', (): void => {
      const { container } = render(<I18nElement get="this_is_my_key" as="div" />)
      expect(container).toHaveTextContent('this_is_my_key')
    })

    test('can render variables in a translation', (): void => {
      const global = `key-for-the-group= We are the { $groupName }!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      const { container } = render(
        <I18nProvider controller={controller}>
          <I18nElement get="key-for-the-group" as="div" args={{ groupName: 'people' }} />
        </I18nProvider>
      )
      expect(container).toHaveTextContent('We are the \u2068people\u2069!')
    })

    test('can render an element with attributes', (): void => {
      const global = `
key-for-the-group= We are the { $groupName }!
  .aria-label = { $groupName} run the world`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      const { getByLabelText } = render(
        <I18nProvider controller={controller}>
          <I18nElement get="key-for-the-group" as="div" args={{ groupName: 'people' }} />
        </I18nProvider>
      )
      expect(getByLabelText('\u2068people\u2069 run the world')).not.toBeNull()
    })

    test('should pass additional props to rendered element', (): void => {
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
        <I18nProvider controller={controller}>
          <I18nElement get="key-for-the-group" as="div" onClick={handleClick} />
        </I18nProvider>
      )
      fireEvent.click(getByLabelText('people run the world'))
      expect(handleClick).toHaveBeenCalled()
    })
  })

  describe('<I18nResource />', (): void => {
    test('renders get key when message not found', (): void => {
      const { container } = render(
        <I18nResource get="this_is_my_key">
          {(message): React.ReactElement => <span>{message}</span>}
        </I18nResource>
      )
      expect(container).toHaveTextContent('this_is_my_key')
    })

    test('calls provided children as render prop', (): void => {
      const global = `
key-for-the-group = We are the { $groupName }!
  .aria-label = { $groupName} run the world`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      const { getByLabelText } = render(
        <I18nProvider controller={controller}>
          <I18nResource get="key-for-the-group" args={{ groupName: 'people' }}>
            {(message, attrs): React.ReactElement => <span {...attrs}>{message}</span>}
          </I18nResource>
        </I18nProvider>
      )
      const span = getByLabelText('\u2068people\u2069 run the world') as HTMLSpanElement
      expect(span).not.toBeNull()
      expect(span).toHaveTextContent('We are the \u2068people\u2069!')
    })

    test('calls provided render prop', (): void => {
      const global = `
key-for-the-group = We are the { $groupName }!
  .aria-label = { $groupName} run the world`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      const { getByLabelText } = render(
        <I18nProvider controller={controller}>
          <I18nResource
            get="key-for-the-group"
            args={{ groupName: 'people' }}
            render={(message, attrs): React.ReactElement => <span {...attrs}>{message}</span>}
          />
        </I18nProvider>
      )
      const span = getByLabelText('\u2068people\u2069 run the world') as HTMLSpanElement
      expect(span).not.toBeNull()
      expect(span).toHaveTextContent('We are the \u2068people\u2069!')
    })
  })

  describe('<I18nFormatted />', (): void => {
    test('should handle additional formatting', (): void => {
      const global = `key-for-the-group= We are the people!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      const formatter = jest.fn(
        (text: string): React.ReactElement => {
          return <div data-testid="hoobla">{text}</div>
        }
      )
      const { getByTestId } = render(
        <I18nProvider controller={controller}>
          <I18nFormatted get="key-for-the-group" formatter={formatter} />
        </I18nProvider>
      )
      expect(getByTestId('hoobla')).toHaveTextContent('We are the people!')
    })
  })

  describe('useI18nText()', (): void => {
    test('returns fluent text', (): void => {
      const global = `key-for-the-group= We are the people!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      const TestI18nText = (): React.ReactElement => {
        const text = useI18nText('key-for-the-group')
        return <div data-testid="used-text">{text}</div>
      }
      const { getByTestId } = render(
        <I18nProvider controller={controller}>
          <TestI18nText />
        </I18nProvider>
      )
      expect(getByTestId('used-text')).toHaveTextContent('We are the people!')
    })

    test('returns formatted fluent text with args', (): void => {
      const global = `key-for-the-group= We are the { $groupName }!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      const TestI18nText = (): React.ReactElement => {
        const text = useI18nText('key-for-the-group', { groupName: 'rabbits' })
        return <div data-testid="used-text">{text}</div>
      }
      const { getByTestId } = render(
        <I18nProvider controller={controller}>
          <TestI18nText />
        </I18nProvider>
      )
      expect(getByTestId('used-text')).toHaveTextContent(/We are the .rabbits.!/)
    })

    test('allows overriding section for text', (): void => {
      const global = `key-for-the-group= We are the { $groupName }!`
      const simple = `simple__key-for-the-group = We are the simple people!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      controller.setDict('en-US', 'simple', simple)
      const TestI18nText = (): React.ReactElement => {
        const text = useI18nText('key-for-the-group', undefined, 'simple')
        return <div data-testid="used-text">{text}</div>
      }
      const { getByTestId } = render(
        <I18nProvider controller={controller}>
          <TestI18nText />
        </I18nProvider>
      )
      expect(getByTestId('used-text')).toHaveTextContent(/We are the simple people!/)
    })
  })

  describe('useI18nResource()', (): void => {
    test('returns fluent text and attributes', (): void => {
      const global = `
key-for-the-group= We are the people!
  .aria-label = people run the world`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      const TestI18nResource = (): React.ReactElement => {
        const [text, attrs] = useI18nResource('key-for-the-group')
        return <div {...attrs}>{text}</div>
      }
      const { getByLabelText } = render(
        <I18nProvider controller={controller}>
          <TestI18nResource />
        </I18nProvider>
      )
      expect(getByLabelText('people run the world')).toHaveTextContent('We are the people!')
    })

    test('returns formatted text and attributes applying provided args', (): void => {
      const global = `
key-for-the-group= We are the { $groupName }!
  .aria-label = people run the { $place }`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      const TestI18nResource = (): React.ReactElement => {
        const [text, attrs] = useI18nResource('key-for-the-group', {
          groupName: 'people',
          place: 'world',
        })
        return <div {...attrs}>{text}</div>
      }
      const { getByLabelText } = render(
        <I18nProvider controller={controller}>
          <TestI18nResource />
        </I18nProvider>
      )
      expect(getByLabelText(/people run the .world./)).toHaveTextContent(/We are the .people.!/)
    })

    test('allows overriding section', (): void => {
      const global = `key-for-the-group= We are the people!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
        global,
      })
      controller.setDict('en-US', 'other', 'other__key-for-the-group = We are the OTHER people!')
      const TestI18nResource = (): React.ReactElement => {
        const [text, attrs] = useI18nResource('key-for-the-group', undefined, 'other')
        return (
          <div data-testid="select-me" {...attrs}>
            {text}
          </div>
        )
      }
      const { getByTestId } = render(
        <I18nProvider controller={controller}>
          <TestI18nResource />
        </I18nProvider>
      )
      expect(getByTestId('select-me')).toHaveTextContent(/We are the OTHER people!/)
    })
  })
})
