import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { keyPressAsClick } from '../helpers/a11y'
import { border, fontSize } from '../helpers/theme'

type NavDirection = 'prev' | 'next'

export interface PrevNextProps extends MarginProps {
  className?: string
  disablePrev?: boolean
  disableNext?: boolean
  linkAs?: React.ElementType
  onNavigate?: (direction: NavDirection) => void
  prevText?: React.ReactNode
  nextText?: React.ReactNode
}

interface PrevNextLinkProps {
  className?: string
  disabled: boolean
  onClick?: () => void
}

const PrevNextLinkBase: React.FC<PrevNextLinkProps> = ({
  children,
  className,
  disabled,
  onClick,
}): React.ReactElement => (
  <a
    role="link"
    aria-disabled={disabled ? 'true' : 'false'}
    className={className}
    onClick={onClick}
    onKeyPress={onClick && keyPressAsClick}
    tabIndex={disabled ? undefined : 0}
  >
    {children}
  </a>
)

const PrevNextLink = styled(PrevNextLinkBase)`
  cursor: pointer;
  padding: 0 10px;
  ${(p): string => fontSize(p.theme, 'small')};
  line-height: 20px;
  text-decoration: none;

  :hover {
    color: ${(p): string => p.theme.colors.callToAction};
  }

  :focus {
    outline: none;
    color: ${(p): string => p.theme.colors.callToAction};
  }

  :last-child {
    border-left: ${(p): string => border(p.theme, 'lightContrast')};
  }

  &[aria-disabled='true'] {
    color: ${(p): string => p.theme.colors.lightGray};
    cursor: default;
  }
`

const PrevNextBase: React.FC<PrevNextProps> = ({
  className,
  disablePrev = false,
  disableNext = false,
  linkAs,
  onNavigate = (): void => {
    return
  },
  prevText,
  nextText,
  ...rest
}): React.ReactElement => (
  <div className={className} {...rest}>
    <PrevNextLink
      as={linkAs}
      disabled={disablePrev}
      onClick={(): void | boolean => !disablePrev && onNavigate('prev')}
    >
      {prevText}
    </PrevNextLink>
    <PrevNextLink
      as={linkAs}
      disabled={disableNext}
      onClick={(): void | boolean => !disableNext && onNavigate('next')}
    >
      {nextText}
    </PrevNextLink>
  </div>
)

export const PrevNext = styled(PrevNextBase)`
  ${margin}
`

PrevNext.displayName = 'PrevNext'

const linkAsPropType = PropTypes.elementType as PropTypes.Validator<React.ElementType>

PrevNext.propTypes = {
  className: PropTypes.string,
  disablePrev: PropTypes.bool,
  disableNext: PropTypes.bool,
  linkAs: linkAsPropType,
  onNavigate: PropTypes.func,
  prevText: PropTypes.node,
  nextText: PropTypes.node,
}

PrevNext.defaultProps = {
  onNavigate: (): void => {
    return
  },
  prevText: 'Prev',
  nextText: 'Next',
}

export default PrevNext
