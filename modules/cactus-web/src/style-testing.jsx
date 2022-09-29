import { screenSizes } from '@repay/cactus-theme'
import { omit } from 'lodash'
import styled from 'styled-components'
import { margin } from 'styled-system'
import React from 'react'
import { useScreenSize, SIZES } from './ScreenSizeProvider/ScreenSizeProvider'

const inc = (s) => s + 1

export default function TestBed({ Component, repeat=1000, ...rest }) {
  const [current, setNext] = React.useState(0)
  const ref = React.useRef(Date.now())
  React.useEffect(() => {
    if (current < repeat) {
      setTimeout(() => setNext(inc), 0)
    } else {
      console.log('TOTAL TIME', Component.displayName, ':', (Date.now() - ref.current) / 1000)
    }
  })
  return React.createElement(Component, rest, current)
}

export const Control = styled.div(margin)

// TODO In the real thing these would need to be generated dynamically, but this should be fine for a performance test.
const queries = [
  '@media screen and (min-width: 768px)',
  '@media screen and (min-width: 1024px)',
  '@media screen and (min-width: 1200px)',
  '@media screen and (min-width: 1440px)',
]

const sizes = [
  SIZES.small,
  SIZES.medium,
  SIZES.large,
  SIZES.extraLarge,
]

const useDefaultParserAndHook = (props) => {
  const parsedStyles = margin(props)
  const size = useScreenSize()
  const baseStyles = omit(parsedStyles, queries)
  let i = 0
  while (sizes[i] <= size) {
    Object.assign(baseStyles, parsedStyles[queries[i++]])
  }
  return { style: props.style ? { ...props.style, ...baseStyles } : baseStyles }
}

export const WithDefaultParserAndHook = styled.div.attrs(useDefaultParserAndHook)`
  width: 50px;
  height: 50px;
  background: red;
`

const config = margin.config
const useCustomParserAndHook = (props) => {
  const currentSize = useScreenSize()
  const { style: styleProp, theme } = props
  let style = styleProp
  let sizeKeys = false
  for (const key in props) {
    const processor = config[key]
    if (!processor) continue
    const scale = theme[processor.scale] || processor.defaults
    const rawStyle = props[key]

    const merge = (value) => {
      if (value !== null && value !== undefined) {
        const processed = processor(value, scale, props)
        if (processed) {
          if (style === styleProp) {
            style = Object.assign({}, style, processed)
          } else {
            Object.assign(style, processed)
          }
          return true
        }
      }
    }
    if (typeof rawStyle === 'object' && rawStyle !== null) {
      // Returns an array of matching sizes, e.g if current screen size
      // is medium, returns `['tiny', 'small', 'medium']` (ascending order).
      if (!sizeKeys) {
        sizeKeys = sizes.reduce((keys, size) => {
          if (size <= currentSize) keys.push(size.size)
          return keys
        }, ['tiny'])
        sizeKeys.reverse()
      }

      if (Array.isArray(rawStyle)) {
        for (let i = Math.min(sizeKeys.length, rawStyle.length) - 1; i >= 0; i--) {
          if (merge(rawStyle[i])) break
        }
      } else {
        for (const sizeKey of sizeKeys) {
          if (merge(rawStyle[sizeKey])) break
        }
      }
    } else {
      merge(rawStyle)
    }
  }
  return style ? { style } : undefined
}

export const WithCustomParserAndHook = styled.div.attrs(useCustomParserAndHook)`
  width: 50px;
  height: 50px;
  background: yellow;
`

const useDefaultParserAndTheme = (props) => {
  const parsedStyles = margin(props)
  const baseStyles = omit(parsedStyles, queries)
  for (const size of sizes) {
    const q = props.theme.mediaQueries[size.size]
    if (q.matches) {
      Object.assign(baseStyles, parsedStyles[`@media ${q.media}`])
    }
  }
  return { style: props.style ? { ...props.style, ...baseStyles } : baseStyles }
}

