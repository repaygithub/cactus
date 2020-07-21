import { CactusTheme } from '@repay/cactus-theme'
import React from 'react'
import { ThemeContext } from 'styled-components'

type MediaQuery = keyof Required<CactusTheme>['mediaQueries']

export type Size = 'tiny' | MediaQuery

class ScreenSize {
  size: Size

  constructor(size: Size) {
    this.size = size
  }

  toString(): string {
    return `${this.size}`
  }

  valueOf(): number {
    return ORDER[this.size] || -1
  }
}

type QueryType = {
  [K in Size]: {
    matches: boolean
    removeListener: (x: () => void) => void
  }
}

const ORDER: { [K in Size]: number } = {
  tiny: 0,
  small: 1,
  medium: 2,
  large: 3,
  extraLarge: 4,
}

type SizeCache = Array<ScreenSize> & { [K in Size]: ScreenSize }

export const SIZES = Object.keys(ORDER).reduce((sizes: any, s) => {
  const size = new ScreenSize(s as Size)
  sizes[ORDER[s as Size]] = size
  sizes[s] = size
  return sizes
}, []) as SizeCache

const ORDERED_SIZES = [...SIZES].map((s) => s.size).reverse()

const DEFAULT_SIZE: Size = 'large'

export const ScreenSizeContext = React.createContext<ScreenSize>(SIZES[DEFAULT_SIZE])

export const ScreenSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSize, setSize] = React.useState<Size>(DEFAULT_SIZE)
  const theme: CactusTheme = React.useContext(ThemeContext)

  React.useEffect(() => {
    const removeListener = (x: () => void) => {}
    const queries: QueryType = {
      tiny: { matches: true, removeListener },
      small: { matches: true, removeListener },
      medium: { matches: true, removeListener },
      large: { matches: true, removeListener },
      extraLarge: { matches: false, removeListener },
    }
    const listener = () => {
      for (let size of ORDERED_SIZES) {
        if (queries[size].matches) {
          setSize(size)
          break
        }
      }
    }
    if (theme.mediaQueries) {
      for (let mq of Object.keys(theme.mediaQueries) as MediaQuery[]) {
        const media = window.matchMedia(theme.mediaQueries[mq].replace(/^@media /, ''))
        queries[mq] = media
        media.addListener(listener)
      }
    }
    listener()

    return () => {
      for (let mq of Object.keys(queries)) {
        queries[mq as Size].removeListener(listener)
      }
    }
  }, [setSize, theme])

  return (
    <ScreenSizeContext.Provider value={new ScreenSize(currentSize)}>
      {children}
    </ScreenSizeContext.Provider>
  )
}

export default ScreenSizeProvider
