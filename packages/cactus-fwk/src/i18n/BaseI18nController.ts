export interface KeyDictionary {
  [key: string]: string
}

interface Dictionary {
  [lang: string]: KeyDictionary
}

export interface LoadingState {
  [langSectionKey: string]: 'loading' | 'loaded' | 'failed' | undefined
}

interface LoadingStateListener {
  (params: LoadingState): void
}

interface I18nControllerOptions {
  /**
   * Initializes global section dictionary
   */
  global?: KeyDictionary

  /**
   * fallback language if key does not exist
   */
  defaultLang: string

  /** Set the current lang explicitly or uses provided default */
  lang?: string
}

const _dictionaries = new WeakMap<BaseI18nController, Dictionary>()

export default abstract class BaseI18nController {
  lang: string
  defaultLang: string
  _loadingState: LoadingState = {}
  _listeners: LoadingStateListener[] = []

  constructor(options: I18nControllerOptions) {
    this.defaultLang = options.defaultLang
    this.lang = options.lang || this.defaultLang
    _dictionaries.set(this, {})
    if (this.load === undefined) {
      throw new Error('You must override the `load` method!')
    }

    if (options.global === undefined) {
      this._load({ lang: this.defaultLang, section: 'global' })
    } else {
      this.setDict(this.defaultLang, 'global', options.global)
    }
  }

  abstract load({ lang, section }: { lang: string; section: string }): Promise<KeyDictionary>

  _getDict(): Dictionary {
    return _dictionaries.get(this) || {}
  }

  setDict(lang: string, section: string, dict: KeyDictionary) {
    const _dict = this._getDict()
    if (!_dict[lang]) {
      _dict[lang] = {}
    }
    for (const id in dict) {
      if (dict.hasOwnProperty(id)) {
        _dict[lang][`${section}/${id}`] = dict[id]
      }
    }
    this._loadingState[`${lang}/${section}`] = 'loaded'
  }

  setLang(lang: string) {
    this.lang = lang
  }

  get({
    lang = this.lang,
    section = 'global',
    id,
  }: {
    lang?: string
    section?: string
    id: string
  }): string {
    const _dict = this._getDict()
    const key = `${section}/${id}`
    if (_dict[lang] && _dict[lang][key]) {
      return _dict[lang][key]
    }
    // users should ensure the default lang has been loaded.
    return _dict[this.defaultLang][key]
  }

  _load(args: { lang: string; section: string }): void {
    const { lang, section } = args
    const loadingKey = `${lang}/${section}`
    if (this._loadingState[loadingKey] !== undefined) {
      return
    }

    this._loadingState[loadingKey] = 'loading'
    this.load(args)
      .then(dict => {
        this.setDict(lang, section, dict)
        const updatedLoadingState = { ...this._loadingState }
        this._listeners.forEach(l => l(updatedLoadingState))
      })
      .catch(() => {
        this._loadingState[loadingKey] = 'failed'
      })
  }

  addListener(listener: LoadingStateListener): void {
    this._listeners.push(listener)
    listener(this._loadingState)
  }

  removeListener(listener: LoadingStateListener): void {
    this._listeners = this._listeners.filter(l => l !== listener)
  }
}
