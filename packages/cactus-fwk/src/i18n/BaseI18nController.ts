import { ResourceDefinition } from '../types'
import { FluentBundle, FluentResource } from 'fluent'
import { negotiateLanguages } from 'fluent-langneg'

const __DEV__ = process.env.NODE_ENV !== 'production'

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

    this._supportedLangs = options.supportedLangs
    this.defaultLang = options.defaultLang
    this.setLang(options.lang || this.defaultLang)
    _dictionaries.set(this, { global: {} })

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
    if (!this._languages.includes(lang) && __DEV__) {
      console.warn(
        `You are loading an unrequested translation ${lang} for section: ${section} which will not be used. ` +
          `Ignore this message if you have just updated the requested language.`
      )
    }
    const bundle = new FluentBundle(lang)
    bundle.addMessages(ftl)
    const _dict = this._getDict()
    if (!_dict[section]) {
      _dict[section] = {}
    }
    _dict[section][lang] = bundle

    this._loadingState[`${section}/${lang}`] = 'loaded'
  }

  setLang(lang: string) {
    this._languages = negotiateLanguages([lang], this._supportedLangs, {
      defaultLocale: this.defaultLang,
      strategy: 'matching',
    })
    this.lang = this._languages[0]
  }

  get({
    args,
    section = 'global',
    id,
  }: {
    args?: object
    section?: string
    id: string
  }): string | null {
    const _dict = this._getDict()
    const bundles = _dict[section]
    if (bundles !== undefined) {
      const lang = this._languages.find(l => bundles[l] && bundles[l].hasMessage(id))
      const bundle = lang && bundles[lang]
      if (!bundle) {
        if (__DEV__) {
          console.warn(
            `The requested id ${id} for section ${section} does not exist` +
              ` in these translations: ${this._languages.join(', ')}`
          )
        }
        return null
      }
      const message = bundle.getMessage(id)
      return bundle.format(message, args)
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
        if (__DEV__) {
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
