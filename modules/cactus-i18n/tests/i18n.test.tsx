import { FluentResource } from '@fluent/bundle'
import { fireEvent, render, screen } from '@testing-library/react'
import * as React from 'react'

import I18nProvider, {
  AsyncLoadResult,
  BaseI18nController,
  BundleInfo,
  I18nElement,
  I18nFormatted,
  I18nResource,
  I18nSection,
  I18nText,
  Loader,
  LoadOpts,
  useI18nResource,
  useI18nText,
} from '../src/index'

const NOT_FOUND = { text: null, attrs: {}, found: false }

class I18nController extends BaseI18nController {
  protected async _load(b: BundleInfo, opts: LoadOpts): AsyncLoadResult {
    if (opts.defaults) {
      return { resources: [opts.defaults] }
    } else if (typeof opts.content === 'string') {
      return { resources: [opts.content] }
    }
  }

  public async loadAll(...loadArgs: any[]) {
    for (const options of loadArgs) {
      this.load(options)
    }
  }
}

describe('i18n functionality', () => {
  describe('<I18nProvider />', () => {
    test('allows I18nText to render translations when provided', async () => {
      const global = `this_is_the_key = This should render`
      const i18nController = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en'],
      })
      await i18nController.loadAll({ section: 'global', lang: 'en', content: global })
      const { container } = render(
        <I18nProvider lang="en" controller={i18nController}>
          <I18nText get="this_is_the_key">This is the default content.</I18nText>
        </I18nProvider>
      )
      expect(container).toHaveTextContent('This should render')
    })

    test('should load translations for requested language', async () => {
      const globalEn = 'this-is-the-key = This should not render'
      const globalEs = 'this-is-the-key = Este texto debe mostrar'
      const i18nController = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en', 'es'],
      })
      await i18nController.loadAll(
        { section: 'global', lang: 'en', content: globalEn },
        { section: 'global', lang: 'es', content: globalEs }
      )
      const { container } = render(
        <I18nProvider lang="es" controller={i18nController}>
          <I18nText get="this-is-the-key">This is the default content.</I18nText>
        </I18nProvider>
      )
      expect(container).toHaveTextContent('Este texto debe mostrar')
    })

    test('should render key from default language when key does not exist for requested language', async () => {
      const global = `this_is_the_key = This should render`
      const i18nController = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en', 'es'],
      })
      await i18nController.loadAll({ section: 'global', lang: 'en', content: global })
      const { container } = render(
        <I18nProvider lang="es" controller={i18nController}>
          <I18nText get="this_is_the_key">This is the default content.</I18nText>
        </I18nProvider>
      )
      expect(container).toHaveTextContent('This should render')
    })

    describe('with mocked console.error', () => {
      let _error: any
      beforeEach(() => {
        _error = console.error
        console.error = jest.fn()
      })
      afterEach(() => {
        console.error = _error
      })

      test('throws when I18nProvider is rendered without a controller', () => {
        expect(() => {
          render(
            // @ts-ignore
            <I18nProvider>
              <I18nText get="this_is_the_key">This is the default content.</I18nText>
            </I18nProvider>
          )
        }).toThrowError('I18nProvider must be given a controller which extends BaseI18nController')
      })
    })
  })

  describe('I18nController class', () => {
    test('should throw error when invalid args are given', () => {
      expect(() => new I18nController({ supportedLangs: [] })).toThrowError(
        'You must provide supported languages'
      )
      expect(() => new I18nController({ supportedLangs: ['en'] })).toThrowError(
        'You must provide a `lang` or `defaultLang`'
      )
      expect(() => new I18nController({ supportedLangs: ['en'], defaultLang: 'es' })).toThrowError(
        'The default language provided is not a supported language'
      )
    })

    test('_load() should throw when not overridden', () => {
      //@ts-ignore
      class BadI18nController extends BaseI18nController {}
      expect(
        (): BaseI18nController =>
          new BadI18nController({ defaultLang: 'en', supportedLangs: ['en'] })
      ).toThrowError('You must override the `_load` method')
    })

    test('can access translations outside React context', async () => {
      const defaults = new FluentResource(`
key_for_the_people = We are the people!
  .aria-label=anything { $value }
  .name=test
key-for-no-people = blah blah blue stew`)
      const controller = new I18nController({
        useIsolating: false,
        lang: 'en',
        supportedLangs: ['en', 'es'],
      })
      const getArgs = { section: 'test', id: 'key_for_the_people', args: { value: 'foo' } }
      const beforeLoad = controller.get(getArgs)
      expect(beforeLoad).toEqual(NOT_FOUND)
      await controller.loadAll({ section: 'test', lang: 'en', defaults })
      const afterLoad = controller.get(getArgs)
      expect(afterLoad).toEqual({
        text: 'We are the people!',
        found: true,
        attrs: { 'aria-label': 'anything foo', name: 'test' },
      })
      const noPeople = controller.getText({ section: 'test', id: 'key-for-no-people' })
      expect(noPeople).toBe('blah blah blue stew')
      const spanish = `key_for_the_people = Nosotros somos personas!`
      await controller.loadAll({ section: 'test', lang: 'es', content: spanish })
      const esResult = controller.get({ ...getArgs, lang: 'es' })
      expect(esResult).toEqual({ text: 'Nosotros somos personas!', attrs: {}, found: true })
      controller.setLang('es')
      // If there were a `defaultLang` set it'd fall back to that.
      const notFound = controller.get({ section: 'test', id: 'key-for-no-people' })
      expect(notFound).toEqual(NOT_FOUND)
    })

    test('can customize key formatting', async () => {
      class Controller extends I18nController {
        protected getKey(id: string, section?: string) {
          // This is how it used to behave by default.
          return section === 'global' ? id : `${section}__${id}`
        }
      }
      const controller = new Controller({ lang: 'en', supportedLangs: ['en'] })
      await controller.loadAll(
        { section: 'global', lang: 'en', content: 'key = global value' },
        { section: 'local', lang: 'en', content: 'key=unused\nlocal__key = local value' }
      )
      expect(controller.getText({ section: 'global', id: 'key' })).toBe('global value')
      expect(controller.getText({ section: 'local', id: 'key' })).toBe('local value')
    })

    test('defaults to use bidi isolating', async () => {
      const global = `for-all-to-see = You can't see why this fails { $foo }`
      const controller = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en', 'es'],
      })
      await controller.loadAll({ section: 'test', lang: 'en', content: global })
      const getArgs = { section: 'test', id: 'for-all-to-see', args: { foo: 'bar' } }
      expect(controller.getText(getArgs)).toBe(`You can't see why this fails \u2068bar\u2069`)
    })

    test('can disabled bidi isolating characters', async () => {
      const global = `for-all-to-see = No hidden characters here { $foo }`
      const controller = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en', 'es'],
        useIsolating: false,
      })
      await controller.loadAll({ section: 'test', lang: 'en', content: global })
      const getArgs = { section: 'test', id: 'for-all-to-see', args: { foo: 'bar' } }
      expect(controller.getText(getArgs)).toBe('No hidden characters here bar')
    })

    test('custom loader & onLoad in loadOpts', async () => {
      const controller = new I18nController({ lang: 'en', supportedLangs: ['en'] })
      // The custom onLoad will prevent this from being called.
      const willBeUnused = jest.fn()
      controller.addListener(willBeUnused)
      const onLoad = jest.fn(function (bundle: any, prevState: string) {
        // @ts-ignore
        expect(this).toBe(controller)
        expect(prevState).toBe('new')
      })
      const loader = jest.fn(function () {
        // @ts-ignore
        expect(this).toBe(controller)
        return Promise.resolve({ resources: [] })
      })
      controller.load({ section: 'loadOpts', lang: 'en', loader, onLoad })
      await Promise.resolve()
      expect(onLoad).toHaveBeenCalledTimes(1)
      expect(loader).toHaveBeenCalledTimes(1)
      expect(willBeUnused).not.toHaveBeenCalled()
    })

    test('should only attempt to load supported languages', async () => {
      const controller = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en', 'es'],
      })
      const mockLoad = jest.fn((() => Promise.resolve(undefined)) as Loader)
      const loadArgs = { lang: 'de-DE', section: 'test', loader: mockLoad }
      await controller.loadAll(loadArgs)
      expect(mockLoad).toBeCalledTimes(1)
      // It doesn't actually prevent load, it just falls back to the defaultLang.
      expect(mockLoad.mock.calls[0][0]?.section).toBe('test')
      expect(mockLoad.mock.calls[0][0]?.lang).toBe('en')
    })

    test('strict language negotiation raises errors', () => {
      const lang = 'de'
      const section = 'test'
      const error = 'Unsupported language: de'
      expect(() => new I18nController({ lang, supportedLangs: ['en'] })).toThrowError(error)
      const noDefault = new I18nController({ lang: 'en', supportedLangs: ['en'] })
      expect(() => noDefault.load({ lang, section })).toThrowError(error)
      expect(() => noDefault.setLang(lang)).toThrowError(error)
      expect(() => noDefault.get({ section, lang, id: 'test' })).toThrowError(error)
      // These two functions also indirectly use negotiation, but aren't strict.
      expect(noDefault.hasText({ section, lang, id: 'test' })).toBe(false)
      expect(noDefault.hasLoaded(section, lang)).toBe(false)
    })

    test('listeners run for appropriate events', async () => {
      const step = Promise.resolve()
      const controller = new I18nController({ lang: 'en', supportedLangs: ['en'] })
      const listenLoad = jest.fn()
      const listenAll = jest.fn()
      const listenError = jest.fn()
      controller.addListener(listenLoad)
      controller.addListener(listenAll, 'all')
      controller.addListener(listenError, 'error')
      const loader: Loader = jest.fn(() => Promise.reject('oh noes!'))
      const load = { section: 'loadTest', lang: 'en', loader }
      const bundle = controller.load(load)
      await step
      expect(listenLoad).not.toHaveBeenCalled()
      expect(listenAll).toHaveBeenLastCalledWith(bundle, 'new', 'oh noes!')
      expect(listenError).toHaveBeenLastCalledWith(bundle, 'new', 'oh noes!')
      load.loader = jest.fn(() => Promise.resolve({ resources: [] })) as Loader
      controller.load(load)
      await step
      expect(listenLoad).toHaveBeenLastCalledWith(bundle, 'error', undefined)
      expect(listenAll).toHaveBeenLastCalledWith(bundle, 'error', undefined)
      expect(listenError).toHaveBeenCalledTimes(1)
      controller.removeListener(listenLoad)
      controller.removeListener(listenAll)
      controller.removeListener(listenError)
      controller.load({ section: 'one', lang: 'en', loader: load.loader })
      await step
      expect(listenLoad).toHaveBeenCalledTimes(1)
      expect(listenAll).toHaveBeenCalledTimes(2)
      expect(listenError).toHaveBeenCalledTimes(1)
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

      test('get() should gracefully handle missing id', async () => {
        const global = `this_is_the_key = This should render`
        const i18nController = new I18nController({
          defaultLang: 'en',
          lang: 'es',
          supportedLangs: ['en', 'es'],
          debugMode: true,
        })
        await i18nController.loadAll({ section: 'global', lang: 'es', content: global })
        expect(i18nController.get({ section: 'global', id: 'bogogo' })).toEqual(NOT_FOUND)
        expect(console.warn).toHaveBeenCalledWith('Translation not found', {
          id: 'bogogo',
          lang: 'es',
          section: 'global',
        })
      })

      test('get() should gracefully handle missing section', () => {
        const i18nController = new I18nController({
          defaultLang: 'en',
          supportedLangs: ['en', 'es'],
          debugMode: true,
        })
        expect(i18nController.get({ section: 'foobar', id: 'bogogo' })).toEqual(NOT_FOUND)
        expect(console.warn).toHaveBeenCalledWith('Attempting to use unloaded section:', {
          lang: 'en',
          section: 'foobar',
        })
      })

      test('can check for existing messages', async () => {
        const global = `this_is_the_key = This should render`
        const i18nController = new I18nController({
          defaultLang: 'en',
          supportedLangs: ['en'],
          debugMode: true,
        })
        await i18nController.loadAll({ section: 'global', lang: 'en', content: global })
        expect(i18nController.hasText({ section: 'global', id: 'this_is_the_key' })).toEqual(true)
        expect(i18nController.hasText({ section: 'global', id: 'not' })).toEqual(false)
        expect(i18nController.hasText({ section: 'other', id: 'this_is_the_key' })).toEqual(false)
        expect(console.warn).toHaveBeenCalledWith('Attempting to use unloaded section:', {
          lang: 'en',
          section: 'other',
        })
      })

      test('keeps track of failed resources', async () => {
        const controller = new I18nController({ defaultLang: 'en', supportedLangs: ['en'] })
        //@ts-ignore
        controller._load = jest.fn(() => Promise.reject('oh noes!'))
        expect(controller.getLoadState('global', 'en')).toBe('new')
        await controller.loadAll({ section: 'global', lang: 'en' })
        expect(controller.getLoadState('global', 'en')).toBe('error')
      })
    })

    describe('with refs & dependent sections', () => {
      const step = Promise.resolve()
      const lang = 'en'

      class Controller extends BaseI18nController {
        constructor() {
          super({ lang, supportedLangs: [lang], useIsolating: false })
        }

        protected async _load(bi: BundleInfo, opts: LoadOpts): AsyncLoadResult {
          const resources = []
          if (bi.section === 'two') {
            resources.push(this.loadRef(bi, 'one', opts))
            resources.push(
              new FluentResource(`
original = The one and only
dependent = I need a {-blank}
override = You are group two
            `)
            )
          } else if (opts.success) {
            resources.push(
              new FluentResource(`
low = Can you go
override = I'm invisible
-blank = hero
            `)
            )
          } else {
            throw 'testing that reloading calls `markDirty`'
          }
          return { resources }
        }
      }

      test('section with ref loads referred section', async () => {
        const controller = new Controller()
        const loader = jest.fn(function (this: Controller, bi: BundleInfo, o: LoadOpts) {
          return this._load(bi, o)
        })
        controller.load({ section: 'two', lang, loader, success: true })
        expect(loader).toHaveBeenCalledTimes(2)
        expect(controller.getLoadState('one', lang)).toBe('loading')
        expect(controller.getLoadState('two', lang)).toBe('loading')
        await step
        expect(controller.getLoadState('one', lang)).toBe('loaded')
        expect(controller.getLoadState('two', lang)).toBe('loaded')
        expect(controller.getText({ section: 'two', id: 'original' })).toEqual('The one and only')
        expect(controller.getText({ section: 'two', id: 'dependent' })).toEqual('I need a hero')
        expect(controller.getText({ section: 'two', id: 'low' })).toEqual('Can you go')
        expect(controller.getText({ section: 'one', id: 'low' })).toEqual('Can you go')
        expect(controller.getText({ section: 'one', id: 'override' })).toEqual(`I'm invisible`)
        expect(controller.getText({ section: 'two', id: 'override' })).toEqual('You are group two')
      })

      test('reloading dependency causes section to recompile', async () => {
        const controller = new Controller()
        controller.load({ section: 'two', lang })
        await step
        expect(controller.getLoadState('one', lang)).toBe('error')
        expect(controller.getLoadState('two', lang)).toBe('loaded')
        expect(controller.getText({ section: 'two', id: 'original' })).toEqual('The one and only')
        expect(controller.getText({ section: 'two', id: 'dependent' })).toEqual('I need a {-blank}')
        expect(controller.getText({ section: 'two', id: 'override' })).toEqual('You are group two')
        expect(controller.get({ section: 'two', id: 'low' })).toEqual(NOT_FOUND)

        controller.load({ section: 'one', lang, success: true })
        await step
        expect(controller.getLoadState('one', lang)).toBe('loaded')
        expect(controller.getText({ section: 'two', id: 'dependent' })).toEqual('I need a hero')
        expect(controller.getText({ section: 'two', id: 'low' })).toEqual('Can you go')
        expect(controller.getText({ section: 'one', id: 'override' })).toEqual(`I'm invisible`)
      })

      test('section with loaded ref does not reload', async () => {
        const controller = new Controller()
        const loader = jest.fn(function (this: Controller, bi: BundleInfo, o: LoadOpts) {
          return this._load(bi, o)
        })
        controller.load({ section: 'one', lang, loader, success: true })
        expect(loader).toHaveBeenCalledTimes(1)
        await step
        controller.load({ section: 'two', lang, loader })
        expect(loader).toHaveBeenCalledTimes(2)
        await step

        expect(controller.getText({ section: 'two', id: 'dependent' })).toEqual('I need a hero')
        expect(controller.getText({ section: 'two', id: 'low' })).toEqual('Can you go')
        expect(controller.getText({ section: 'one', id: 'low' })).toEqual('Can you go')
        expect(controller.getText({ section: 'one', id: 'override' })).toEqual(`I'm invisible`)
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

    test('passed extra data to load()', async () => {
      const controller = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en', 'en-US'],
      })
      expect(controller.getLoadState('kleenex', 'en')).toBe('new')
      render(
        <I18nProvider controller={controller}>
          <I18nSection name="kleenex" content="runny-nose = This text should render">
            <I18nText get="runny-nose" />
          </I18nSection>
        </I18nProvider>
      )
      expect(controller.getLoadState('kleenex', 'en')).toBe('loading')
      const element = await screen.findByText('This text should render')
      expect(controller.getLoadState('kleenex', 'en')).toBe('loaded')
      expect(element).toBeInTheDocument()
    })

    describe('should override', () => {
      test('section name', async () => {
        const controller = new I18nController({
          defaultLang: 'en',
          supportedLangs: ['en', 'en-US'],
        })
        const resources = [new FluentResource('runny-nose = This text should render')]
        // @ts-ignore
        const mockLoad = (controller._load = jest.fn<Loader>(() => Promise.resolve({ resources })))
        render(
          <I18nProvider controller={controller} section="">
            <I18nSection name="kleenex" dynamic>
              <I18nText get="runny-nose" />
            </I18nSection>
          </I18nProvider>
        )
        expect(await screen.findByText('This text should render')).toBeInTheDocument()
        expect(mockLoad).toHaveBeenCalledTimes(1)
        expect(mockLoad.mock.calls[0][0]?.section).toBe('kleenex')
        expect(mockLoad.mock.calls[0][1]).toEqual({ dynamic: true })
      })

      test('language selection', async () => {
        const controller = new I18nController({
          defaultLang: 'en',
          supportedLangs: ['en', 'es'],
        })
        const content = `runny-nose = This text should render`
        await controller.loadAll({ section: 'global', lang: 'es', content })
        const { container } = render(
          <I18nProvider controller={controller}>
            <I18nSection name="global" lang="es">
              <I18nText get="runny-nose" />
            </I18nSection>
          </I18nProvider>
        )
        expect(container).toHaveTextContent('This text should render')
      })
    })

    test('will load extra dependencies with custom props', async () => {
      const controller = new I18nController({
        defaultLang: 'en',
        supportedLangs: ['en', 'en-US'],
      })
      const resources = [new FluentResource('runny-nose = This text should render')]
      //@ts-ignore
      const mockLoad = (controller._load = jest.fn<Loader>(({ section }) =>
        Promise.resolve(section === 'needed' ? { resources } : undefined)
      ))

      const i18nDependencies = [{ section: 'needed', extra: 'data', for: 'load function' }]
      render(
        <I18nProvider controller={controller} section="">
          <I18nSection name="kleenex" dependencies={i18nDependencies}>
            <I18nText get="runny-nose" section="needed" />
          </I18nSection>
        </I18nProvider>
      )
      expect(await screen.findByText('This text should render')).toBeInTheDocument()
      expect(mockLoad).toHaveBeenCalledTimes(2)
      expect(mockLoad.mock.calls[0][0]?.section).toBe('kleenex')
      expect(mockLoad.mock.calls[0][1]).toEqual({})
      expect(mockLoad.mock.calls[1][0]?.section).toBe('needed')
      expect(mockLoad.mock.calls[1][1]).toEqual({ extra: 'data', for: 'load function' })
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

    test('can render variables in a translation', async () => {
      const global = `key-for-the-group= We are the { $groupName }!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
      })
      await controller.loadAll({ section: 'global', lang: 'en-US', content: global })
      const { container } = render(
        <I18nProvider controller={controller}>
          <I18nText get="key-for-the-group" args={{ groupName: 'people' }} />
        </I18nProvider>
      )
      expect(container).toHaveTextContent('We are the \u2068people\u2069!')
    })

    test('can override section', async () => {
      const global = `key_for_the_people= We are the people!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
      })
      const content = `kleenex__key_for_the_people = We are NOT the people!`
      await controller.loadAll(
        { section: 'global', lang: 'en-US', content: global },
        { lang: 'en-US', section: 'kleenex', content }
      )
      const { container } = render(
        <I18nProvider controller={controller}>
          <I18nSection name="kleenex">
            <I18nText get="key_for_the_people" section="global" />
          </I18nSection>
        </I18nProvider>
      )
      expect(container).toHaveTextContent('We are the people!')
    })
  })

  describe('<I18nElement />', () => {
    test('can render get id when no context present', () => {
      const { container } = render(<I18nElement get="this_is_my_key" as="div" />)
      expect(container).toHaveTextContent('this_is_my_key')
    })

    test('can render variables in a translation', async () => {
      const global = `key-for-the-group= We are the { $groupName }!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
      })
      await controller.loadAll({ section: 'global', lang: 'en-US', content: global })
      const { container } = render(
        <I18nProvider controller={controller}>
          <I18nElement get="key-for-the-group" as="div" args={{ groupName: 'people' }} />
        </I18nProvider>
      )
      expect(container).toHaveTextContent('We are the \u2068people\u2069!')
    })

    test('can render an element with attributes', async () => {
      const global = `
key-for-the-group= We are the { $groupName }!
  .aria-label = { $groupName} run the world`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
      })
      await controller.loadAll({ section: 'global', lang: 'en-US', content: global })
      const { getByLabelText } = render(
        <I18nProvider controller={controller}>
          <I18nElement get="key-for-the-group" as="div" args={{ groupName: 'people' }} />
        </I18nProvider>
      )
      expect(getByLabelText('\u2068people\u2069 run the world')).not.toBeNull()
    })

    test('should pass additional props to rendered element', async () => {
      const global = `
key-for-the-group= We are the people!
  .aria-label = people run the world`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
      })
      await controller.loadAll({ section: 'global', lang: 'en-US', content: global })
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

  describe('<I18nResource />', () => {
    test('renders get key when message not found', () => {
      const { container } = render(
        <I18nResource get="this_is_my_key">
          {(message): React.ReactElement => <span>{message}</span>}
        </I18nResource>
      )
      expect(container).toHaveTextContent('this_is_my_key')
    })

    test('calls provided children as render prop', async () => {
      const global = `
key-for-the-group = We are the { $groupName }!
  .aria-label = { $groupName} run the world`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
      })
      await controller.loadAll({ section: 'global', lang: 'en-US', content: global })
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

    test('calls provided render prop', async () => {
      const global = `
key-for-the-group = We are the { $groupName }!
  .aria-label = { $groupName} run the world`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
      })
      await controller.loadAll({ section: 'global', lang: 'en-US', content: global })
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

  describe('<I18nFormatted />', () => {
    test('should handle additional formatting', async () => {
      const global = `key-for-the-group= We are the people!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
      })
      await controller.loadAll({ section: 'global', lang: 'en-US', content: global })
      const formatter = jest.fn((text: string): React.ReactElement => {
        return <div data-testid="hoobla">{text}</div>
      })
      const { getByTestId } = render(
        <I18nProvider controller={controller}>
          <I18nFormatted get="key-for-the-group" formatter={formatter} />
        </I18nProvider>
      )
      expect(getByTestId('hoobla')).toHaveTextContent('We are the people!')
    })
  })

  describe('useI18nText()', () => {
    test('returns fluent text', async () => {
      const global = `key-for-the-group= We are the people!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
      })
      await controller.loadAll({ section: 'global', lang: 'en-US', content: global })
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

    test('returns formatted fluent text with args', async () => {
      const global = `key-for-the-group= We are the { $groupName }!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
      })
      await controller.loadAll({ section: 'global', lang: 'en-US', content: global })
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

    test('allows overriding section for text', async () => {
      const global = `key-for-the-group= We are the { $groupName }!`
      const simple = `key-for-the-group = We are the simple people!`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
      })
      await controller.loadAll(
        { section: 'global', lang: 'en-US', content: global },
        { section: 'simple', lang: 'en-US', content: simple }
      )
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

  describe('useI18nResource()', () => {
    test('returns fluent text and attributes', async () => {
      const global = `
key-for-the-group= We are the people!
  .aria-label = people run the world`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
      })
      await controller.loadAll({ section: 'global', lang: 'en-US', content: global })
      const TestI18nResource = (): React.ReactElement => {
        const { text, attrs } = useI18nResource('key-for-the-group')
        return <div {...attrs}>{text}</div>
      }
      const { getByLabelText } = render(
        <I18nProvider controller={controller}>
          <TestI18nResource />
        </I18nProvider>
      )
      expect(getByLabelText('people run the world')).toHaveTextContent('We are the people!')
    })

    test('returns formatted text and attributes applying provided args', async () => {
      const global = `
key-for-the-group= We are the { $groupName }!
  .aria-label = people run the { $place }`
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
      })
      await controller.loadAll({ section: 'global', lang: 'en-US', content: global })
      const TestI18nResource = (): React.ReactElement => {
        const { text, attrs } = useI18nResource('key-for-the-group', {
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

    test('allows overriding section', async () => {
      const defaults = new FluentResource(`key-for-the-group= We are the people!`)
      const controller = new I18nController({
        defaultLang: 'en-US',
        supportedLangs: ['en-US'],
      })
      const content = 'key-for-the-group = We are the OTHER people!'
      await controller.loadAll(
        { section: 'global', lang: 'en-US', defaults },
        { section: 'other', lang: 'en-US', content }
      )
      const TestI18nResource = (): React.ReactElement => {
        const { text, attrs } = useI18nResource('key-for-the-group', undefined, 'other')
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
