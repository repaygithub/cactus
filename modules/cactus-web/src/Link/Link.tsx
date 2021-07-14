import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { omitMargins } from '../helpers/omit'

export interface LinkProps
  extends MarginProps,
    Omit<React.LinkHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string
  variant?: 'standard' | 'dark'
}

const LinkBase = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const { to, ...rest } = omitMargins(props)

  return <a ref={ref} href={to} {...rest} />
})

export const Link = styled(LinkBase).withConfig({
  shouldForwardProp: (prop) => prop !== 'variant',
})`
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

Link.defaultProps = {
  variant: 'standard',
}

export default Link
