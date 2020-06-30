import { border } from '../helpers/theme'
import { keyPressAsClick } from '../helpers/a11y'
import { margin, MarginProps } from 'styled-system'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

type NavDirection = 'prev' | 'next'

interface PrevNextProps extends MarginProps {
  className?: string
  disablePrev?: boolean
  disableNext?: boolean
  linkAs?: React.ElementType
  onNavigate?: (direction: NavDirection) => void
  prevText?: string
  nextText?: string
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
}) => (
  <a
    role="link"
    aria-disabled={disabled ? 'true' : 'false'}
    className={className}
    onClick={onClick}
    onKeyPress={onClick && keyPressAsClick(onClick)}
    tabIndex={disabled ? undefined : 0}
  >
    {children}
  </a>
)

const PrevNextLink = styled(PrevNextLinkBase)`
  cursor: pointer;
  padding: 0 10px;
  ${(p) => p.theme.textStyles.small};
  line-height: 20px;
  text-decoration: none;

  :hover {
    color: ${(p) => p.theme.colors.callToAction};
  }

  :focus {
    outline: none;
    color: ${(p) => p.theme.colors.callToAction};
  }

  :last-child {
    border-left: ${(p) => border(p.theme, 'lightContrast')};
  }

  &[aria-disabled='true'] {
    color: ${(p) => p.theme.colors.lightGray};
    cursor: default;
  }
`

const PrevNextBase: React.FC<PrevNextProps> = ({
  disablePrev = false,
  disableNext = false,
  linkAs,
  onNavigate = () => {},
  prevText,
  nextText,
}) => (
  <>
    <PrevNextLink
      as={linkAs}
      disabled={disablePrev}
      onClick={() => !disablePrev && onNavigate('prev')}
    >
      {prevText}
    </PrevNextLink>
    <PrevNextLink
      as={linkAs}
      disabled={disableNext}
      onClick={() => !disableNext && onNavigate('next')}
    >
      {nextText}
    </PrevNextLink>
  </>
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
  prevText: PropTypes.string,
  nextText: PropTypes.string,
}

PrevNext.defaultProps = {
  onNavigate: () => {},
  prevText: 'Prev',
  nextText: 'Next',
}

export default PrevNext
