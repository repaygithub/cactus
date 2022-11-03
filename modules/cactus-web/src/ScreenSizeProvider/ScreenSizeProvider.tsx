import { CactusTheme } from '@repay/cactus-theme'
import { noop } from 'lodash'
import React from 'react'
import { ThemeContext } from 'styled-components'

// This should really be in cactus-theme...
export const screenSizes = ['tiny', 'small', 'medium', 'large', 'extraLarge'] as const

export type Size = typeof screenSizes[number]

const ORDER: { [K in Size]: number } = {
  tiny: 0,
  small: 1,
  medium: 2,
  large: 3,
  extraLarge: 4,
}

export class ScreenSize {
  public size: Size

  public constructor(size: Size) {
    this.size = size
  }

  public toString(): string {
    return `${this.size}`
  }

  public valueOf(): number {
    return ORDER[this.size] || -1
  }
}

type MediaMatch = Pick<
  MediaQueryList,
  'matches' | 'addListener' | 'removeListener' | 'addEventListener' | 'removeEventListener'
>
type QueryType = { [K in Size]: MediaMatch }

type SizeCache = ScreenSize[] & { [K in Size]: ScreenSize }

export const SIZES = screenSizes.reduce((sizes: any, s): void => {
  const size = new ScreenSize(s)
  sizes[ORDER[s]] = size
  sizes[s] = size
  return sizes
}, []) as SizeCache

const ORDERED_SIZES = [...SIZES].map((s): Size => s.size).reverse()

const DEFAULT_SIZE: Size = 'large'

export const ScreenSizeContext = React.createContext<ScreenSize>(SIZES[DEFAULT_SIZE])

export const useScreenSize = (): ScreenSize => React.useContext(ScreenSizeContext)

const createQueries = (theme: CactusTheme): QueryType => ({
  tiny: {
    matches: true,
    addListener: noop,
    removeListener: noop,
    removeEventListener: noop,
    addEventListener: noop,
  },
  small: window.matchMedia(theme.mediaQueries.small.replace(/^@media /, '')),
  medium: window.matchMedia(theme.mediaQueries.medium.replace(/^@media /, '')),
  large: window.matchMedia(theme.mediaQueries.large.replace(/^@media /, '')),
  extraLarge: window.matchMedia(theme.mediaQueries.extraLarge.replace(/^@media /, '')),
})

const getMatchedSize = (queries: QueryType): Size => {
  for (const size of ORDERED_SIZES) {
    if (queries[size].matches) {
      return size
    }
  }
  return DEFAULT_SIZE
}

export const ScreenSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  let queries: undefined | QueryType = undefined
  const theme: CactusTheme = React.useContext(ThemeContext)
  const [currentSize, setSize] = React.useState<Size>(() => {
    queries = createQueries(theme)
    return getMatchedSize(queries)
  })

  React.useEffect(() => {
    const q: QueryType = queries || createQueries(theme)
    const listener = () => setSize(getMatchedSize(q))
    for (const key of Object.keys(q)) {
      if (!('addEventListener' in q[key as Size])) {
        q[key as Size].addListener(listener)
      } else {
        q[key as Size].addEventListener('change', listener)
      }
    }
    listener()

    return (): void => {
      for (const key of Object.keys(q)) {
        if (!('removeEventListener' in q[key as Size])) {
          q[key as Size].removeListener(listener)
        } else {
          q[key as Size].removeEventListener('change', listener)
        }
      }
    }
  }, [theme]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ScreenSizeContext.Provider value={SIZES[currentSize]}>{children}</ScreenSizeContext.Provider>
  )
}

export default ScreenSizeProvider
