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

type ParseState = '*' | '[]' | '.['
const WORD: ParseState = '*'
const START: ParseState = '.['
const BRACKET: ParseState = '[]'

const dotCode = START.charCodeAt(0)
const openCode = BRACKET.charCodeAt(0)
const closeCode = BRACKET.charCodeAt(1)

// Unfortunately `final-form` doesn't export their `toPath` function;
// this version doesn't support quotes/escape chars, but I've never seen those used.
export const toPath = (str: string): string[] => {
  if (str !== null && str !== undefined && typeof str !== 'string') {
    throw new Error('toPath() expects a string')
  }
  const path = []
  const length = str?.length
  if (!length) return path

  let index = 0
  let wordStart = 0
  let state = str.charCodeAt(0) === openCode ? START : WORD
  while (index < length) {
    const code = str.charCodeAt(index++)
    if (state === START) {
      wordStart = index
      if (code === dotCode) {
        state = WORD
      } else if (code === openCode) {
        state = BRACKET
      } else {
        throw new Error(`Expected '.' or '[' at index ${index - 1}`)
      }
    } else if (state === WORD) {
      if (code === dotCode || code === openCode) {
        path.push(str.substring(wordStart, --index))
        state = START
      } else if (code === closeCode) {
        throw new Error(`Unexpected ']' at index ${index - 1}`)
      }
    } else if (state === BRACKET) {
      if (code === closeCode) {
        path.push(str.substring(wordStart, index - 1))
        state = START
      } else if (code === openCode) {
        throw new Error(`Unexpected '[' at index ${index - 1}`)
      }
    }
  }
  if (state === WORD) {
    path.push(str.substring(wordStart))
  } else if (state === BRACKET) {
    throw new Error(`Unclosed '[' at starting at index ${wordStart - 1}`)
  }
  return path
}
