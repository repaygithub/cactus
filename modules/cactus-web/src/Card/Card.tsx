import { BorderSize, CactusTheme, ColorStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { margin, MarginProps, padding, PaddingProps, width, WidthProps } from 'styled-system'

import { flexItem, FlexItemProps } from '../helpers/flexItem'
import { boxShadow, radius } from '../helpers/theme'

interface CardProps extends MarginProps, WidthProps, PaddingProps, FlexItemProps {
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

const getBorder = (borderSize: BorderSize): ReturnType<typeof css> => borderMap[borderSize]
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
  ${flexItem}
  ${(p): ColorStyle => p.theme.colorStyles.standard};
  border-radius: ${radius(8)};
  padding: ${(p): number => p.theme.space[4]}px;
  ${padding}
  ${(p): ReturnType<typeof css> => getBoxShadow(p.theme, p.useBoxShadow)}
`

Card.defaultProps = {
  useBoxShadow: true,
}

Card.propTypes = {
  useBoxShadow: PropTypes.bool,
}

export default Card
