import PropTypes from 'prop-types'
import React, { useContext } from 'react'
import styled, { useTheme } from 'styled-components'

import { cloneAll } from '../helpers/react'
import { textStyle } from '../helpers/theme'
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
  const { isCardView, cardBreakpoint, variant } = useContext(DataGridContext)
  const screenSize = useContext(ScreenSizeContext)
  const { space } = useTheme()

  const margin = typeof spacing === 'number' ? `${space[spacing]}px` : spacing
  const isTinyScreen = screenSize.toString() === 'tiny'

  return (
    <StyledBottomSection
      $isCardView={isCardView}
      $cardBreakpoint={cardBreakpoint}
      $justifyContent={justifyContent}
      $variant={variant}
    >
      {cloneAll(
        children,
        {
          style: isTinyScreen ? { marginTop: margin } : { marginLeft: margin },
        },
        (element: React.ReactElement, cloneProps: any, index): React.ReactElement => {
          if (index === 0) {
            return element
          }
          return React.cloneElement(element, cloneProps)
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
  margin-top: ${(p) => (p.$variant === 'mini' ? `${p.theme.space[3]}px` : `${p.theme.space[7]}px`)};
  ${(p) => textStyle(p.theme, p.$variant === 'mini' ? 'small' : 'body')}

  // Non-card view styles
  ${getMediaQuery} {
    flex-direction: row;
    ${(p) => `justify-content: ${p.$justifyContent};`}
  }

  // Card view styles when screen is larger than tiny
  ${(p) =>
    p.$isCardView &&
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
