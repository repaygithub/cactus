import { BorderSize, CactusTheme, Shape } from '@repay/cactus-theme'
import styled, { css } from 'styled-components'
import { margin, MarginProps, width, WidthProps } from 'styled-system'

import { boxShadow } from '../helpers/theme'

interface CardProps extends MarginProps, WidthProps {}

const borderMap: { [K in BorderSize]: ReturnType<typeof css> } = {
  thin: css`
    border: 1px solid;
  `,
  thick: css`
    border: 2px solid;
  `,
}

const shapeMap: { [K in Shape]: ReturnType<typeof css> } = {
  square: css`
    border-radius: 1px;
  `,
  intermediate: css`
    border-radius: 4px;
  `,
  round: css`
    border-radius: 8px;
  `,
}

const getBorder = (borderSize: BorderSize) => borderMap[borderSize]
const getShape = (shape: Shape) => shapeMap[shape]
const getBoxShadow = (theme: CactusTheme) => {
  return theme.boxShadows
    ? css`
        ${(p) => `${boxShadow(p.theme, 1)};
        :hover {
          ${boxShadow(p.theme, 2)};
        }`}
      `
    : css`
    ${getBorder(theme.border)}
    border-color: ${theme.colors.lightContrast};
  `
}

export const Card = styled.div<CardProps>`
  box-sizing: border-box;
  ${margin}
  ${width}
  ${(p) => p.theme.colorStyles.standard};
  ${(p) => getShape(p.theme.shape)}
  padding: ${(p) => p.theme.space[4]}px;
  ${(p) => getBoxShadow(p.theme)}

  & > & {
    padding: ${(p) => p.theme.space[5]}px;
    color: pink;
  }
  & > & > & {
    padding: ${(p) => p.theme.space[6]}px;
    color: blue;
  }
`

export default Card
