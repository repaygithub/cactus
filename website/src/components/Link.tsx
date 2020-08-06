import { Link as RepayLink } from '@repay/cactus-web'
import { Link as GatsbyLink } from 'gatsby'
import React from 'react'

const LocalLink = RepayLink.withComponent(GatsbyLink)

interface LinkProps {
  href?: string
  to?: string
  [k: string]: any
}

const isOutside = (href: string): boolean =>
  href.startsWith('http') && !(global.window && href.startsWith(window.location.origin))

const Link = ({ href, to, ...rest }: LinkProps): React.ReactElement => {
  to = to || href || ''
  if (isOutside(to)) {
    return <RepayLink to={to} {...rest} />
  }
  return <LocalLink to={to} {...rest} />
}

export default Link
