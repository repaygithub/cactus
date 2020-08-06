import '@testing-library/jest-dom'
import 'jest-styled-components'

// filter out @reach style warnings from console during tests
const __REACH_STYLES__ = /@reach\/[\S]+\sstyles not found/
const _warn = console.warn
console.warn = function filteredWarn(...args: any[]): void {
  if (typeof args[0] !== 'string' || !__REACH_STYLES__.test(args[0])) {
    _warn(...args)
  }
}
