import { MarginProps, margins } from '../helpers/margins'
import styled from 'styled-components'

interface CardProps extends MarginProps {}

export const Card = styled.div<CardProps>`
  ${margins}
  ${p => p.theme.colorStyles.standard};
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 3px 6px 0 ${p => p.theme.colors.callToAction};

  :hover {
    box-shadow: 0 4px 8px 0 ${p => p.theme.colors.callToAction};
  }
`

export default Card
