import { NavigationChevronRight } from '@repay/cactus-icons'
import { CactusTheme } from '@repay/cactus-theme'
import React from 'react'
import styled, { StyledComponentBase } from 'styled-components'

import Link from '../Link/Link'

interface BreadcrumbItemProps {
  label: string
  linkTo: string
  className?: string
  active?: boolean
}
interface BreadcrumbProps {
  children?: React.ReactNode
  className?: string
}

const BreadcrumbItemBase = (props: BreadcrumbItemProps) => {
  const { active, label, linkTo, className } = props
  return (
    <li className={className}>
      <a href={linkTo} aria-current={active && 'page'}>
        {label}
      </a>
      <NavigationChevronRight iconSize="tiny" />
    </li>
  )
}
const BreadCrumbBase = (props: BreadcrumbProps) => {
  const { children, className } = props
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ul>{children}</ul>
    </nav>
  )
}

interface BreadcrumbComponent extends StyledComponentBase<'ul', CactusTheme, BreadcrumbProps> {
  Item: React.ComponentType<BreadcrumbItemProps>
}

export const BreadCrumbItem = styled(BreadcrumbItemBase)`
  color: black;
  font-style: normal;
  a:visited,
  a:link {
    color: ${(p) => (p.active ? '#2E3538' : '#5F7A88')};
    font-style: normal;
    font-size: 15px;
    text-decoration: none;
  }

  & > svg {
    color: ${(p) => (p.active ? '#2E3538' : '#5F7A88')};
    margin: 0 3px;
    font-size: 10px;
  }
`

export const Breadcrumb = styled(BreadCrumbBase)`
  > ul {
    display: flex;
    flex-direction: row;
    list-style: none;
  }
` as any

Breadcrumb.Item = BreadCrumbItem

export default Breadcrumb as BreadcrumbComponent
