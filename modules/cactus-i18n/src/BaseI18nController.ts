import { FluentBundle, FluentResource } from '@fluent/bundle'
import { negotiateLanguages } from '@fluent/langneg'
import { ResourceDefinition } from './types'
import 'intl-pluralrules'

interface Dictionary {
  /**
   * Dictionary containing fluent bundles for each language with currently loaded sections
   */
  [lang: string]: FluentBundle
}

export interface LoadingState {
  [langSectionKey: string]: 'loading' | 'loaded' | 'failed' | undefined
}

interface LoadingStateListener {
  (params: LoadingState): void
}

/** matches .ftl format files for fluent parsing */
type FTL = string

interface I18nControllerOptions {
  /**
   * Should be an array of locale codes
   */
  supportedLangs: string[]

  /**
   * Initializes global section dictionary
   */
  global?: FTL

  /**
   * fallback language if key does not exist
   */
  defaultLang: string

  /** Set the current lang explicitly or uses provided default */
  lang?: string

  /** Flag for displaying error messages. Default is false */
  debugMode?: boolean

  /**
   * Flag to disable bidi isolating unicode characters.
   * @default = true
   */
  useIsolating?: boolean
}

const _dictionaries = new WeakMap<BaseI18nController, Dictionary>()

export default abstract class BaseI18nController {
  lang: string = ''
  defaultLang: string
  _supportedLangs: string[]
  _languages: string[] = []
  _loadingState: LoadingState = {}
  _listeners: LoadingStateListener[] = []
  _debugMode: boolean

  constructor(options: I18nControllerOptions) {
    if (!Array.isArray(options.supportedLangs) || options.supportedLangs.length === 0) {
      throw new Error('You must provide supported languages')
    }
    if (this.load === undefined) {
      throw new Error('You must override the `load` method')
    }
    if (!options.defaultLang) {
      throw new Error('You must provide a default language')
    }
    if (!options.supportedLangs.includes(options.defaultLang)) {
      throw new Error('The default language provided is not a supported language')
    }

    const useIsolating = options.hasOwnProperty('useIsolating')
      ? Boolean(options.useIsolating)
      : true
    this._supportedLangs = options.supportedLangs
    this.defaultLang = options.defaultLang
    this.setLang(options.lang || this.defaultLang)
    const bundles = this._supportedLangs.reduce(
      (memo, lang) => {
        memo[lang] = new FluentBundle(lang, { useIsolating })
        return memo
      },
      {} as Dictionary
    )
    _dictionaries.set(this, bundles)
    this._debugMode = Boolean(options.debugMode)

    if (options.global === undefined) {
      this._load({ lang: this.defaultLang, section: 'global' })
    } else {
      this.setDict(this.defaultLang, 'global', options.global)
    }
  }

  abstract load(
    { lang, section }: { lang: string; section: string },
    extra: { [key: string]: any }
  ): Promise<ResourceDefinition[]>

  _getDict(): Dictionary {
    return _dictionaries.get(this) || {}
  }

  setDict(lang: string, section: string, ftl: FTL) {
    if (this._debugMode && !this._languages.includes(lang)) {
      console.warn(
        `You are loading an unrequested translation ${lang} for section: ${section} which will not be used. ` +
          `Ignore this message if you have just updated the requested language.`
      )
    }
    const bundle = this._getDict()[lang]
    if (this._debugMode && !bundle) {
      console.error(
        `Attempting to set dictionary for unsupported language: ${lang} and section: ${section}`
      )
      return
    }
    const errors = bundle.addResource(new FluentResource(ftl))
    if (this._debugMode && Array.isArray(errors) && errors.length) {
      console.error(`Errors found in resource for section ${section} ${lang}`)
      console.log(errors)
    }
    this._loadingState[`${section}/${lang}`] = 'loaded'
  }

  private negotiateLang(lang: string) {
    return negotiateLanguages([lang], this._supportedLangs, {
      defaultLocale: this.defaultLang,
      strategy: 'matching',
    })
  }

