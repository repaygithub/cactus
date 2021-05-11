import omit from 'lodash/omit'
import { StyledConfig } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

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
  // @ts-ignore Not sure why Typescript doesn't like `key is keyof T`.
  const isKeyofT = (key: string): key is keyof T => keys.includes(key)
  return (props: Record<string, any>) => {
    const extractedProps: Partial<T> = {}
    for (const key of Object.keys(props)) {
      if (isKeyofT(key)) {
        extractedProps[key] = props[key]
        delete props[key]
      }
    }
    return extractedProps
  }
}

export const extractMargins = extractor<MarginProps>(margin.propNames as string[])

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
