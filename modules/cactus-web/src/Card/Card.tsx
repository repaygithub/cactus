import { margin, MarginProps, width, WidthProps } from 'styled-system'
import styled from 'styled-components'

interface CardProps extends MarginProps, WidthProps {}

export const Card = styled.div<CardProps>`
  box-sizing: border-box;
  ${margin}
  ${width}
  ${p => p.theme.colorStyles.standard};
  border-radius: 8px;
  padding: ${p => p.theme.space[4]}px;
  box-shadow: 0 3px 6px 0 ${p => p.theme.colors.callToAction};

  :hover {
    box-shadow: 0 4px 8px 0 ${p => p.theme.colors.callToAction};
  }

  & > & {
    padding: ${p => p.theme.space[5]}px;
    color: pink;
  }
  & > & > & {
    padding: ${p => p.theme.space[6]}px;
    color: blue;
  }
`

export default Card
