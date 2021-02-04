import {
  CactusColor,
  CactusTheme,
  ColorStyle,
  Shape,
  TextStyle,
  TextStyleCollection,
} from '@repay/cactus-theme'
import { css, FlattenSimpleInterpolation } from 'styled-components'

export type Props = { theme: CactusTheme }

export const borderSize = (props: Props): string => (props.theme.border === 'thick' ? '2px' : '1px')

export const border = (theme: CactusTheme, color: string): string => {
  const thickness = theme.border === 'thick' ? '2px' : '1px'
  return `${thickness} solid ${theme.colors[color as CactusColor] || color}`
}

export type Direction = 'top' | 'bottom' | 'left' | 'right'

export const insetBorder = (theme: CactusTheme, color: string, direction?: Direction): string => {
  let hOffset = 0,
    vOffset = 0,
    spread = 0
  const thickness = theme.border === 'thick' ? 2 : 1
  if (direction === 'top') {
    vOffset = thickness
  } else if (direction === 'bottom') {
    vOffset = -thickness
  } else if (direction === 'left') {
    hOffset = thickness
  } else if (direction === 'right') {
    hOffset = -thickness
  } else {
    spread = thickness
  }
  color = theme.colors[color as CactusColor] || color
  return `box-shadow: inset ${hOffset}px ${vOffset}px 0px ${spread}px ${color}`
}

type MaxRadius = 8 | 20

const radiiMap: Record<MaxRadius, Record<Shape, string>> = {
  8: {
    square: '1px',
    intermediate: '4px',
    round: '8px',
  },
  20: {
    square: '1px',
    intermediate: '8px',
    round: '20px',
  },
}

export const radius = (maxRadius: MaxRadius) => ({ theme }: Props): string =>
  radiiMap[maxRadius][theme.shape]

export const invertColors = (style: ColorStyle): ColorStyle => {
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

export const boxShadow = (theme: CactusTheme, shadowType: number | string): string => {
  if (theme.boxShadows) {
    if (typeof shadowType === 'number') {
      shadowType = shadowTypes[shadowType]
    }
    return `box-shadow: ${shadowType} ${theme.colors.transparentCTA}`
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

type MediaQuery = keyof Required<CactusTheme>['mediaQueries']

export const media = (theme: CactusTheme, query: MediaQuery): string | undefined =>
  theme.mediaQueries && theme.mediaQueries[query]
