import 'intl'
import 'intl/locale-data/jsonp/en.js'
import 'intl/locale-data/jsonp/es.js'
import 'intl-pluralrules' // eslint-disable-line simple-import-sort/sort

import { FluentBundle, FluentFunction, FluentResource, FluentVariable } from '@fluent/bundle'
import { negotiateLanguages } from '@fluent/langneg'
import lodashSet from 'lodash/set'

interface HasI18nArgs {
  section: string
  id: string
  lang?: string
}

type SplitFunc = (key: string) => string | string[]
interface GetI18nArgs extends HasI18nArgs {
  args?: Record<string, FluentVariable>
  mapAttrs?: string | RegExp | SplitFunc
}

export interface I18nMessage {
  text: string | null
  attrs: Record<string, any>
  found: boolean
}

export type LoadState = 'new' | 'loading' | 'loaded' | 'error'
export type LoadEventType = 'loaded' | 'error' | 'all'
export type LoadEventHandler = (b: BundleInfo, prevState: LoadState, error?: any) => void

interface LoadEventListener {
  listener: LoadEventHandler
  eventType: LoadEventType
}

export type Loader = (
  this: BaseI18nController,
  bundleInfo: BundleInfo,
  loadOpts: LoadOpts
) => AsyncLoadResult

export interface LoadOpts extends Record<string, any> {
  loader?: Loader
  /** Call this instead of running through the list of global listeners. */
  onLoad?: LoadEventHandler
  // This is for hard-coded defaults, mostly intended for use by 3rd party libraries.
  defaults?: FluentResource
}

export interface LoadResult {
  resources: Resource[]
  version?: number
}

export type AsyncLoadResult = Promise<LoadResult | undefined>

export type Resource = BundleInfo | FluentResource

interface BundleOpts {
  /**
   * Flag to disable bidi isolating unicode characters.
   * @default = true
   */
  useIsolating: boolean

  /** Custom functions for Fluent to use during interpolation */
  functions: Record<string, FluentFunction>
}

interface I18nControllerOptions extends Partial<BundleOpts> {
  /**
   * Should be an array of locale codes
   */
  supportedLangs: string[]

  /**
   * fallback language if key does not exist
   */
  defaultLang?: string

  /** Set the current lang explicitly or uses provided default */
  lang?: string

  /** Flag for displaying error messages. Default is false */
  debugMode?: boolean
}

export default abstract class BaseI18nController {
  public lang = ''
  public defaultLang: string | undefined = undefined
  private _supportedLangs: string[]
  private _languages: string[] = []
  private _listeners: LoadEventListener[] = []
  private _bundles: Record<string, BundleInfo> = {}
  private _debugMode: boolean
  private _bundleOpts: BundleOpts

  public constructor({ functions = {}, ...options }: I18nControllerOptions) {
    if (!Array.isArray(options.supportedLangs) || options.supportedLangs.length === 0) {
      throw new Error('You must provide supported languages')
    } else if (options.defaultLang) {
      if (!options.supportedLangs.includes(options.defaultLang)) {
        throw new Error('The default language provided is not a supported language')
      }
      this.defaultLang = options.defaultLang
    } else if (!options.lang) {
      throw new Error('You must provide a `lang` or `defaultLang`')
    }
    if (this.load === undefined) {
      throw new Error('You must override the `load` method')
    }

    this._supportedLangs = options.supportedLangs
    this.setLang(options.lang || (options.defaultLang as string))
    this._debugMode = !!options.debugMode
    const useIsolating = options.useIsolating === undefined ? true : !!options.useIsolating
    this._bundleOpts = { useIsolating, functions }
  }

  protected abstract load(b: BundleInfo, l: LoadOpts): AsyncLoadResult

