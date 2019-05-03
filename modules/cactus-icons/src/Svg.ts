import { color, ColorProps, space, SpaceProps, width, WidthProps } from 'styled-system'
import styled from 'styled-components'

interface SvgProps extends SpaceProps, ColorProps, WidthProps {}

const Svg = styled.svg<SvgProps>`
  vertical-align: middle;
  ${space}
  ${color}
  ${width}
`

export default Svg
