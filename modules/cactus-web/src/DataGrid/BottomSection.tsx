import PropTypes from 'prop-types'
import React, { useContext } from 'react'
import styled from 'styled-components'

import { DataGridContext, getMediaQuery } from './helpers'
import { TransientProps } from './types'

export interface BottomSectionProps {
  children?: React.ReactNode
}

const BottomSection: React.FC<BottomSectionProps> = (props) => {
  const { children } = props
  const { isCardView, cardBreakpoint } = useContext(DataGridContext)
  return (
    <StyledBottomSection $isCardView={isCardView} $cardBreakpoint={cardBreakpoint}>
      {children}
    </StyledBottomSection>
  )
}

const StyledBottomSection = styled.div<TransientProps>`
  // Card view styles
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  padding: 0 16px;

  // Non-card view styles
  ${getMediaQuery} {
    flex-direction: row;
  }

  // Card view styles when screen is larger than tiny
  ${(p) =>
    p.$isCardView &&
    p.theme.mediaQueries &&
    `${p.theme.mediaQueries.small} {
      flex-direction: row;
      margin-top: 16px;
    }`}
`

BottomSection.propTypes = {
  children: PropTypes.node,
}

BottomSection.displayName = 'BottomSection'

export default BottomSection
