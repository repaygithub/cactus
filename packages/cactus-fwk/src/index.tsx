import * as React from 'react'

interface IdDictionary {
  [key: string]: string
}

interface I18nControllerOptions {
  /**
   * Initializes global section dictionary
   */
  global?: IdDictionary

  /**
   * fallback language if key does not exist
   */
  defaultLang: string
}

interface Dictionary {
  [lang: string]: IdDictionary
}

function prefixIds(section: string, dict: IdDictionary = {}): IdDictionary {
  let prefixedDict: IdDictionary = {}
  for (const id in dict) {
    if (dict.hasOwnProperty(id)) {
      prefixedDict[`${section}/${id}`] = dict[id]
    }
  }
  return prefixedDict
}

class I18nController {
  _dict: Dictionary = {}
  defaultLang: string
  constructor(options: I18nControllerOptions) {
    this.defaultLang = options.defaultLang
    this._dict = {
      [options.defaultLang]: prefixIds('global', options.global),
    }
  }

  get({ lang, section, id }: { lang: string; section: string; id: string }): string {
    const key = `${section}/${id}`
    if (this._dict[lang] && this._dict[lang][key]) {
      return this._dict[lang][key]
    }
    return this._dict[this.defaultLang][key]
  }
}

interface I18nContextType {
  controller: I18nController
  section: string
  lang: string
}

const I18nContext = React.createContext<I18nContextType | null>(null)
const useI18nText = (id: string) => {
  const context = React.useContext(I18nContext)
  if (context === null) {
    return null
  }
  const { controller, lang, section } = context
  return controller.get({ lang, section, id })
}

interface TextProps {
  get: string
}

const Text: React.FC<TextProps> = props => {
  const text = useI18nText(props.get)
  return <>{text || props.children || props.get}</>
}

interface AppRootProps {
  /**
   * Recieves an instance of I18nController to enable translations using Text component
   */
  withI18n?: I18nController

  /** The language currently selected to render */
  lang?: string
}

const AppRoot: React.FC<AppRootProps> = props => {
  const i18nContext: I18nContextType | null =
    props.withI18n instanceof I18nController && typeof props.lang === 'string'
      ? { controller: props.withI18n, lang: props.lang, section: 'global' }
      : null
  return (
    <I18nContext.Provider value={i18nContext}>
      <>{props.children}</>
    </I18nContext.Provider>
  )
}

export default AppRoot
export { Text, I18nController }
