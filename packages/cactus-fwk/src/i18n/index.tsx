import React from 'react'

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

export interface I18nContextType {
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

export { Text, I18nController, I18nContext }
