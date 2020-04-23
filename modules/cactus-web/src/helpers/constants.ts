export const breakpoints = {
  small: 768,
  medium: 1024,
  large: 1200,
  extraLarge: 1440,
}

export const livePreviewStyle = {
  border: '1px solid red',
  marginBottom: '10px',
}

export const breakpointOrder: Array<keyof typeof breakpoints> = [
  'small',
  'medium',
  'large',
  'extraLarge',
]

/* Detects if the user is using a mobile/touch device which falls under either the SMALL or TINY breakpoint
category AND that the site they are on is optimized for a device of that size */
export const isResponsiveTouchDevice: boolean =
  typeof window !== 'undefined' &&
  typeof screen !== 'undefined' &&
  window.innerWidth < breakpoints.small &&
  'ontouchstart' in window &&
  screen.width === window.innerWidth
