import omit from 'lodash/omit'

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
