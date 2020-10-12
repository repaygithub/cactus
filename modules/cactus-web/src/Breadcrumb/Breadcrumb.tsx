import { NavigationChevronRight } from '@repay/cactus-icons'
import React from 'react'
import styled from 'styled-components'

interface BreadcrumbItemProps {
  linkTo: string
  className?: string
  active?: boolean
  children?: React.ReactNode
}

interface BreadcrumbProps {
  children?: React.ReactNode
  className?: string
}

export const BreadcrumbItem = (props: BreadcrumbItemProps): React.ReactElement => {
  const { active, children, linkTo, className } = props
  return (
    <li className={className}>
      <BreadcrumbLink href={linkTo} aria-current={active && 'page'}>
        {children}
      </BreadcrumbLink>
      <StyledChevron iconSize="tiny" active={active} />
    </li>
  )
}

const BreadcrumbBase = (props: BreadcrumbProps): React.ReactElement => {
  const { children, className } = props
  return (
    <StyledNav aria-label="Breadcrumb" className={className}>
      <ul>{children}</ul>
    </StyledNav>
  )
}

const BreadcrumbLink = styled.a`
  color: black;
  font-style: normal;
  &:visited,
  &:link {
    color: #5f7a88;
    font-style: normal;
    font-size: 15px;
    text-decoration: none;
  }
  &[aria-current='page'] {
    color: #2e3538;
  }
`

const StyledChevron = styled(NavigationChevronRight)<{ active?: boolean }>`
  color: ${(p): string => (p.active ? '#2E3538' : '#5F7A88')};
  margin: 0 3px;
  font-size: 10px;
`

const StyledNav = styled.nav`
  > ul {
    display: flex;
    flex-direction: row;
    list-style: none;
  }
`

type BreadcrumbComponent = typeof BreadcrumbBase & {
  Item: React.ComponentType<BreadcrumbItemProps>
}

export const Breadcrumb = BreadcrumbBase as BreadcrumbComponent
Breadcrumb.Item = BreadcrumbItem

export default Breadcrumb
