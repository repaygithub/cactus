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

export const breakpointOrder: (keyof typeof breakpoints)[] = [
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

export const isIE: boolean =
  typeof window !== 'undefined' && /MSIE|Trident/.test(window.navigator.userAgent)

export const supportsScopeQuery: boolean = (function () {
  try {
    document.querySelector(':scope')
  } catch {
    return false
  }
  return true
})()
