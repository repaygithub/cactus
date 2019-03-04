import React from 'react'
import { BaseI18nController, I18nProvider } from './i18n/index'

interface AppRootProps {
  /**
   * Recieves an instance of BaseI18nController to enable translations using Text component
   */
  withI18n?: BaseI18nController

  /** The language currently selected to render */
  lang?: string
}

const AppRoot: React.FC<AppRootProps> = props => {
  return (
    <I18nProvider controller={props.withI18n} lang={props.lang}>
      <React.Fragment>{props.children}</React.Fragment>
    </I18nProvider>
  )
}

export default AppRoot
