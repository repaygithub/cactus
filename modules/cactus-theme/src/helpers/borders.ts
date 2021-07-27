import { BorderSize, CactusColor, Shape } from '../theme'
import { memo, ThemeProps, wrap } from './base'

type BorderSizeOpts = { [K in BorderSize]: unknown }
const DEFAULT_BORDER: BorderSizeOpts = { thin: '1px', thick: '2px' }
const radiusFactors: { [K in Shape]: number | null } = { square: 0, intermediate: null, round: 1 }

/**
 * Returns a selected value depending on the `theme.border` setting.
 * By default returns the border thickness, but can select any kind of value
 * given an opts object: `{ thin: 'valueWhenThin', thick: 'valueWhenThick' }`.
 */
const _borderSize = (p: ThemeProps, opts: BorderSizeOpts = DEFAULT_BORDER) => opts[p.theme.border]
export const borderSize = wrap(_borderSize)

/**
 * Returns a border CSS value with the given color and thickness according to `theme.border`.
 * The color can be any color name or string, though `theme.colors` is checked first.
 * The thickness can be customized with an options object like `borderSize` accepts.
 */
const _border = (p: ThemeProps, colorName: string, opts?: Partial<BorderSizeOpts>) => {
  const thickness = _borderSize(p, { ...DEFAULT_BORDER, ...opts })
  const color_ = p.theme.colors[colorName as CactusColor] || colorName
  return `${thickness} solid ${color_}`
}
export const border = memo(_border, 'lightContrast')

/**
 * Returns a pixel length value of the given max radius, scaled according to `theme.shape`:
 * `round` is the full radius, `intermediate` is scaled x0.4, and `square` is always zero.
 */
const _radius = (p: ThemeProps, maxRadius: number, intScaleFactor = 0.4) =>
  `${Math.ceil(maxRadius * (radiusFactors[p.theme.shape] ?? intScaleFactor))}px`
export const radius = memo(_radius, 8, 20)

/**
 * Returns a `box-shadow: inset` property declaration mimicking a border.
 * Same args as `border`, plus an additional `direction` argument which restricts
 * the inset border to only the given side of the element.
 * NOTE: Can't be used alongside `boxShadow` or `shadow` helpers (obviously).
 */
const _insetBorder = (
  p: ThemeProps,
  colorName: string,
  direction?: 'top' | 'bottom' | 'left' | 'right',
  opts?: Partial<BorderSizeOpts>
) => {
  let hOffset = '0',
    vOffset = '0',
    spread = '0'
  const thickness = _borderSize(p, { ...DEFAULT_BORDER, ...opts }) as string
  if (direction === 'top') {
    vOffset = thickness
  } else if (direction === 'bottom') {
    vOffset = `-${thickness}`
  } else if (direction === 'left') {
    hOffset = thickness
  } else if (direction === 'right') {
    hOffset = `-${thickness}`
  } else {
    spread = thickness
  }
  const color_ = p.theme.colors[colorName as CactusColor] || colorName
  return `box-shadow: inset ${hOffset} ${vOffset} 0 ${spread} ${color_}`
}
export const insetBorder = wrap(_insetBorder)
