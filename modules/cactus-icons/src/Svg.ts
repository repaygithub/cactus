import {
  color,
  ColorProps,
  get,
  px,
  space,
  SpaceProps,
  style,
  width,
  WidthProps,
} from 'styled-system'
import styled from 'styled-components'

export type IconSizes = 'tiny' | 'small' | 'medium' | 'large'
interface SvgProps extends SpaceProps, ColorProps, WidthProps {
  iconSize?: IconSizes
}

const iconSizes = style({
  prop: 'iconSize',
  cssProperty: 'fontSize',
  key: 'iconSizes',
  transformValue: (size, scale) => px(get(scale, size)),
})

const Svg = styled.svg<SvgProps>`
  vertical-align: middle;
  ${space}
  ${color}
  ${width}
  ${iconSizes}
`

export default Svg
