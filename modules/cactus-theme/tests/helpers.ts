import { HelperFunc } from '../src/helpers/base'
import defaultTheme from '../src/theme'

export const defaultProps = { theme: defaultTheme }

export const expectCurry = <A extends any[], R>(fn: HelperFunc<A, R>, args: A, result: R): void => {
  const curried = fn(...args)
  const fromProps = fn(defaultProps, ...args)
  const fromTheme = fn(defaultTheme, ...args)
  expect(typeof curried).toBe('function')
  expect(curried(defaultProps)).toEqual(result)
  expect(fromProps).toEqual(result)
  expect(fromTheme).toEqual(result)
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const expectMemo = (fn: any, expectedMemos: any, extra?: any): void => {
  const keys = Object.keys(expectedMemos).sort()
  expect(Object.keys(fn).sort()).toEqual(keys)
  for (const key of keys) {
    expect(fn[key]).toBe(fn(key))
    expect(fn(defaultProps, key)).toEqual(expectedMemos[key])
  }
  // This is to show it's the FUNCTION that's memoized, not the result.
  if (extra) {
    const extraVal = fn[extra.key](extra)
    expect(extraVal).toBe(extra.value)
    expect(extraVal).not.toBe(expectedMemos[extra.key])
  }
}
