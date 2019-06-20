import React from 'react'

import { MarginProps, margins, splitProps } from '../helpers/margins'
import { Omit } from '../types'
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
  const { to, ...rest } = splitProps(props)

  return <a href={to} {...rest} />
}

export const Link = styled(LinkBase)`
  font-style: italic;
  outline: none;
  position: relative;

  :link {
    color: ${p => p.theme.colors.callToAction};
  }

  :visited {
    color: ${p => p.theme.colors.mediumContrast};
  }

  :hover {
    color: ${p => p.theme.colors.base};
  }

  :focus {
    color: ${p => p.theme.colors.callToAction};
    background-color: ${p => p.theme.colors.transparentCTA};
  }

  ${margins};
`

// @ts-ignore
Link.propTypes = {
  to: PropTypes.string.isRequired,
}

export default Link
