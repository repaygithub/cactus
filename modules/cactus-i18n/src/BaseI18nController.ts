import { FluentBundle } from 'fluent'
import { FluentMessage, FluentNode } from 'fluent'
import { negotiateLanguages } from 'fluent-langneg'
import { ResourceDefinition } from './types'

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

  /** Flag for displaying error messages. Default is false */
  debugMode?: boolean
}

const _dictionaries = new WeakMap<BaseI18nController, Dictionary>()

function isFluentNode(message: FluentMessage): message is FluentNode {
  return typeof message !== 'string' && !Array.isArray(message)
}

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

    this._supportedLangs = options.supportedLangs
    this.defaultLang = options.defaultLang
    this.setLang(options.lang || this.defaultLang)
    _dictionaries.set(this, { global: {} })
    this._debugMode = Boolean(options.debugMode)

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
    if (this._debugMode && !this._languages.includes(lang)) {
      console.warn(
        `You are loading an unrequested translation ${lang} for section: ${section} which will not be used. ` +
          `Ignore this message if you have just updated the requested language.`
      )
    }
    const bundle = new FluentBundle(lang)
    const errors = bundle.addMessages(ftl)
    if (Array.isArray(errors) && errors.length) {
      console.error(`Errors found in resource for section ${section} ${lang}`)
      console.log(errors)
    }
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
  }): [(string | null), object] {
    const _dict = this._getDict()
    const bundles = _dict[section]
    if (bundles !== undefined) {
      const lang = this._languages.find(l => bundles[l] && bundles[l].hasMessage(id))
      const bundle = lang && bundles[lang]
      if (!bundle) {
        if (
          this._debugMode &&
          (section !== 'global' || this._loadingState[`global/${this.defaultLang}`] === 'loaded')
        ) {
          console.warn(
            `The requested id ${id} for section ${section} does not exist` +
              ` in these translations: ${this._languages.join(', ')}`
          )
        }
        return [null, {}]
      }
      const message = bundle.getMessage(id)
      const attrs: { [key: string]: string } = {}
      if (isFluentNode(message) && message.attrs !== null) {
        Object.entries(message.attrs).forEach(([attr, value]) => {
          attrs[attr] = bundle.format(value, args)
        })
      }
      let text = bundle.format(message, args)
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
  }: {
    args?: object
    section?: string
    id: string
  }): string | null {
    const [message] = this.get({ args, section, id })
    return message
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
        if (this._debugMode) {
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