  protected _log(levelOrArg: string, ...args: any[]): void {
    if (this._debugMode) {
      if (console.hasOwnProperty(levelOrArg)) {
        // @ts-ignore
        console[levelOrArg](...args)
      } else {
        console.log(levelOrArg, ...args)
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getKey(id: string, section?: string, lang?: string): string {
    return id
  }

  protected negotiateLang(lang?: string, strict = false): string[] {
    if (lang === undefined) {
      return this._languages
    }
    const langs = negotiateLanguages([lang], this._supportedLangs, {
      defaultLocale: this.defaultLang,
      strategy: 'matching',
    })
    if (strict && !langs.length) {
      throw new Error(`Unsupported language: ${lang}`)
    }
    return langs
  }

  public setLang(lang: string): void {
    this._languages = this.negotiateLang(lang, true)
    this.lang = this._languages[0]
  }

  public get({
    args,
    section,
    id,
    lang: overrideLang = this.lang,
    mapAttrs,
  }: GetI18nArgs): I18nMessage {
    const langs = this.negotiateLang(overrideLang, true)
    const result: I18nMessage = { text: null, attrs: {}, found: false }
    for (const lang of langs) {
      const bundle = this.getBundle(section, lang)
      if (bundle) {
        const message = bundle.getMessage(this.getKey(id, section, lang))
        if (message) {
          result.found = true
          const { value, attributes } = message
          const errors: any[] = []
          if (value) {
            result.text = bundle.formatPattern(value, args, errors)
          }
          if (attributes) {
            for (const [attr, val] of Object.entries(attributes)) {
              const key =
                typeof mapAttrs === 'function'
                  ? mapAttrs(attr)
                  : mapAttrs
                  ? attr.split(mapAttrs)
                  : attr
              lodashSet(result.attrs, key, bundle.formatPattern(val, args, errors))
            }
          }
          if (errors.length) {
            this._log('warn', 'Errors while formatting translation', { id, section, lang, errors })
          }
          break
        } else {
          this._log('warn', 'Translation not found', { id, section, lang })
        }
      }
    }
    return result
  }

  public getText(args: GetI18nArgs): I18nMessage['text'] {
    return this.get(args).text
  }

  public hasText({ section, id, lang }: HasI18nArgs): boolean {
    lang = this.negotiateLang(lang)[0]
    const bundle = lang && this.getBundle(section, lang)
    return bundle ? bundle.hasMessage(this.getKey(id, section, lang)) : false
  }

  public _load(
    { lang: requestedLang, section }: { lang: string; section: string },
    loadOpts: LoadOpts = {}
  ): BundleInfo {
    const lang = this.negotiateLang(requestedLang, true)[0]
    const bundleInfo = this.getBundleInfo(section, lang, true) as BundleInfo
    if (bundleInfo.loadState === 'new' || bundleInfo.loadState === 'error') {
      const prevState = bundleInfo.loadState
      bundleInfo.loadState = 'loading'
      const loader = loadOpts.loader || this.load
      const onLoad = loadOpts.onLoad || this.onLoad
      loader.call(this, bundleInfo, loadOpts).then(
        (result) => {
          if (bundleInfo.update('loaded', loadOpts, result)) {
            onLoad.call(this, bundleInfo, prevState)
          }
        },
        (error) => {
          this._log('error', 'FTL Resource failed to load', { section, lang, error })
          bundleInfo.update('error', loadOpts)
          onLoad.call(this, bundleInfo, prevState, error)
        }
      )
    }
    return bundleInfo
  }

  public hasLoaded(section: string, lang?: string): boolean {
    const language = this.negotiateLang(lang)[0]
    return this.getLoadState(section, language) === 'loaded'
  }

  protected onLoad(bundleInfo: BundleInfo, prevState: LoadState, error?: unknown): void {
    for (const { listener, eventType } of this._listeners) {
      if (eventType === 'all' || eventType === bundleInfo.loadState) {
        listener(bundleInfo, prevState, error)
      }
    }
  }

  public addListener(listener: LoadEventHandler, eventType: LoadEventType = 'loaded'): void {
    this._listeners.push({ listener, eventType })
  }

  public removeListener(listener: LoadEventHandler): void {
    const index = this._listeners.findIndex((x) => x.listener === listener)
    if (index >= 0) {
      this._listeners.splice(index, 1)
    }
  }

  protected loadRef(
    referrer: BundleInfo,
    section: string,
    loadOpts: LoadOpts,
    lang?: string
  ): BundleInfo {
    const refBundle = this._load({ section, lang: lang || referrer.lang }, loadOpts)
    if (referrer === refBundle) {
      throw new Error(`Self-referencing section: ${section}/${refBundle.lang}`)
    } else if (referrer.lang !== refBundle.lang) {
      this._log('Ref to different language:', {
        section: referrer.section,
        lang: referrer.lang,
        ref: refBundle.section,
        refLang: refBundle.lang,
      })
    }
    refBundle.addDependent(referrer)
    return refBundle
  }

  public getLoadState(section: string, lang: string): LoadState {
    return this.getBundleInfo(section, lang)?.loadState || 'new'
  }

  protected getBundleInfo(section: string, lang: string, create = false): BundleInfo | undefined {
    const key = `${section}/${lang}`
    let bundleInfo = this._bundles[key]
    if (!bundleInfo && create) {
      this._bundles[key] = bundleInfo = new BundleInfo(section, lang)
    }
    return bundleInfo
  }

  protected getBundle(section: string, lang: string): FluentBundle | undefined {
    const bundleInfo = this.getBundleInfo(section, lang)
    if (!bundleInfo) {
      this._log('warn', 'Attempting to use unloaded section:', { section, lang })
      return
    }
    return bundleInfo.compile(this._bundleOpts)
  }
}

export class BundleInfo {
  public section: string
  public lang: string
  public loadState: LoadState = 'new'
  public loadOpts?: LoadOpts
  private bundle?: FluentBundle
  private messages?: FluentResource
  private version = 0
  private resources: Resource[] = []
  private dependents: Set<BundleInfo> = new Set()

  public constructor(section: string, lang: string) {
    this.section = section
    this.lang = lang
  }

  public addDependent(d: BundleInfo): void {
    this.dependents.add(d)
  }

  public compile(bundleOpts: BundleOpts): FluentBundle | undefined {
    if (this.bundle || this.loadState !== 'loaded') {
      return this.bundle
    }
    const resources: FluentResource[] = []
    for (const maybeRef of this.resources) {
      if (isRef(maybeRef)) {
        if (!maybeRef.compile(bundleOpts)) {
          // When it finishes loading it should mark this as dirty, leading to recompile.
          continue
        }
        resources.push(maybeRef.messages as FluentResource)
      } else {
        resources.push(maybeRef)
      }
    }
    const bundle = (this.bundle = new FluentBundle(this.lang, bundleOpts))
    for (const resource of resources) {
      bundle.addResource(resource, { allowOverrides: true })
    }
    this.messages = bundleToResource(bundle)
    this.version += 1
    return bundle
  }

  public update(loadState: LoadState, loadOpts: LoadOpts, result?: LoadResult): boolean {
    this.loadState = loadState
    this.loadOpts = loadOpts
    if (!result || this.resources === result.resources) return false
    else if (result.version) {
      if (result.version <= this.version) return false
      // We adjust here to get the right value after it's incremented on compile.
      this.version = result.version - 1
    }
    this.resources = result.resources
    this.markDirty()
    return true
  }

  public markDirty(): void {
    delete this.bundle
    this.dependents.forEach($markDirty)
  }
}
// I miss Python at times like this...
const $markDirty = (x: BundleInfo) => x.markDirty()

function isRef(maybeRef: Resource): maybeRef is BundleInfo
function isRef(maybeRef: any): boolean {
  return Array.isArray(maybeRef.resources)
}

type FluentPattern = FluentResource['body'][number]

function mapToResource(
  map: Map<string, FluentPattern>,
  resource: FluentResource = new FluentResource('')
) {
  map.forEach((entry) => resource.body.push(entry))
  return resource
}

function bundleToResource(bundle: FluentBundle) {
  const resource = new FluentResource('')
  mapToResource(bundle._terms, resource)
  mapToResource(bundle._messages, resource)
  return resource
}
