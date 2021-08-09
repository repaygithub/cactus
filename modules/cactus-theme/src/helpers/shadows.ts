import { CactusColor } from '../theme'
import { StyleFunc, ThemeProps, wrap } from './base'
import { border } from './borders'

type ShadowValue = string | Record<string, string> | undefined

const shadowTypes = [
  '0px 0px 3px',
  '0px 3px 8px',
  '0px 9px 24px',
  '0px 12px 24px',
  '0px 30px 42px',
  '0px 45px 48px',
]
const isCssValue = (x: unknown): x is string => typeof x === 'string' && !x.includes(':')

/** Returns a `box-shadow` property with the given standard shadow type (from the style guide). */
const _boxShadow = (p: ThemeProps, shadowType: number, colorName = 'lightCallToAction') => {
  const color_ = p.theme.colors[colorName as CactusColor] || colorName
  return `box-shadow: ${shadowTypes[shadowType]} ${color_};`
}
export const boxShadow = wrap(_boxShadow)

/**
 * Returns a `box-shadow` property if `theme.boxShadows` is true, or a fallback value otherwise.
 * `fallback` can be a function that takes the props object, or a string, or a CSS object.
 * If it's a string that does not contain ':', it's assumed to be a border color.
 * Similarly, if the function returns a string with no ':', it's automatically added
 * to a `border:` property declaration.
 */
const _shadow = (
  props: ThemeProps,
  shadowTypeOrSize: number | string,
  fallback?: ShadowValue | StyleFunc<ShadowValue>
): ShadowValue => {
  let value = fallback as ShadowValue
  if (props.theme.boxShadows) {
    const shadowSize = shadowTypes[shadowTypeOrSize as number] || shadowTypeOrSize
    return `box-shadow: ${shadowSize} ${props.theme.colors.lightCallToAction};`
  } else if (typeof fallback === 'function') {
    value = fallback(props)
  } else if (isCssValue(fallback)) {
    // Assume string fallbacks are border colors.
    value = border(props, fallback)
  }
  // If no CSS property is specified, assume `border` as the closest analogue of box shadows.
  return isCssValue(value) ? `border: ${value};` : value
}
export const shadow = wrap(_shadow)
