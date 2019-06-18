import { Link as GatsbyLink } from 'gatsby'
import { Link as RepayLink } from '@repay/cactus-web'
import React from 'react'

const LocalLink = RepayLink.withComponent(GatsbyLink)

const isOutside = (href: string) =>
  href.startsWith('http') && !(global.window && href.startsWith(window.location.origin))

const Link = ({ href, to, ...rest }: any) => {
  to = to || href || ''
  if (isOutside(to)) {
    return <RepayLink to={to} {...rest} />
  }
  return <LocalLink to={to} {...rest} />
}

export default Link
