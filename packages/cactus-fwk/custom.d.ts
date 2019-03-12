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

  export type FluentNode = FluentType | string

  export class FluentResource extends Map {
    static fromString(source: string): FluentResource
  }

  export class FluentBundle {
    constructor(locales: string | string[], options?: FluentBundleContructorOptions)
    addMessages(source: string): string[]
    hasMessage(source: string): boolean
    getMessage(id: string): FluentNode[]
    format(message: FluentNode[], args?: object, errors?: string[]): string
    addResource(res: FluentResource): string[]
  }

  export function ftl(strings: TemplateStringsArray): string
}
