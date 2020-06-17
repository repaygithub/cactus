import React from 'react'
import { breakpointOrder, breakpoints } from '../helpers/constants'

const sizes = ['tiny', ...breakpointOrder].reverse()

const DEFAULT_SIZE = 'large'

export const ScreenSizeContext = React.createContext(DEFAULT_SIZE)

export const ScreenSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSize, setSize] = React.useState(DEFAULT_SIZE)
  React.useEffect(() => {
    const queries = {
      tiny: { matches: true }
    }
    const listener = () => {
      for (let size of sizes) {
        if (queries[size].matches) {
          setSize(size)
          break
        }
      }
    }
    for (let bp of breakpointOrder) {
      queries[bp] = window.matchMedia(`(min-width: ${breakpoints[bp]}px)`)
      queries[bp].addListener(listener)
    }
    listener()

    return () => {
      for (let bp of breakpointOrder) {
        queries[bp].removeListener(listener)
      }
    }
  }, [setSize])

  return <ScreenSizeContext.Provider value={currentSize}>{children}</ScreenSizeContext.Provider>
}

export default ScreenSizeProvider
