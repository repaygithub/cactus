import { ResourceDefinition } from '../types'
import { FluentBundle, FluentResource } from 'fluent'
import { negotiateLanguages } from 'fluent-langneg'

interface Dictionary {
  /**
   * Dictionary containing fluent bundles for each section
   */
  [section: string]: { [lang: string]: FluentBundle }
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
}

const _dictionaries = new WeakMap<BaseI18nController, Dictionary>()

export default abstract class BaseI18nController {
  lang: string = ''
  defaultLang: string
  _supportedLangs: string[]
  _languages: string[] = []
  _loadingState: LoadingState = {}
  _listeners: LoadingStateListener[] = []

  constructor(options: I18nControllerOptions) {
    if (!Array.isArray(options.supportedLangs) || options.supportedLangs.length === 0) {
      throw new Error('You must provide supported languages!')
    }
    this._supportedLangs = options.supportedLangs
    this.defaultLang = options.defaultLang
    this.setLang(options.lang || this.defaultLang)
    _dictionaries.set(this, { global: {} })
    if (this.load === undefined) {
      throw new Error('You must override the `load` method!')
    }

    if (options.global === undefined) {
      this._load({ lang: this.defaultLang, section: 'global' })
    } else {
      this.setDict(this.defaultLang, 'global', options.global)
    }
  }

  abstract load({ lang, section }: { lang: string; section: string }): Promise<ResourceDefinition[]>

  _getDict(): Dictionary {
    return _dictionaries.get(this) || {}
  }

  setDict(lang: string, section: string, ftl: FTL) {
    if (!this._languages.includes(lang)) {
      // TODO do something about loading unrequested languages
    }
    const bundle = new FluentBundle(lang)
    bundle.addMessages(ftl)
    // TODO add scoped global bundle
    const _dict = this._getDict()
    if (!_dict[section]) {
      _dict[section] = {}
    }
    _dict[section][lang] = bundle

    this._loadingState[`${section}/${lang}`] = 'loaded'
  }

  setLang(lang: string) {
    this.lang = lang
    this._languages = negotiateLanguages([this.lang], this._supportedLangs, {
      defaultLocale: this.defaultLang,
      strategy: 'matching',
    })
  }

  get({ section = 'global', id }: { section?: string; id: string }): string | null {
    const _dict = this._getDict()
    const bundles = _dict[section]
    if (bundles !== undefined) {
      const lang = this._languages.find(l => bundles[l] && bundles[l].hasMessage(id))
      const bundle = lang && bundles[lang]
      if (!bundle) {
        // TODO: handle bundle with id not found
        return null
      }
      const message = bundle.getMessage(id)
      return bundle.format(message, {}, [])
    }
    return null
  }

  _load(args: { lang: string; section: string }): void {
    const { lang, section } = args
    const loadingKey = `${section}/${lang}`
    if (this._loadingState[loadingKey] !== undefined) {
      return
    }

    this._loadingState[loadingKey] = 'loading'
    this.load(args)
      .then(resourceDefs => {
        resourceDefs.forEach(resDef => {
          this.setDict(resDef.lang, section, resDef.ftl)
        })
        const updatedLoadingState = { ...this._loadingState }
        this._listeners.forEach(l => l(updatedLoadingState))
      })
      .catch(error => {
        this._loadingState[loadingKey] = 'failed'
        if (process.env.NODE_ENV !== 'production') {
          console.error(`FTL Resource ${lang}/${section} failed to load:`, error)
        }
      })
  }

  hasLoaded(section: string) {
    return this._languages.some(l => this._loadingState[`${section}/${l}`] === 'loaded')
  }

  addListener(listener: LoadingStateListener): void {
    this._listeners.push(listener)
    listener(this._loadingState)
  }

  removeListener(listener: LoadingStateListener): void {
    this._listeners = this._listeners.filter(l => l !== listener)
  }
}
