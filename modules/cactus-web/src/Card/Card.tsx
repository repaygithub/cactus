import { border, CactusTheme, colorStyle, radius, shadow, space } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  compose,
  maxWidth,
  MaxWidthProps,
  space as marginPadding,
  SpaceProps,
  width,
  WidthProps,
} from 'styled-system'

import { getOmittableProps } from '../helpers/omit'
import { flexItem, FlexItemProps } from '../helpers/styled'

interface CardProps extends SpaceProps, WidthProps, MaxWidthProps, FlexItemProps {
  useBoxShadow?: boolean
}

const getBoxShadow = (props: CardProps & { theme: CactusTheme }) => {
  return props.theme.boxShadows && props.useBoxShadow
    ? `
        ${shadow(props, 1)};
        :hover {
          ${shadow(props, 2)};
        }
      `
    : `border: ${border(props, 'lightContrast')};`
}

const styleProps = getOmittableProps(flexItem, maxWidth, marginPadding, width, 'useBoxShadow')
export const Card = styled.div.withConfig({
  shouldForwardProp: (p) => !styleProps.has(p),
})<CardProps>`
  box-sizing: border-box;
  ${colorStyle('standard')};
  border-radius: ${radius(8)};
  padding: ${space(4)};
  ${getBoxShadow}
  && {
    ${compose(flexItem, maxWidth, marginPadding, width)}
  }
`

Card.defaultProps = {
  useBoxShadow: true,
}

Card.propTypes = {
  useBoxShadow: PropTypes.bool,
}

export default Card
