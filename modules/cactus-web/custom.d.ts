declare module '@storybook/addon-actions' {
  export type HandlerFunction = (...args: any[]) => undefined
  export type DecoratorFunction = (args: any[]) => any[]
  export interface Options {
    depth?: number
    clearOnStoryChange?: boolean
    limit?: number
  }

  export function decorateAction(
    decorators: DecoratorFunction[]
  ): (name: string, options?: Options) => HandlerFunction

  export function configureActions(options: Options): undefined

  export function action(name: string): HandlerFunction

  export function actions<EventNames extends string[]>(
    ...events: EventNames
  ): { [K in EventNames[number]]: HandlerFunction }

  export function actions<EventNameMap extends { [K: string]: string }>(
    events: EventNameMap
  ): { [K in keyof EventNameMap]: HandlerFunction }
}

declare module '@reach/utils' {
  export function assignRef<T = any>(ref: React.Ref<T>, value: any): void
}

declare module '@repay/scripts' {
  type RepayScriptsArgs = {
    command: 'build' | 'dev'
    entry: string
    cwd: string
    port?: string
  }
  const repayScripts: (args: RepayScriptsArgs) => void

  export default repayScripts
}
