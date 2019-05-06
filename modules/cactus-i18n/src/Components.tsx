import React, {
  ComponentProps,
  JSXElementConstructor,
  useContext,
  useEffect,
  useState,
} from 'react'

import BaseI18nController, { LoadingState } from './BaseI18nController'

export interface I18nContextType {
  controller: BaseI18nController
  section: string
  lang: string
  loadingState: LoadingState
}

const I18nContext = React.createContext<I18nContextType | null>(null)

const useI18nText = (id: string, args?: object, sectionOverride?: string) => {
  const context = useContext(I18nContext)
  if (context === null) {
    return null
  }
  const { controller, section } = context
  return controller.getText({ args, section: sectionOverride || section, id })
}

const useI18nResource = (id: string, args?: object, sectionOverride?: string) => {
  const context = useContext(I18nContext)
  if (context === null) {
    return [null, {}]
  }
  const { controller, section } = context
  return controller.get({ args, section: sectionOverride || section, id })
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
  controller: BaseI18nController
  lang?: string
}

const I18nProvider: React.FC<I18nProviderProps> = props => {
  const controller = props.controller
  if (!(controller instanceof BaseI18nController)) {
    throw Error('I18nProvider must be given a controller which extends BaseI18nController')
  }
  const lang = props.lang || navigator.language
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
    controller.setLang(lang)
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
  // wait to render until section is loaded
  // TODO display loading component after X ms not loaded
  // TODO display error when all sections have failed to load
  if (sectionContext !== null && !sectionContext.controller.hasLoaded(props.name)) {
    return null
  }
  return (
    <I18nContext.Provider value={sectionContext}>
      <React.Fragment>{props.children}</React.Fragment>
    </I18nContext.Provider>
  )
}

interface I18nTextProps {
  get: string
  args?: object
  section?: string
}

const I18nText: React.FC<I18nTextProps> = props => {
  const text = useI18nText(props.get, props.args, props.section)
  return <React.Fragment>{text || props.children || props.get}</React.Fragment>
}

type TagNameOrReactComp = keyof JSX.IntrinsicElements | JSXElementConstructor<any>

type I18nElementProps<Elem extends TagNameOrReactComp> = {
  as: Elem
} & Partial<ComponentProps<Elem>> &
  I18nTextProps

const I18nElement = function<Elem extends TagNameOrReactComp>(props: I18nElementProps<Elem>) {
  const { get, args = {}, section, as, ...rest } = props
  const [message, attrs] = useI18nResource(get, args, section)
  const elemProps = { ...rest, ...attrs }
  return React.createElement(as, elemProps, message || get)
}

interface I18nFormattedProps extends I18nTextProps {
  formatter: (message: string) => React.ReactNode
}

const I18nFormatted: React.FC<I18nFormattedProps> = props => {
  const text = useI18nText(props.get, props.args, props.section)
  return <React.Fragment>{text !== null ? props.formatter(text) : props.get}</React.Fragment>
}

export {
  I18nProvider,
  I18nSection,
  I18nElement,
  I18nFormatted,
  I18nText,
  useI18nText,
  useI18nResource,
}
