import {
  CactusColor,
  CactusTheme,
  ColorStyle,
  TextStyle,
  TextStyleCollection,
} from '@repay/cactus-theme'
import { css, FlattenSimpleInterpolation } from 'styled-components'

export const border = (theme: CactusTheme, color: string): string => {
  const thickness = theme.border === 'thick' ? '2px' : '1px'
  return `${thickness} solid ${theme.colors[color as CactusColor] || color}`
}

export const invertColors = (style: ColorStyle): { color: string; backgroundColor: string } => {
  return { color: style.backgroundColor, backgroundColor: style.color }
}

const shadowTypes = [
  '0px 0px 3px',
  '0px 3px 8px',
  '0px 9px 24px',
  '0px 12px 24px',
  '0px 30px 42px',
  '0px 45px 48px',
]

export const boxShadow = (theme: CactusTheme, shadowType: number): string => {
  if (theme.boxShadows) {
    return `box-shadow: ${shadowTypes[shadowType]} ${theme.colors.transparentCTA}`
  } else {
    return ''
  }
}

type FontSize = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'p' | 'small' | 'tiny'

export const fontSize = (theme: CactusTheme, size: FontSize): string => {
  if (theme.mediaQueries) {
    return `
      font-size: ${theme.mobileFontSizes[size]}px;
      ${theme.mediaQueries.medium} {
        font-size: ${theme.fontSizes[size]}px;
      }
    `
  }

  return `font-size: ${theme.fontSizes[size]}px;`
}

export const textStyle = (
  theme: CactusTheme,
  size: keyof TextStyleCollection
): FlattenSimpleInterpolation | TextStyle => {
  if (theme.mediaQueries) {
    return css`
      ${theme.mobileTextStyles[size]}
      ${theme.mediaQueries.medium} {
        ${theme.textStyles[size]}
      }
    `
  }

  return theme.textStyles[size]
}
