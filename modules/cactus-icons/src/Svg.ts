import styled from 'styled-components'
import { space, SpaceProps, color, ColorProps, width, WidthProps } from 'styled-system'

interface SvgProps extends SpaceProps, ColorProps, WidthProps {}

const Svg = styled.svg<SvgProps>`
  vertical-align: middle;
  ${space}
  ${color}
  ${width}
`

export default Svg
