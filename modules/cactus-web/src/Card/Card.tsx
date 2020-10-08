import { BorderSize, CactusTheme, ColorStyle, Shape } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { margin, MarginProps, padding, PaddingProps, width, WidthProps } from 'styled-system'

import { boxShadow } from '../helpers/theme'

interface CardProps extends MarginProps, WidthProps, PaddingProps {
  useBoxShadow?: boolean
}

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

const getBorder = (borderSize: BorderSize): ReturnType<typeof css> => borderMap[borderSize]
const getShape = (shape: Shape): ReturnType<typeof css> => shapeMap[shape]
const getBoxShadow = (theme: CactusTheme, useBoxShadow?: boolean): ReturnType<typeof css> => {
  return theme.boxShadows && useBoxShadow
    ? css`
        ${(p): string => `${boxShadow(p.theme, 1)};
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
  ${(p): ColorStyle => p.theme.colorStyles.standard};
  ${(p): ReturnType<typeof css> => getShape(p.theme.shape)}
  padding: ${(p): number => p.theme.space[4]}px;
  ${padding}
  ${(p): ReturnType<typeof css> => getBoxShadow(p.theme, p.useBoxShadow)}

  & > & {
    padding: ${(p): number => p.theme.space[5]}px;
  }
  & > & > & {
    padding: ${(p): number => p.theme.space[6]}px;
  }
`

Card.defaultProps = {
  useBoxShadow: true,
}

Card.propTypes = {
  useBoxShadow: PropTypes.bool,
}

export default Card
