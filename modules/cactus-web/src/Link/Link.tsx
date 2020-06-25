import React from 'react'

import { margin, MarginProps } from 'styled-system'
import { Omit } from '../types'
import { omitMargins } from '../helpers/omit'
import PropTypes from 'prop-types'
import styled from 'styled-components'

interface LinkProps
  extends MarginProps,
    Omit<
      React.DetailedHTMLProps<React.LinkHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
      'href'
    > {
  to: string
}

const LinkBase = (props: LinkProps) => {
  const { to, ...rest } = omitMargins(props)

  return <a href={to} {...rest} />
}

export const Link = styled(LinkBase)`
  font-style: italic;
  outline: none;
  position: relative;

  :link {
    color: ${(p) => p.theme.colors.callToAction};
  }

  :visited {
    color: ${(p) => p.theme.colors.mediumContrast};
  }

  :hover {
    color: ${(p) => p.theme.colors.base};
  }

  :focus {
    color: ${(p) => p.theme.colors.callToAction};
    background-color: ${(p) => p.theme.colors.transparentCTA};
  }

  ${margin};
`

// @ts-ignore
Link.propTypes = {
  to: PropTypes.string.isRequired,
}

export default Link
