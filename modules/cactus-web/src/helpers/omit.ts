import omit from 'lodash/omit'
import { StyledConfig } from 'styled-components'
import { margin, MarginProps, width, WidthProps } from 'styled-system'

import { flexItem, FlexItemProps } from './flexItem'

export default omit

export const omitMargins = <Obj extends { [k: string]: any }>(
  obj: Obj,
  ...undesired: string[]
): Partial<Obj> =>
  omit<Obj>(
    obj,
    'm',
    'margin',
    'mt',
    'marginTop',
    'mr',
    'marginRight',
    'mb',
    'marginBottom',
    'ml',
    'marginLeft',
    'mx',
    'my',
    ...undesired
  )

function extractor<T>(keys: string[]) {
  return (props: Record<string, any>) => split(props, keys) as Partial<T>
}

export const extractMargins = extractor<MarginProps>(margin.propNames as string[])

type FieldStyleProps = FlexItemProps & MarginProps & WidthProps & { className?: string }
const FIELD_STYLE_PROPS: string[] = [
  'className',
  ...(margin.propNames as string[]),
  ...(width.propNames as string[]),
  ...(flexItem.propNames as string[]),
]
export const extractFieldStyleProps = extractor<FieldStyleProps>(FIELD_STYLE_PROPS)

interface Split {
  <P, K extends keyof P>(p: P, keys: K[]): Pick<P, K>
  <P, K extends keyof P>(p: P, ...keys: K[]): Pick<P, K>
}

// WARNING: if any of the keys K are required in P, `props` may not match type P after extraction.
export const split: Split = (
  props: Record<string, any>,
  ...args: (string | string[])[]
): Record<string, any> => {
  const keys = Array.isArray(args[0]) ? args[0] : (args as string[])
  return keys.reduce((extracted, key) => {
    if (key in props) {
      extracted[key] = props[key]
      delete props[key]
    }
    return extracted
  }, {} as Record<string, any>)
}

type Omittable = string | string[] | { propNames?: string[] }

// 3rd party type constraint, have to just ignore it.
// eslint-disable-next-line @typescript-eslint/ban-types
export const omitProps = <P extends object>(...args: Omittable[]): StyledConfig<P> => {
  const excludedProps = new Set<any>()
  const add = (x: string) => excludedProps.add(x)
  for (const arg of args) {
    if (typeof arg === 'string') {
      add(arg)
    } else if (Array.isArray(arg)) {
      arg.forEach(add)
    } else if (arg.propNames) {
      arg.propNames.forEach(add)
    }
  }
  return { shouldForwardProp: (p) => !excludedProps.has(p) }
}

export const getDataProps = <T>(props: T): any =>
  Object.keys(props).reduce((dataProps: any, prop: string) => {
    if (prop.startsWith?.('data-')) {
      // @ts-ignore
      dataProps[prop] = props[prop]
    }
    return dataProps
  }, {})
