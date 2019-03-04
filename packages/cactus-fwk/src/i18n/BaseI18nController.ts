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

function prefixIds(section: string, dict: KeyDictionary = {}): KeyDictionary {
  let prefixedDict: KeyDictionary = {}
  for (const id in dict) {
    if (dict.hasOwnProperty(id)) {
      prefixedDict[`${section}/${id}`] = dict[id]
    }
  }
  return prefixedDict
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
}

export default abstract class BaseI18nController {
  _dict: Dictionary = {}
  defaultLang: string
  _loadingState: LoadingState = {}
  _listeners: LoadingStateListener[] = []

  constructor(options: I18nControllerOptions) {
    this.defaultLang = options.defaultLang
    if (this.load === undefined) {
      throw new Error('You must override the `load` method!')
    }

    if (options.global === undefined) {
      this._load({ lang: this.defaultLang, section: 'global' })
    } else {
      this._setDict(this.defaultLang, 'global', options.global)
    }
  }

  abstract load({ lang, section }: { lang: string; section: string }): Promise<KeyDictionary>

  _setDict(lang: string, section: string, dict: KeyDictionary) {
    this._dict[lang] = prefixIds(section, dict)
    this._loadingState[`${lang}/${section}`] = 'loaded'
  }

  get({
    lang = this.defaultLang,
    section,
    id,
  }: {
    lang?: string
    section: string
    id: string
  }): string {
    const key = `${section}/${id}`
    if (this._dict[lang] && this._dict[lang][key]) {
      return this._dict[lang][key]
    }
    return this._dict[this.defaultLang][key]
  }

  _load(args: { lang: string; section: string }): void {
    const { lang, section } = args
    const loadingKey = `${lang}/${section}`
    if (this._loadingState[loadingKey] !== undefined) {
      return
    }

    this._loadingState[loadingKey] = 'loading'
    this.load(args).then(dict => {
      this._dict[lang] = prefixIds(section, dict)
      this._loadingState[loadingKey] = 'loaded'
      const updatedLoadingState = { ...this._loadingState }
      this._listeners.forEach(l => l(updatedLoadingState))
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
