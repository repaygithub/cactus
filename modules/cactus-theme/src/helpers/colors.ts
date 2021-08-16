import { CactusColor, CactusTheme, ColorStyle, ColorVariant } from '../theme'
import { memo, StyleFunc, ThemeProps } from './base'

/** Returns the `theme.colors` value with the given color name. */
const _color = (p: ThemeProps, colorName: CactusColor) => p.theme.colors[colorName]
export const color = memo(
  _color,
  'base',
  'callToAction',
  'lightContrast',
  'darkestContrast',
  'white',
  'lightGray',
  'mediumGray',
  'success',
  'error'
)

interface ColorStyleHelper {
  (style: ColorVariant): StyleFunc<ColorStyle>
  (foreColor: string, bgColor: string): StyleFunc<ColorStyle>
  (p: CactusTheme | ThemeProps, style: ColorVariant): ColorStyle
  (p: CactusTheme | ThemeProps, foreColor: string, bgColor: string): ColorStyle
}

/**
 * Returns the `theme.colorStyles` value with the given style name,
 * or a ColorStyle object with the given fore- & background colors.
 */
const _colorStyle = (p: ThemeProps, style: string, bgColor?: string): ColorStyle => {
  if (bgColor) {
    return {
      color: p.theme.colors[style as CactusColor] || style,
      backgroundColor: p.theme.colors[bgColor as CactusColor] || bgColor,
    }
  }
  return p.theme.colorStyles[style as ColorVariant]
}
export const colorStyle: ColorStyleHelper = memo(
  _colorStyle,
  'base',
  'callToAction',
  'standard',
  'success',
  'error',
  'disable'
)
