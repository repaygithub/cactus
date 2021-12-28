import { BreakpointsObject } from '../theme'
import { memo, ThemeProps, wrap } from './base'

type Breakpoint = keyof BreakpointsObject
const bpMap: { [K in Breakpoint]: number } = {
  small: 0,
  medium: 1,
  large: 2,
  extraLarge: 3,
}

/** Returns a min-width media query of the type used by `styled-system`. */
const _mediaGTE = (p: ThemeProps, $breakpoint: Breakpoint) => p.theme.mediaQueries[$breakpoint]
export const mediaGTE = memo(_mediaGTE, 'small', 'medium')

/** Returns a media query that's the inverse of the equivalent `mediaGTE(X)` query. */
const _mediaLT = (p: ThemeProps, $breakpoint: Breakpoint) =>
  // Assumes query starts with `@media screen and (min-width:`
  `@media not ${p.theme.mediaQueries[$breakpoint].slice(7)}`
export const mediaLT = memo(_mediaLT, 'small', 'medium')

/** Returns the given breakpoint value; accepts either an index, or a screen size name. */
const _breakpoint = (p: ThemeProps, $breakpoint: number | Breakpoint) =>
  p.theme.breakpoints[bpMap[$breakpoint as Breakpoint] ?? ($breakpoint as number)]
export const breakpoint = wrap(_breakpoint)
