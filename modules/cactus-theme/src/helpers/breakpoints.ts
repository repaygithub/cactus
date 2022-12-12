import { Breakpoint, ScreenSize } from '../theme'
import { memo, ThemeProps, wrap } from './base'

type BreakpointKey = Breakpoint | 0 | 1 | 2 | 3
type MediaQueryKey = ScreenSize | 0 | 1 | 2 | 3 | 4

/** Returns a min-width media query of the type used by `styled-system`. */
const _mediaGTE = (p: ThemeProps, key: MediaQueryKey) => `@media ${p.theme.mediaQueries[key].media}`
export const mediaGTE = memo(_mediaGTE, 'small', 'medium')

/** Returns a media query that's the inverse of the equivalent `mediaGTE(X)` query. */
const _mediaLT = (p: ThemeProps, key: MediaQueryKey) =>
  `@media not ${p.theme.mediaQueries[key].media}`
export const mediaLT = memo(_mediaLT, 'small', 'medium')

/** Returns the given breakpoint value; accepts either an index, or a screen size name. */
const _breakpoint = (p: ThemeProps, key: BreakpointKey) => p.theme.breakpoints[key]
export const breakpoint = wrap(_breakpoint)
