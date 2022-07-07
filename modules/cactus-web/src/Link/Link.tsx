import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { getOmittableProps } from '../helpers/omit'

interface AnchorProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string
}

interface LinkStyleProps extends MarginProps {
  variant?: 'standard' | 'dark'
}

export interface LinkProps extends AnchorProps, LinkStyleProps {}

const LinkBase = React.forwardRef<HTMLAnchorElement, AnchorProps>((props, ref) => {
  const { to, ...rest } = props

  return <a ref={ref} href={to} {...rest} />
})

const styleProps = getOmittableProps(margin, 'variant')
export const Link = styled(LinkBase).withConfig({
  shouldForwardProp: (p) => !styleProps.has(p),
})<LinkStyleProps>`
  font-style: italic;
  outline: none;

  :link {
    color: ${(p): string =>
      p.variant === 'dark' ? p.theme.colors.darkContrast : p.theme.colors.callToAction};
  }

  :visited {
    color: ${(p): string =>
      p.variant === 'dark' ? p.theme.colors.darkContrast : p.theme.colors.mediumContrast};
  }

  :hover {
    color: ${(p): string => p.theme.colors.base};
  }

  :focus {
    color: ${(p): string => p.theme.colors.callToAction};
    background-color: ${(p): string => p.theme.colors.lightCallToAction};
  }

  ${margin};
`

Link.propTypes = {
  to: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['standard', 'dark']),
}

export default Link
