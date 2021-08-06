import { FontSizeObject, IconSizeObject, TextStyle, TextStyleCollection } from '../theme'
import { memo, ThemeProps, wrap } from './base'
import { mediaGTE } from './breakpoints'

type TextStyleSize = keyof TextStyleCollection

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

const needsMQ = (mobile: TextStyle, regular: TextStyle) =>
  !(mobile.fontSize === regular.fontSize && mobile.lineHeight === regular.lineHeight)

/**
 * Returns a CSS block with two text style (`font-size` & `line-height`) declarations:
 * one from `theme.mobileTextStyles` for tiny/small screen sizes,
 * and another from `theme.textStyles` inside a `mediaGTE('medium')` block.
 */
const _textStyle = (p: ThemeProps, size: TextStyleSize) => {
  const mobile = p.theme.mobileTextStyles[size]
  const regular = p.theme.textStyles[size]
  if (!needsMQ(mobile, regular)) {
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

type RenderFunc = (lineHeight: number, fontSize: number, p: ThemeProps) => string
type RenderOpt = 'px' | 'em' | string | RenderFunc

const asPx = (style: TextStyle) => {
  const exact = parseFloat(style.lineHeight) * parseFloat(style.fontSize)
  return exact.toFixed(4).replace(/\.?0*$/, 'px')
}

const matchesMobile = (p: ThemeProps) => !window.matchMedia(mediaGTE(p, 'medium').slice(7)).matches

/** Returns the line height for the given text style, as an em or pixel length. */
const _lineHeight = (p: ThemeProps, size: TextStyleSize, opt: RenderOpt = 'px'): string => {
  const mobile = p.theme.mobileTextStyles[size]
  const regular = p.theme.textStyles[size]
  if (opt === 'px') {
    return asPx(needsMQ(mobile, regular) && matchesMobile(p) ? mobile : regular)
  } else if (opt === 'em') {
    const needsQuery = mobile.lineHeight !== regular.lineHeight
    const style = needsQuery && matchesMobile(p) ? mobile : regular
    return `${style.lineHeight}em`
  } else if (typeof opt === 'function') {
    const mob = opt(parseFloat(mobile.lineHeight), parseFloat(mobile.fontSize), p)
    const reg = opt(parseFloat(regular.lineHeight), parseFloat(regular.fontSize), p)
    if (mob === reg) return mob
    return `${mob} ${mediaGTE(p, 'medium')} { ${reg} }`
  } else {
    const mob = `${opt}: ${asPx(mobile)};`
    if (!needsMQ(mobile, regular)) return mob
    return `${mob} ${mediaGTE(p, 'medium')} { ${opt}: ${asPx(regular)}; }`
  }
}
export const lineHeight = wrap(_lineHeight)
