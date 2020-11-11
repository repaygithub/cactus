import PropTypes from 'prop-types'
import React, { useContext } from 'react'
import styled, { useTheme } from 'styled-components'

import { cloneAll } from '../helpers/react'
import { ScreenSizeContext } from '../ScreenSizeProvider/ScreenSizeProvider'
import { DataGridContext, getMediaQuery } from './helpers'
import { JustifyContent, TransientProps } from './types'

export interface BottomSectionProps {
  justifyContent?: JustifyContent
  spacing?: string | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  children?: React.ReactNode
}

const BottomSection = (props: BottomSectionProps): React.ReactElement | null => {
  const { children, justifyContent = 'space-between', spacing = 4 } = props
  const { isCardView, cardBreakpoint } = useContext(DataGridContext)
  const screenSize = useContext(ScreenSizeContext)
  const { space } = useTheme()

  const margin = typeof spacing === 'number' ? `${space[spacing]}px` : spacing
  const isTinyScreen = screenSize.toString() === 'tiny'

  return (
    <StyledBottomSection
      $isCardView={isCardView}
      $cardBreakpoint={cardBreakpoint}
      $justifyContent={justifyContent}
    >
      {cloneAll(
        children,
        {
          style: isTinyScreen ? { marginTop: margin } : { marginLeft: margin },
        },
        (element: React.ReactElement, props: any): React.ReactElement => {
          if (element.key === '.0') {
            return element
          }
          return React.cloneElement(element, props)
        }
      )}
    </StyledBottomSection>
  )
}

const StyledBottomSection = styled.div<TransientProps & { $justifyContent: JustifyContent }>`
  // Card view styles
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  padding: 0 16px;

  // Non-card view styles
  ${getMediaQuery} {
    flex-direction: row;
    ${(p) => `justify-content: ${p.$justifyContent};`}
  }

  // Card view styles when screen is larger than tiny
  ${(p) =>
    p.$isCardView &&
    p.theme.mediaQueries &&
    `${p.theme.mediaQueries.small} {
      flex-direction: row;
      justify-content: ${p.$justifyContent};
      margin-top: 16px;
    }`}
`

BottomSection.defaultProps = {
  justifyContent: 'space-between',
  spacing: 4,
}

BottomSection.propTypes = {
  justifyContent: PropTypes.oneOf([
    'unset',
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'space-evenly',
  ]),
  spacing: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7])]),
  children: PropTypes.node,
}

BottomSection.displayName = 'BottomSection'

export default BottomSection
