import { CactusTheme } from '../theme'

export type ThemeProps = { theme: CactusTheme }

type ThemeFunc<A extends any[], R> = (props: ThemeProps, ...args: A) => R

export type StyleFunc<R> = (props: ThemeProps) => R

export interface HelperFunc<A extends any[], R> {
  (...args: A): StyleFunc<R>
  (pt: CactusTheme | ThemeProps, ...args: A): R
}

export const wrap = <A extends any[], R>(func: ThemeFunc<A, R>): HelperFunc<A, R> => {
  const helper: any = (...args: A) => {
    if (typeof args[0] === 'object') {
      if ('theme' in args[0]) {
        const first = args.shift() as ThemeProps
        return func(first, ...args)
      } else if ('space' in args[0] && 'mediaQueries' in args[0]) {
        // Picked two relatively uncommon names to represent the theme shape.
        const theme = args.shift() as CactusTheme
        return func({ theme }, ...args)
      }
    } else if (args.length === 1 && args[0] in helper) {
      return helper[args[0]]
    }
    return (p: ThemeProps) => func(p, ...args)
  }
  return helper
}

export const memo = <A extends any[], R>(
  func: ThemeFunc<A, R>,
  ...toCache: A[0][]
): HelperFunc<A, R> => {
  const helper: any = wrap(func)
  for (const arg of toCache) {
    helper[arg] = helper(arg)
  }
  return helper
}
