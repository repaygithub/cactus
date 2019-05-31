import React, { useRef } from 'react'

import { MarginProps, margins } from '../helpers/margins'
import { Omit } from '../types'
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
  const { className, to, children, ...rest } = props

  return (
    <a className={className} href={to} {...rest}>
      {children}
    </a>
  )
}

export const Link = styled(LinkBase)`
  font-style: italic;
  outline: none;

  :link {
    color: ${p => p.theme.colors.callToAction};
  }

  :visited {
    color: hsl(210, 50%, 35%);
  }

  :hover {
    color: ${p => p.theme.colors.base};
  }

  :focus {
    padding: 1px 2px 1px 1px;
    border-radius: 4px;
    color: ${p => p.theme.colors.base};
    border: 2px solid ${p => p.theme.colors.callToAction};
  }

  ${p => p.theme.textStyles.body};
  ${margins};
`

export default Link
