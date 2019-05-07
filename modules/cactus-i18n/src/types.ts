import BaseI18nController, { LoadingState } from './BaseI18nController'

export interface ResourceDefinition {
  lang: string
  /**
   * FTL message resource
   */
  ftl: string
}

export interface I18nContextType {
  controller: BaseI18nController
  section: string
  lang: string
  loadingState: LoadingState
}
