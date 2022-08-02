import icons, { IconProps } from '@repay/cactus-icons'
import { ComponentType, JSXElementConstructor, ReactElement } from 'react'

type ArgType = Record<string, any>
type ArgTypes = Record<string, ArgType>

interface StoryFn<P> {
  (args: P): ReactElement
  argTypes?: { [K in keyof P]?: ArgType }
  args?: Partial<P>
  parameters?: Record<string, any>
  storyName?: string
}
// eslint-disable-next-line @typescript-eslint/ban-types
export type Story<C, E = {}> = C extends ComponentType<infer P>
  ? StoryFn<E & Omit<P, keyof E>>
  : C extends JSXElementConstructor<infer P>
  ? StoryFn<E & Omit<P, keyof E>>
  : StoryFn<E & C>

type ActionFn<A> = (arg: A) => void
export interface ActionWrap<A> {
  (fn: ActionFn<A>): ActionFn<A>
  <B>(fn: ActionFn<B>, simplifyChangeEvent: true): ActionFn<A>
  (...labels: string[]): ActionFn<A>
}
export interface Action<A> extends ActionFn<A> {
  wrap: ActionWrap<A>
}

interface ActionConfig {
  name: string
  wrapper?: boolean
  label?: string
}
type ActionParam = ActionConfig | string

export const HIDE_CONTROL: ArgType = { control: false }
export const STRING: ArgType = {
  control: 'text',
  table: { disable: false },
  defaultValue: '',
  mapping: { '': undefined },
}
type Length = string | number
const trim = (x: string) => x.trim()
const mapSpace = (str: string | undefined): Length | Length[] | undefined => {
  // Sometimes Storybook randomly passes the already-mapped value...
  const parts = (str ? `${str}` : '').split(',').map(trim).filter(Boolean)
  if (!parts.length) return undefined
  else if (parts.length > 1) return parts.map(mapSpace) as Length[]
  str = parts[0]
  return /^-?[0-7]$/.test(str) ? parseInt(str) : str
}
export const SPACE: ArgType = { ...STRING, map: mapSpace }

export const HIDE_STYLED: ArgTypes = {
  ref: HIDE_CONTROL,
  theme: HIDE_CONTROL,
  as: HIDE_CONTROL,
  forwardedAs: HIDE_CONTROL,
  className: HIDE_CONTROL,
}

export const FIELD_ARGS: ArgTypes = {
  label: STRING,
  disabled: { control: 'boolean' },
  success: STRING,
  warning: STRING,
  error: STRING,
  tooltip: STRING,
  alignTooltip: { options: ['left', 'right'] },
  autoTooltip: { control: 'boolean' },
  disableTooltip: { control: 'boolean' },
  name: STRING,
}

export type Icon = (props: IconProps) => ReactElement
export type IconName = keyof typeof icons

export const ICON_ARG = {
  name: 'icon',
  control: 'select',
  options: Object.keys(icons),
  mapping: icons,
  defaultValue: 'ActionsAdd',
} as const

export const actions = (...args: ActionParam[]): ArgTypes => args.reduce(reduceActions, {})

const reduceActions = (_actions: ArgTypes, configParam: ActionParam) => {
  const config = typeof configParam === 'string' ? { name: configParam } : configParam
  _actions[config.name] = { control: false, defaultValue: getAction(config) }
  return _actions
}

const getAction = (config: ActionConfig) => {
  const name = config.name
  const action = actionFn(name, config.label) as Action<any>
  action.wrap = (fn: any, ...rest: any[]) => {
    if (typeof fn !== 'function') {
      return actionFn(name, fn, ...rest)
    }
    const simplifyChangeEvent = !!rest[0]
    return (e: any) => {
      if (simplifyChangeEvent) {
        fn(e.target.type === 'checkbox' ? e.target.checked : e.target.value)
      } else {
        fn(e)
      }
      action(e)
    }
  }
  return config.wrapper ? action.wrap : action
}

const actionFn =
  (name: string, ...args: any[]) =>
  (e: any) => {
    const log: any[] = [`${name}:`, ...args]
    if (e?.target) {
      const target = e.target
      let targetName = args[0] || target.name || target.id
      let value = target.value
      if (target.type === 'checkbox') {
        if (target.hasAttribute('value')) {
          targetName = value
        }
        value = target.checked
      }
      if (name === 'onChange') {
        if (targetName) {
          log.splice(0, 2, `${name} ${targetName}:`, value)
        } else {
          if (target instanceof HTMLElement) log.push(target)
          log.push(value)
        }
      } else {
        if (targetName) {
          log.splice(1, 1, targetName)
        } else if (target instanceof HTMLElement) {
          log.push(target)
        }
        if (e.relatedTarget) {
          log.push('related:', e.relatedTarget)
        }
        log.push(getEventInfo(e))
      }
    } else {
      log.push(e)
    }
    console.log(...log.filter((x) => x !== undefined))
  }

const KEYS = ['key', 'button', 'buttons', 'altKey', 'ctrlKey', 'metaKey', 'shiftKey']

const getEventInfo = (e: any) =>
  KEYS.reduce((info: any, key) => {
    if (e[key]) {
      info = info ?? {}
      info[key] = e[key]
      if (e.button !== undefined) info.button = e.button
    }
    return info
  }, undefined)

Object.assign(FIELD_ARGS, actions('onChange', 'onFocus', 'onBlur'))
