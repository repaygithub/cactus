import styled from 'styled-components'
import { space, SpaceProps, color, ColorProps, width, WidthProps } from 'styled-system'

interface SvgProps extends SpaceProps, ColorProps, WidthProps {}

const Svg = styled.svg<SvgProps>`
  ${space}
  ${color}
  ${width}
`

export default Svg
