import React, { useEffect, useState, useContext } from 'react'
import BaseI18nController, { LoadingState, KeyDictionary } from './BaseI18nController'

export interface I18nContextType {
  controller: BaseI18nController
  section: string
  lang: string
  loadingState: LoadingState
}

const I18nContext = React.createContext<I18nContextType | null>(null)

const useI18nText = (id: string, sectionOverride?: string) => {
  const context = useContext(I18nContext)
  if (context === null) {
    return null
  }
  const { controller, lang, section } = context
  return controller.get({ lang, section: sectionOverride || section, id })
}

const useI18nContext = (section?: string) => {
  const context = useContext(I18nContext)
  if (context === null) {
    return null
  }
  const newContext = { ...context }
  if (section) {
    newContext.section = section
  }
  return newContext
}

interface I18nProviderProps {
  controller?: BaseI18nController
  lang?: string
}

const I18nProvider: React.FC<I18nProviderProps> = props => {
  const controller = props.controller
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

interface I18nSectionProps {
  name: string
}

const I18nSection: React.FC<I18nSectionProps> = props => {
  const sectionContext = useI18nContext(props.name)
  useEffect(() => {
    if (sectionContext !== null) {
      const { lang, section } = sectionContext
      sectionContext.controller._load({ lang, section })
    }
  })
  return (
    <I18nContext.Provider value={sectionContext}>
      <React.Fragment>{props.children}</React.Fragment>
    </I18nContext.Provider>
  )
}

interface I18nTextProps {
  get: string
  section?: string
}

const I18nText: React.FC<I18nTextProps> = props => {
  const text = useI18nText(props.get, props.section)
  return <React.Fragment>{text || props.children || props.get}</React.Fragment>
}

export { BaseI18nController, KeyDictionary, I18nProvider, I18nSection, I18nText }
