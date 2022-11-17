import { border, CactusTheme, colorStyle, radius, shadow, space } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import { space as marginPadding, SpaceProps } from 'styled-system'

import { allWidth, AllWidthProps, flexItem, FlexItemProps, withStyles } from '../helpers/styled'

interface CardProps extends SpaceProps, AllWidthProps, FlexItemProps {
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

export const Card = withStyles('div', {
  displayName: 'Card',
  transitiveProps: ['useBoxShadow'],
  styles: [flexItem, allWidth, marginPadding],
})<CardProps>`
  box-sizing: border-box;
  ${colorStyle('standard')};
  border-radius: ${radius(8)};
  padding: ${space(4)};
  ${getBoxShadow}
`

Card.defaultProps = {
  useBoxShadow: true,
}

Card.propTypes = {
  useBoxShadow: PropTypes.bool,
}

export default Card
