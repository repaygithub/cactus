import {
  BorderSize,
  CactusColor,
  CactusTheme,
  ColorStyle,
  Shape,
  TextStyle,
  TextStyleCollection,
} from '@repay/cactus-theme'
import { css, FlattenSimpleInterpolation } from 'styled-components'

export type Props = { theme: CactusTheme }

type ThicknessOpts = { [K in BorderSize]?: number }

export const borderSize = (props: Props): string => (props.theme.border === 'thick' ? '2px' : '1px')

export const border = (
  theme: CactusTheme,
  color: string,
  { thin = 1, thick = 2 }: ThicknessOpts = {}
): string => {
  const thickness = theme.border === 'thick' ? thick : thin
  return `${thickness}px solid ${theme.colors[color as CactusColor] || color}`
}

export type Direction = 'top' | 'bottom' | 'left' | 'right'

export const insetBorder = (
  theme: CactusTheme,
  color: string,
  direction?: Direction,
  { thin = 1, thick = 2 }: ThicknessOpts = {}
): string => {
  let hOffset = 0,
    vOffset = 0,
    spread = 0
  const thickness = theme.border === 'thick' ? thick : thin
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

export const radius =
  (maxRadius: MaxRadius) =>
  ({ theme }: Props): string =>
    radiiMap[maxRadius][theme.shape]

type PopupType = 'dialog' | 'menu'

const popupShapeMap: { [K in PopupType]: { [K in Shape]: ReturnType<typeof css> } } = {
  dialog: {
    square: css`
      border-radius: 0 2px 1px 1px;
    `,
    intermediate: css`
      border-radius: 0 20px 10px 10px;
    `,
    round: css`
      border-radius: 0 32px 16px 16px;
    `,
  },
  menu: {
    square: css`
      border-radius: 0 0 1px 1px;
    `,
    intermediate: css`
      border-radius: 0 0 4px 4px;
    `,
    round: css`
      border-radius: 0 0 8px 8px;
    `,
  },
}

export const popupShape = (popupType: PopupType, shape: Shape): ReturnType<typeof css> =>
  popupShapeMap[popupType][shape]

export const popupBoxShadow = (theme: CactusTheme): ReturnType<typeof css> => {
  return theme.boxShadows
    ? css`
        ${boxShadow(theme, 1)};
      `
    : css`
        border: ${(p) => borderSize(p)} solid;
        border-color: ${theme.colors.lightContrast};
      `
}

export const invertColors = (style: ColorStyle): ColorStyle => {
  return { color: style.backgroundColor, backgroundColor: style.color }
}

export const shadowTypes = [
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

/* Detects if the user is using a mobile/touch device which falls under either the SMALL or TINY breakpoint
category AND that the site they are on is optimized for a device of that size */
export const isResponsiveTouchDevice = (
  breakpoints: Required<CactusTheme>['breakpoints']
): boolean => {
  return (
    typeof window !== 'undefined' &&
    typeof screen !== 'undefined' &&
    window.innerWidth < Number(breakpoints[0].split('px')[0]) &&
    'ontouchstart' in window &&
    screen.width === window.innerWidth
  )
}
