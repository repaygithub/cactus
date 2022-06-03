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

// Regex is way too complicated; copied from `final-form` because they don't export `toPath`.
const charCodeOfDot = '.'.charCodeAt(0)
const reEscapeChar = /\\(\\)?/g
const rePropName = RegExp( // Match anything that isn't a dot or bracket.
"[^.[\\]]+" + "|" + // Or match property names within brackets.
"\\[(?:" + // Match a non-string expression.
"([^\"'][^[]*)" + "|" + // Or match strings (supports escaping characters).
"([\"'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2" + ")\\]" + "|" + // Or match "" as the space between consecutive dots or empty brackets.
"(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))", "g")

export const toPath = (key: string): string[] => {
  if (key !== null && key !== undefined && typeof key !== 'string') {
    throw new Error('toPath() expects a string')
  }

  const result: string[] = []
  if (key?.length) {
    if (key.charCodeAt(0) === charCodeOfDot) {
      result.push('')
    }

    key.replace(rePropName, (match, expression, quote, subString) => {
      if (quote) {
        result.push(subString.replace(reEscapeChar, '$1'))
      } else if (expression) {
        result.push(expression.trim())
      } else {
        result.push(match)
      }
    })
  }
  return result
}
