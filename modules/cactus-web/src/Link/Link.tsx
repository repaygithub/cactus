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
  position: relative;

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
    color: ${p => p.theme.colors.base};
    ::after {
      content: '';
      display: block;
      position: absolute;
      height: calc(100% + 6px);
      width: calc(100% + 6px);
      top: -5px;
      left: -5px;
      border: 2px solid ${p => p.theme.colors.callToAction};
      border-radius: 4px;
    }
  }

  ${margins};
`

export default Link
