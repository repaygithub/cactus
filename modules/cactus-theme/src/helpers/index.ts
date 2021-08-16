export * from './borders'
export * from './breakpoints'
export * from './colors'
export * from './sizes'
export * from './shadows'
import { ThemeProps } from './base'

/** Checks if the current device has a TINY screen and is touch-enabled. */
export const isResponsiveTouchDevice = (p: ThemeProps): boolean =>
  typeof window !== 'undefined' &&
  typeof screen !== 'undefined' &&
  window.innerWidth < parseInt(p.theme.breakpoints[0]) &&
  'ontouchstart' in window &&
  screen.width === window.innerWidth
