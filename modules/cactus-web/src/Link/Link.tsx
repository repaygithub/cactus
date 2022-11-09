import PropTypes from 'prop-types'
import React from 'react'
import { margin, MarginProps } from 'styled-system'

import { withStyles } from '../helpers/styled'

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

export const Link = withStyles(LinkBase, {
  displayName: 'Link',
  transitiveProps: ['variant'],
  styles: [margin],
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
`

Link.propTypes = {
  to: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['standard', 'dark']),
}

export default Link
