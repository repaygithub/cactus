declare module 'fluent' {
  export interface FluentBundleContructorOptions {
    functions?: object
    useIsolating?: boolean
    transform?: (...args: any[]) => any
  }

  export class FluentType {
    constructor(value: any, opts: object)
    toString(bundle: FluentBundle): string
    valueOf(): any
  }

  export class FluentNone extends FluentType {}
  export class FluentNumber extends FluentType {}
  export class FluentDateTime extends FluentType {}

  export type FluentNode = {
    type?: 'str' | 'num' | 'var' | 'term' | 'ref' | 'select'
    value: FluentMessage
    attrs: { [key: string]: FluentMessage } | null
  }

  export type FluentMessage = FluentNode | string | (FluentNode | string)[]

  export class FluentResource extends Map {
    static fromString(source: string): FluentResource
  }

  export class FluentBundle {
    constructor(locales: string | string[], options?: FluentBundleContructorOptions)
    messages: IterableIterator<[string, FluentMessage]>
    addMessages(source: string): string[]
    hasMessage(source: string): boolean
    getMessage(id: string): FluentMessage
    format(message: FluentMessage, args?: object, errors?: string[]): string
    addResource(res: FluentResource): string[]
  }

  export function ftl(strings: TemplateStringsArray): string
}