export const WithDefaultParserAndTheme = styled.div.attrs(useDefaultParserAndTheme)`
  width: 50px;
  height: 50px;
  background: blue;
`

const useCustomParserAndTheme = (props) => {
  const { style: styleProp, theme } = props
  let style = styleProp
  let sizeKeys = false
  for (const key in props) {
    const processor = config[key]
    if (!processor) continue
    const scale = theme[processor.scale] || processor.defaults
    const rawStyle = props[key]

    const merge = (value) => {
      if (value !== null && value !== undefined) {
        const processed = processor(value, scale, props)
        if (processed) {
          if (style === styleProp) {
            style = Object.assign({}, style, processed)
          } else {
            Object.assign(style, processed)
          }
          return true
        }
      }
    }
    if (typeof rawStyle === 'object' && rawStyle !== null) {
      // Returns an array of matching sizes, e.g if current screen size
      // is medium, returns `['tiny', 'small', 'medium']` (ascending order).
      if (!sizeKeys) {
        sizeKeys = []
        for (const size of screenSizes) {
          if (theme.mediaQueries[size].matches) sizeKeys.push(size)
        }
        sizeKeys.reverse()
      }

      if (Array.isArray(rawStyle)) {
        for (let i = Math.min(sizeKeys.length, rawStyle.length) - 1; i >= 0; i--) {
          if (merge(rawStyle[i])) break
        }
      } else {
        for (const sizeKey of sizeKeys) {
          if (merge(rawStyle[sizeKey])) break
        }
      }
    } else {
      merge(rawStyle)
    }
  }
  return style ? { style } : undefined
}

export const WithCustomParserAndTheme = styled.div.attrs(useCustomParserAndTheme)`
  width: 50px;
  height: 50px;
  background: green;
`

// This makes two assumptions about the style processors:
// 1. Must return simple style object, i.e. all the keys must be CSS properties;
//    can't return something like `{ '& > *': { margin: 5 } }` to set child styles.
// 2. Must return all styles for a given input; can't rely on screen size cascading.
// (I'm actually not even sure if it's possible to violate #2, but maybe in theory...)
// As far as I know, all the built-in `styled-system` processors meet these assumptions.
//export const makeStyleParser = (...parsers: SS.styleFn[]): AttrFunc => {
//  const config: Record<string, SS.ConfigFunction> = {}
//  for (const parser of parsers) {
//    Object.assign(config, parser.config)
//  }
//
//  return (props: any) => {
//    const { style: styleProp, theme } = props
//    let style = styleProp
//    let sizeKeys: string[] = false as any
//    for (const key in props) {
//      const processor = config[key]
//      if (!processor) continue
//      const scale: SS.Scale | undefined = theme[processor.scale] || processor.defaults
//      const rawStyle = props[key]
//
//      const merge = (value) => {
//        if (value !== null && value !== undefined) {
//          const processed = processor(value, scale, props)
//          if (processed) {
//            if (style === styleProp) {
//              style = Object.assign({}, style, processed)
//            } else {
//              Object.assign(style, processed)
//            }
//            return true
//          }
//        }
//      }
//      if (typeof rawStyle === 'object' && rawStyle !== null) {
//        // Returns an array of matching sizes, e.g if current screen size
//        // is medium, returns `['tiny', 'small', 'medium']` (ascending order).
//        // If you get this data using a hook, move up to the declaration,
//        // instead of having this lazy initialize.
//        if (!sizeKeys) sizeKeys = getMatchingScreenSizes(theme)
//
//        if (Array.isArray(rawStyle)) {
//          for (let i = Math.min(sizeKeys.length, rawStyle.length) - 1; i >= 0; i--) {
//            if (merge(rawStyle[i])) break
//          }
//        } else {
//          for (const key of keys) {
//            if (merge(rawStyle[key])) break
//          }
//        }
//      } else {
//        merge(rawStyle)
//      }
//    }
//    return style ? { style } : undefined
//  }
//}
