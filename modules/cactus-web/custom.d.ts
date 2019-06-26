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

declare module '@reach/portal' {
  interface PortalProps {
    children: React.ReactNode
    type?: 'string'
  }

  const Portal: React.ComponentType<PortalProps>

  export default Portal
}

declare module '@reach/rect' {
  import React from 'react'

  type RectProps = {
    observe?: boolean
    onChange?: (rect: DOMRect) => void
    children?: (arg: {
      ref: (node: HTMLElement | null) => void
      rect: DOMRect | undefined
    }) => React.ReactNode
  }

  const Rect: React.FC<RectProps>

  export default Rect
  export function useRect<Element>(rect: React.Ref<Element>, observe?: boolean): DOMRect | null
}

declare module '@reach/visually-hidden' {
  interface VisuallyHiddenProps {
    role: string
    id?: string
  }

  const VisuallyHidden: React.SFC<VisuallyHiddenProps>
  export default VisuallyHidden
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
