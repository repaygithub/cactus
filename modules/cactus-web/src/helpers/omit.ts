import omit from 'lodash/omit'
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
