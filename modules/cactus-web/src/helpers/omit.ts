import omit from 'lodash/omit'

export default omit

export const omitMargins = <Obj extends object>(obj: Obj, ...undesired: string[]) =>
  omit(
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
