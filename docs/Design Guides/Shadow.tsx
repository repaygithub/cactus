import { boxShadow } from '@repay/cactus-web/src/helpers/theme'
import styled from 'styled-components'

export const Shadow = styled.div<{ shadowType: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 80px 24px 24px;
  ${(p) => boxShadow(p.theme, p.shadowType)}
`
