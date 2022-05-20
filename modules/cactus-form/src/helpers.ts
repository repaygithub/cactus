

export const popAttr = (obj: UnknownProps, attr: string) => {
  const val = obj[attr]
  delete obj[attr]
  return val
}

export const getFieldConfig = <C>(keys: (keyof C)[], props: UnknownProps, component?: React.ElementType<any>): C => {
  const fieldConfig: any = { component }
  for (const key of keys) {
    if (key in props) {
      fieldConfig[key] = popAttr(props, key)
    } else if (component && component[key]) {
      // For setting component defaults, useful for `format`/`parse`/`validate`.
      fieldConfig[key] = component[key]
    }
  }
  return fieldConfig
}
