import omit from 'lodash/omit'
import { margin, MarginProps, width, WidthProps } from 'styled-system'

import { flexItem, FlexItemProps } from './styled'

export default omit

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

export const getDataProps = <T>(props: T): any =>
  Object.keys(props).reduce((dataProps: any, prop: string) => {
    if (prop.startsWith?.('data-')) {
      // @ts-ignore
      dataProps[prop] = props[prop]
    }
    return dataProps
  }, {})
