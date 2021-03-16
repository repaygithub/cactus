import { NavigationChevronRight } from '@repay/cactus-icons'
import React from 'react'
import styled from 'styled-components'

import { AsProps, GenericComponent } from '../helpers/asProps'
import { borderSize, textStyle } from '../helpers/theme'

type BreadcrumbItemProps<C extends GenericComponent> = AsProps<C> & {
  active?: boolean
}

interface BreadcrumbProps {
  children?: React.ReactNode
  className?: string
}

export const BreadcrumbItem = <C extends GenericComponent = 'a'>(
  props: BreadcrumbItemProps<C>
): React.ReactElement => {
  const { active, ...rest } = props

  // The "as any" with ...rest is necessary because Styled Components' types do not like
  // forcing an aria-current when we're not sure if the element will be an <a>
  // Here, we're just trusting the user to use a Link-ish component for the "as" prop
  return (
    <li>
      <BreadcrumbLink aria-current={active && 'page'} {...(rest as any)} />
      <StyledChevron iconSize="tiny" $active={active} />
    </li>
  )
}

export const BreadcrumbActive = (
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement => <div aria-current="page" {...props} />

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
  outline: none;
  &:visited,
  &:link {
    color: ${(p) => p.theme.colors.darkContrast};
    font-style: normal;
  }
  &:hover {
    color: ${(p) => p.theme.colors.callToAction};
  }
  &:focus {
    outline: ${(p) => `${p.theme.colors.callToAction} solid ${borderSize(p)}`};
  }
`

const StyledChevron = styled(NavigationChevronRight)<{ $active?: boolean }>`
  color: ${(p): string =>
    p.$active ? p.theme.colors.darkestContrast : p.theme.colors.mediumContrast};
  margin: 0 3px;
  font-size: 10px;
`

const StyledNav = styled.nav`
  ${(p) => textStyle(p.theme, 'small')}

  > ul {
    display: flex;
    flex-direction: row;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  [aria-current='page'] {
    color: ${(p) => p.theme.colors.darkestContrast};
    font-style: italic;
  }
`

type BreadcrumbComponent = typeof BreadcrumbBase & {
  Item: typeof BreadcrumbItem
  Active: typeof BreadcrumbActive
}

export const Breadcrumb = BreadcrumbBase as BreadcrumbComponent
Breadcrumb.Item = BreadcrumbItem
Breadcrumb.Active = BreadcrumbActive

export default Breadcrumb
