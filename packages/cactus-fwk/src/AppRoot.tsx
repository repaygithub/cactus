import React from 'react'
import { I18nController, I18nContextType, I18nContext } from './i18n/index'

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
