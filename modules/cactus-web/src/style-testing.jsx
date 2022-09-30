import { screenSizes } from '@repay/cactus-theme'
import { omit } from 'lodash'
import React from 'react'
import styled from 'styled-components'
import { margin } from 'styled-system'

import { SIZES, useScreenSize } from './ScreenSizeProvider/ScreenSizeProvider'

const inc = (s) => s + 1
const sum = (s, n) => s + n

export default function TestBed({ Component, repeat = 1000, ...rest }) {
  const [current, setNext] = React.useState(0)
  const ref = React.useRef(Date.now())
  React.useEffect(() => {
    if (current < repeat) {
      setTimeout(() => setNext(inc), 0)
    } else {
      const t = times.get(Component)
      t.push(Date.now() - ref.current)
      const total = t.reduce(sum, 0) / t.length
      console.log('TOTAL TIME', Component.displayName, ':', total / 1000)
    }
  })
  return React.createElement(Component, rest, current)
}

export const TestBed2 = ({ Component, level = 2, ...rest }) => {
  if (level > 0) {
    rest.level = level - 1
    rest.Component = Component
    const children = []
    for (let i = 0; i < 50; i++) {
      rest.key = i
      children.push(React.createElement(TestBed2, rest))
    }
    return <>{children}</>
  }
  return React.createElement(Component, rest, level)
}

export const Control = styled.div(margin)

// TODO In the real thing these would need to be generated dynamically, but this should be fine for a performance test.
const queries = [
  '@media screen and (min-width: 768px)',
  '@media screen and (min-width: 1024px)',
  '@media screen and (min-width: 1200px)',
  '@media screen and (min-width: 1440px)',
]

const sizes = [SIZES.small, SIZES.medium, SIZES.large, SIZES.extraLarge]

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
        sizeKeys = sizes.reduce(
          (keys, size) => {
            if (size <= currentSize) keys.push(size.size)
            return keys
          },
          ['tiny']
        )
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

// Custom parser makes two assumptions about the style processors:
// 1. Must return simple style object, i.e. all the keys must be CSS properties;
//    can't return something like `{ '& > *': { margin: 5 } }` to set child styles.
// 2. Must return all styles for a given input; can't rely on screen size cascading.
// (I'm actually not even sure if it's possible to violate #2, but maybe in theory...)
// As far as I know, all the built-in `styled-system` processors meet these assumptions.

const times = new Map()
times.set(Control, [])
times.set(WithCustomParserAndHook, [])
times.set(WithCustomParserAndTheme, [])
times.set(WithDefaultParserAndHook, [])
times.set(WithDefaultParserAndTheme, [])
