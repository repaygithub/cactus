import { CactusTheme } from '@repay/cactus-theme'
import { noop } from 'lodash'
import React from 'react'
import { ThemeContext } from 'styled-components'

type MediaQuery = keyof Required<CactusTheme>['mediaQueries']

export type Size = 'tiny' | MediaQuery

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

type MediaMatch = Pick<MediaQueryList, 'matches' | 'addListener' | 'removeListener'>
type QueryType = { [K in Size]: MediaMatch }

type SizeCache = ScreenSize[] & { [K in Size]: ScreenSize }

export const SIZES = Object.keys(ORDER).reduce((sizes: any, s): void => {
  const size = new ScreenSize(s as Size)
  sizes[ORDER[s as Size]] = size
  sizes[s] = size
  return sizes
}, []) as SizeCache

const ORDERED_SIZES = [...SIZES].map((s): Size => s.size).reverse()

const DEFAULT_SIZE: Size = 'large'

export const ScreenSizeContext = React.createContext<ScreenSize>(SIZES[DEFAULT_SIZE])

export const useScreenSize = (): ScreenSize => React.useContext(ScreenSizeContext)

const createQueries = (theme: CactusTheme): QueryType => theme.mediaQueries
  //({
  //  tiny: { matches: true, addListener: noop, removeListener: noop },
  //  small: window.matchMedia(theme.mediaQueries.small.replace(/^@media /, '')),
  //  medium: window.matchMedia(theme.mediaQueries.medium.replace(/^@media /, '')),
  //  large: window.matchMedia(theme.mediaQueries.large.replace(/^@media /, '')),
  //  extraLarge: window.matchMedia(theme.mediaQueries.extraLarge.replace(/^@media /, '')),
  //})

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

  const ref = React.useRef({ currentSize, theme }).current
  if (ref.currentSize !== currentSize) {
    ref.theme = { ...theme }
  }

  React.useEffect(() => {
    const q: QueryType = queries || createQueries(theme)
    const listener = () => setSize(getMatchedSize(q))
    for (const key of Object.keys(q)) {
      q[key as Size].addListener(listener)
    }
    listener()

    return (): void => {
      for (const key of Object.keys(q)) {
        q[key as Size].removeListener(listener)
      }
    }
  }, [theme]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ThemeContext.Provider value={ref.theme}>
    <ScreenSizeContext.Provider value={SIZES[currentSize]}>{children}</ScreenSizeContext.Provider>
  </ThemeContext.Provider>
  )
}

export default ScreenSizeProvider
