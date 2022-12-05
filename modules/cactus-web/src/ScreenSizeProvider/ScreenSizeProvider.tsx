import { CactusTheme, MediaQueries, ScreenSize as Size, screenSizes } from '@repay/cactus-theme'
import React from 'react'
import { ThemeContext } from 'styled-components'

export class ScreenSize {
  public size: Size
  public index: number

  public constructor(size: Size) {
    this.size = size
    this.index = screenSizes.indexOf(size)
  }

  public toString(): string {
    return this.size
  }

  public valueOf(): number {
    return this.index
  }
}

type SizeCache = readonly ScreenSize[] & { readonly [K in Size]: ScreenSize }

export const SIZES: SizeCache = screenSizes.reduce((sizes: any, s) => {
  sizes.push((sizes[s] = new ScreenSize(s)))
  return sizes
}, [])

const ORDERED_SIZES = [...screenSizes].reverse()

const DEFAULT_SIZE: Size = 'large'

export const ScreenSizeContext = React.createContext<ScreenSize>(SIZES[DEFAULT_SIZE])

export const useScreenSize = (): ScreenSize => React.useContext(ScreenSizeContext)

const getMatchedSize = (queries: MediaQueries): Size => {
  for (const size of ORDERED_SIZES) {
    if (queries[size].matches) {
      return size
    }
  }
  return DEFAULT_SIZE
}

export const ScreenSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme: CactusTheme = React.useContext(ThemeContext)
  const [currentSize, setSize] = React.useState<Size>(() => {
    return getMatchedSize(theme.mediaQueries)
  })

  React.useEffect(() => {
    const queries = theme.mediaQueries
    const listener = () => setSize(getMatchedSize(queries))
    for (const query of queries) {
      if (query.addEventListener) {
        query.addEventListener('change', listener)
      } else {
        query.addListener(listener)
      }
    }
    listener()

    return () => {
      for (const query of queries) {
        if (query.removeEventListener) {
          query.removeEventListener('change', listener)
        } else {
          query.removeListener(listener)
        }
      }
    }
  }, [theme])

  return (
    <ScreenSizeContext.Provider value={SIZES[currentSize]}>{children}</ScreenSizeContext.Provider>
  )
}

export default ScreenSizeProvider
