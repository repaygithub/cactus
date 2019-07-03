import { CactusColor, CactusTheme, ColorStyle } from '@repay/cactus-theme'

export const border = (theme: CactusTheme, color: CactusColor) => {
  const thickness = theme.border === 'thick' ? '2px' : '1px'
  return `${thickness} solid ${theme.colors[color]}`
}

export const invertColors = (style: ColorStyle) => {
  return { color: style.backgroundColor, backgroundColor: style.color }
}
