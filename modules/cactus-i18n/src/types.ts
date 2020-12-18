// Workaround for an issue with rollup/re-exporting types.
import BaseI18nController, {
  AsyncLoadResult as $AsyncLoadResult,
  BundleInfo,
  I18nMessage as $I18nMessage,
  Loader as $Loader,
  LoadEventHandler as $LoadEventHandler,
  LoadEventType as $LoadEventType,
  LoadOpts as $LoadOpts,
  LoadResult as $LoadResult,
  LoadState as $LoadState,
  Resource as $Resource,
} from './BaseI18nController'

export { BundleInfo }

export interface I18nContextType {
  controller: BaseI18nController
  section: string
  lang: string
}

export type AsyncLoadResult = $AsyncLoadResult
export type I18nMessage = $I18nMessage
export type LoadEventHandler = $LoadEventHandler
export type LoadEventType = $LoadEventType
export type LoadOpts = $LoadOpts
export type LoadResult = $LoadResult
export type LoadState = $LoadState
export type Loader = $Loader
export type Resource = $Resource
