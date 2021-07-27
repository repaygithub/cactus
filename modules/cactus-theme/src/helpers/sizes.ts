import { FontSizeObject, IconSizeObject, TextStyleCollection } from '../theme'
import { memo, ThemeProps, wrap } from './base'
import { mediaGTE } from './breakpoints'

/** Returns the `theme.space` value of the given index as a pixel length. */
const _space = (p: ThemeProps, index: number) => `${p.theme.space[index]}px`
export const space = memo(_space, 2, 3, 4, 5, 7)

/** Returns the `theme.iconSizes` value of the given size as a pixel length. */
const _iconSize = (p: ThemeProps, size: keyof IconSizeObject) => `${p.theme.iconSizes[size]}px`
export const iconSize = wrap(_iconSize)

/**
 * Returns a CSS block with two `font-size` declarations at the given size:
 * one from `theme.mobileFontSizes` for tiny/small screen sizes,
 * and another from `theme.fontSizes` inside a `mediaGTE('medium')` block.
 */
const _fontSize = (p: ThemeProps, size: keyof FontSizeObject) => {
  const fontSize = p.theme.fontSizes[size]
  const mobileSize = p.theme.mobileFontSizes[size]
  return fontSize === mobileSize
    ? `font-size: ${fontSize}px;`
    : `
    font-size: ${mobileSize}px;
    ${mediaGTE(p, 'medium')} {
      font-size: ${fontSize}px;
    }
  `
}
export const fontSize = memo(_fontSize, 'body', 'small')

/**
 * Returns a CSS block with two text style (`font-size` & `line-height`) declarations:
 * one from `theme.mobileTextStyles` for tiny/small screen sizes,
 * and another from `theme.textStyles` inside a `mediaGTE('medium')` block.
 */
const _textStyle = (p: ThemeProps, size: keyof TextStyleCollection) => {
  const mobile = p.theme.mobileTextStyles[size]
  const regular = p.theme.textStyles[size]
  if (mobile.fontSize === regular.fontSize && mobile.lineHeight === regular.lineHeight) {
    return regular
  }
  return `
    font-size: ${mobile.fontSize};
    line-height: ${mobile.lineHeight};
    ${mediaGTE(p, 'medium')} {
      font-size: ${regular.fontSize};
      line-height: ${regular.lineHeight};
    }
  `
}
export const textStyle = memo(_textStyle, 'body', 'small')
