import { CactusTheme } from '../theme'

export type ThemeProps = { theme: CactusTheme }

type ThemeFunc<A extends any[], R> = (props: ThemeProps, ...args: A) => R

export type StyleFunc<R> = (props: ThemeProps) => R

export interface HelperFunc<A extends any[], R> {
  (...args: A): StyleFunc<R>
  (pt: CactusTheme | ThemeProps, ...args: A): R
}

export const wrap = <A extends any[], R>(func: ThemeFunc<A, R>): HelperFunc<A, R> => {
  const helper: any = (first: any, ...rest: any[]) => {
    if (typeof first === 'object') {
      if ('theme' in first) {
        return (func as any)(first, ...rest)
      } else if ('space' in first && 'mediaQueries' in first) {
        // Picked two relatively uncommon names to represent the theme shape.
        return (func as any)({ theme: first }, ...rest)
      }
    } else if (rest.length === 0 && first in helper) {
      return helper[first]
    }
    return (p: ThemeProps) => (func as any)(p, first, ...rest)
  }
  return helper
}

export const memo = <A extends any[], R>(
  func: ThemeFunc<A, R>,
  ...toCache: A[0][]
): HelperFunc<A, R> => {
  const helper: any = wrap(func)
  for (const arg of toCache) {
    helper[arg] = (p: ThemeProps) => (func as any)(p, arg)
  }
  return helper
}
