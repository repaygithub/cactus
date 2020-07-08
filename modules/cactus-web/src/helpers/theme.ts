import { CactusColor, CactusTheme, ColorStyle } from '@repay/cactus-theme'

export const border = (theme: CactusTheme, color: string) => {
  const thickness = theme.border === 'thick' ? '2px' : '1px'
  return `${thickness} solid ${theme.colors[color as CactusColor] || color}`
}

export const invertColors = (style: ColorStyle) => {
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

export const boxShadow = (theme: CactusTheme, shadowType: number) => {
  if (theme.boxShadows) {
    return `box-shadow: ${shadowTypes[shadowType]} ${theme.colors.transparentCTA}`
  }
}