  setLang(lang: string) {
    this._languages = this.negotiateLang(lang)
    this.lang = this._languages[0]
  }

  get({
    args,
    section = 'global',
    id,
    lang: overrideLang = this.lang,
  }: {
    args?: object
    section?: string
    id: string
    lang?: string
  }): [(string | null), object] {
    const bundles = this._getDict()
    const key = section === 'global' ? id : `${section}__${id}`
    if (bundles !== undefined) {
      let languages = this._languages
      if (typeof overrideLang === 'string') {
        languages = this.negotiateLang(overrideLang)
      }
      const lang = languages.find(l => bundles[l] && bundles[l].hasMessage(key))
      const bundle = lang && bundles[lang]
      if (!bundle) {
        if (
          this._debugMode &&
          (section !== 'global' || this._loadingState[`global/${this.defaultLang}`] === 'loaded')
        ) {
          console.warn(
            `The requested message ${key} does not exist` +
              ` in these translations: ${this._languages.join(', ')}`
          )
        }
        return [null, {}]
      }
      const message = bundle.getMessage(key)
      let text: string | null = null
      let attrs: { [key: string]: string } = {}
      let errors: any[] = []
      if (message.attributes) {
        Object.entries(message.attributes).forEach(([attr, value]) => {
          attrs[attr] = bundle.formatPattern(value, args || {}, errors)
        })
      }
      if (message.value) {
        text = bundle.formatPattern(message.value, args || {}, errors)
      }
      if (errors.length) {
        return [null, {}]
      }
      return [text, attrs]
    }
    if (
      this._debugMode &&
      (section !== 'global' || this._loadingState[`global/${this.defaultLang}`] === 'loaded')
    ) {
      console.warn(`The requested section ${section} does not exist when requesting id ${id}`)
    }
    return [null, {}]
  }

  getText({
    args,
    section = 'global',
    id,
    lang,
  }: {
    args?: object
    section?: string
    id: string
    lang?: string
  }): string | null {
    const [message] = this.get({ args, section, id, lang })
    return message
  }

  _load(
    { lang: requestedLang, section }: { lang: string; section: string },
    extra: { [key: string]: any } = {}
  ): void {
    const [lang] = this.negotiateLang(requestedLang)
    const loadingKey = `${section}/${lang}`
    if (this._loadingState[loadingKey] !== undefined) {
      return
    }

    this._loadingState[loadingKey] = 'loading'
    this.load({ lang, section }, extra)
      .then(resourceDefs => {
        resourceDefs.forEach(resDef => {
          this.setDict(resDef.lang, section, resDef.ftl)
        })
        const updatedLoadingState = { ...this._loadingState }
        this._listeners.forEach(l => l(updatedLoadingState))
      })
      .catch(error => {
        this._loadingState[loadingKey] = 'failed'
        if (this._debugMode) {
          console.error(`FTL Resource ${lang}/${section} failed to load:`, error)
        }
      })
  }

  hasText({
    section = 'global',
    id,
    lang,
  }: {
    section?: string
    id: string
    lang?: string
  }): boolean {
    const key = section === 'global' ? id : `${section}__${id}`
    const bundles = this._getDict()
    let languages = this._languages
    if (typeof lang === 'string') {
      languages = this.negotiateLang(lang)
    }
    return languages.some(l => bundles[l] && bundles[l].hasMessage(key))
  }

  hasLoaded(section: string, lang?: string) {
    let languages = this._languages
    if (lang !== undefined) {
      languages = this.negotiateLang(lang)
    }
    return languages.some(l => this._loadingState[`${section}/${l}`] === 'loaded')
  }

  addListener(listener: LoadingStateListener): void {
    this._listeners.push(listener)
    listener(this._loadingState)
  }

  removeListener(listener: LoadingStateListener): void {
    this._listeners = this._listeners.filter(l => l !== listener)
  }
}
