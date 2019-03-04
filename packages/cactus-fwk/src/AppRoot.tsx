import React, { useState, useEffect } from 'react'
import { BaseI18nController, I18nContextType, I18nContext } from './i18n/index'

interface AppRootProps {
  /**
   * Recieves an instance of BaseI18nController to enable translations using Text component
   */
  withI18n?: BaseI18nController

  /** The language currently selected to render */
  lang?: string
}

const AppRoot: React.FC<AppRootProps> = props => {
  const controller = props.withI18n
  const lang = props.lang || navigator.language.split('-')[0]
  let i18nContext: I18nContextType | null = null
  let [loadingState, setLoading] = useState({})
  useEffect(() => {
    if (controller instanceof BaseI18nController) {
      controller.addListener(setLoading)
      return () => controller.removeListener(setLoading)
    }
  }, [controller])
  useEffect(() => {
    if (controller instanceof BaseI18nController) {
      controller._load({ lang, section: 'global' })
    }
  }, [controller, lang])
  if (controller instanceof BaseI18nController) {
    i18nContext = {
      controller: controller,
      lang,
      section: 'global',
      loadingState,
    }
  }
  return (
    <I18nContext.Provider value={i18nContext}>
      <React.Fragment>{props.children}</React.Fragment>
    </I18nContext.Provider>
  )
}

export default AppRoot
