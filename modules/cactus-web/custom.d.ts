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

declare module '@repay/scripts' {
  interface RepayScriptsArgs {
    command: 'build' | 'dev'
    entry: string
    cwd: string
    port?: string
  }
  const repayScripts: (args: RepayScriptsArgs) => void

  export default repayScripts
}

declare module '*.png'
