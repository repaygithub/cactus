import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { omitMargins } from '../helpers/omit'

interface LinkProps extends MarginProps, Omit<React.LinkHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string
}

const LinkBase = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const { to, ...rest } = omitMargins(props)

  return <a ref={ref} href={to} {...rest} />
})

export const Link = styled(LinkBase)`
  font-style: italic;
  outline: none;
  position: relative;

  :link {
    color: ${(p): string => p.theme.colors.callToAction};
  }

  :visited {
    color: ${(p): string => p.theme.colors.mediumContrast};
  }

  :hover {
    color: ${(p): string => p.theme.colors.base};
  }

  :focus {
    color: ${(p): string => p.theme.colors.callToAction};
    background-color: ${(p): string => p.theme.colors.transparentCTA};
  }

  ${margin};
`

Link.propTypes = {
  to: PropTypes.string.isRequired,
}

export default Link
