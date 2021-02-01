import {
  NavigationChevronLeft,
  NavigationChevronRight,
  NavigationFirst,
  NavigationLast,
  NavigationMenuDots,
} from '@repay/cactus-icons'
import { ColorStyle } from '@repay/cactus-theme'
import pick from 'lodash/pick'
import PropTypes from 'prop-types'
import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { keyDownAsClick, preventAction } from '../helpers/a11y'
import { border, fontSize } from '../helpers/theme'

export interface PageLinkProps {
  'aria-label': string
  'aria-current'?: 'page'
  page: number
  disabled: boolean
  children: React.ReactChild
  rel?: string
  className?: string
  onClick?: () => void
}

export interface PaginationProps extends MarginProps {
  pageCount: number
  currentPage: number
  className?: string
  onPageChange?: (page: number) => void
  linkAs?: React.ComponentType<PageLinkProps>
  label?: string
  currentPageLabel?: string
  prevPageLabel?: string
  nextPageLabel?: string
  lastPageLabel?: string
  makeLinkLabel?: (page: number) => string
}

interface CommonPageProps {
  currentPage: number
  className?: string
  'aria-label': string
  'aria-current'?: 'page'
  linkAs?: React.ComponentType<PageLinkProps>
  pageChangeHandler: (page: number) => (() => void) | undefined
}

interface PageProps extends CommonPageProps {
  page: number
  rel?: string
  children: React.ReactChild
}

const PageButton = (props: PageProps): ReactElement => {
  const { page, currentPage, linkAs, pageChangeHandler, children, ...rest } = props
  const disabled = page === currentPage
  return (
    <PageItem>
      <PageLink
        page={page}
        as={linkAs}
        onClick={disabled ? undefined : pageChangeHandler(page)}
        disabled={disabled}
        {...rest}
      >
        {children}
      </PageLink>
    </PageItem>
  )
}

function getPageButton(page: number, props: CommonPageProps, label: string): ReactElement {
  if (page === props.currentPage) {
    props = { ...props, 'aria-current': 'page' }
  } else {
    props = { ...props, 'aria-label': label }
  }
  return (
    <PageButton key={page} page={page} {...props}>
      {page}
    </PageButton>
  )
}

function dots(key: string): ReactElement {
  return (
    <PageItem key={key}>
      <RotatedMenuDots />
    </PageItem>
  )
}

function getPages(
  commonProps: CommonPageProps,
  lastPage: number,
  makeLinkLabel: (page: number) => string
): ReactElement[] {
  // TODO At some point we might want to make these breakpoints configurable,
  // or controlled by media queries.
  const lastBreak = lastPage - 2
  let lowerBreak = Math.max(2, commonProps.currentPage - 2)
  let upperBreak = lowerBreak + 5
  if (upperBreak >= lastBreak) {
    lowerBreak = lowerBreak + lastBreak - upperBreak
    upperBreak = lastPage - 1
  }
  if (lowerBreak <= 2) {
    lowerBreak = 1
  }

  const pages: ReactElement[] = []
  if (lowerBreak > 1) {
    pages.push(dots('lower-break'))
  }
  for (let page = lowerBreak; page <= upperBreak; page++) {
    pages.push(getPageButton(page, commonProps, makeLinkLabel(page)))
  }
  if (upperBreak <= lastBreak) {
    pages.push(dots('upper-break'))
  }
  pages.push(getPageButton(lastPage, commonProps, makeLinkLabel(lastPage)))
  return pages
}

const PageLinkBase: React.FC<PageLinkProps> = (props: PageLinkProps): ReactElement => {
  const { page, disabled, children, onClick, ...rest } = props
  const linkProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = rest
  if (disabled) {
    linkProps['aria-disabled'] = 'true'
  } else {
    linkProps.tabIndex = 0
  }
  if (onClick) {
    linkProps.onKeyDown = keyDownAsClick
    linkProps.onKeyUp = preventAction
  }
  return (
    <a role="link" onClick={onClick} {...linkProps}>
      {children}
    </a>
  )
}

export const Pagination: React.FC<PaginationProps> = (props): ReactElement | null => {
  const { pageCount, currentPage, label, className, onPageChange, linkAs, ...rest } = props
  const pageChangeHandler = React.useCallback(
    (page: number): (() => void) | undefined => {
      if (onPageChange) {
        return (): void => onPageChange(page)
      }
    },
    [onPageChange]
  )

  if (pageCount < 1 || currentPage < 1 || currentPage > pageCount) {
    return null
  }

  // *sigh* I wish Typescript could play nicer with defaultProps...
  const makeLinkLabel = props.makeLinkLabel as (page: number) => string
  const lastPageLabel = `${props.lastPageLabel}, ${pageCount}`
  const commonProps = {
    linkAs,
    currentPage,
    pageChangeHandler,
    'aria-label': `${props.currentPageLabel}, ${currentPage}`,
  }
  const prevProps = { ...commonProps, page: Math.max(1, currentPage - 1) }
  prevProps['aria-label'] = `${props.prevPageLabel}, ${currentPage - 1}`
  const nextProps = { ...commonProps, page: Math.min(pageCount, currentPage + 1) }
  nextProps['aria-label'] = `${props.nextPageLabel}, ${currentPage + 1}`
  const marginProps = pick(props, margin.propNames as string[])

  return (
    <Nav className={className} aria-label={label} {...marginProps} {...rest}>
      <PageList role="list">
        <PageButton {...commonProps} page={1} aria-label={makeLinkLabel(1)}>
          <NavigationFirst />
        </PageButton>
        <PageButton {...prevProps} rel="prev">
          <NavigationChevronLeft />
        </PageButton>

        {getPages(commonProps, pageCount, makeLinkLabel)}

        <PageButton {...nextProps} rel="next">
          <NavigationChevronRight />
        </PageButton>
        <PageButton {...commonProps} page={pageCount} aria-label={lastPageLabel}>
          <NavigationLast />
        </PageButton>
      </PageList>
    </Nav>
  )
}

Pagination.displayName = 'Pagination'

Pagination.propTypes = {
  pageCount: function (props: Record<string, any>): Error | null {
    const pageCount = parseInt(props.pageCount as any)
    if (pageCount < 1 || pageCount !== parseFloat(props.pageCount as any)) {
      return new Error('Prop `pageCount` must be a positive integer')
    }

    return null
  },
  currentPage: function (props: Record<string, any>): Error | null {
    const pageCount = parseInt(props.pageCount as any)
    const current = parseInt(props.currentPage as any)
    if (current < 1 || current > pageCount || current !== parseFloat(props.currentPage as any)) {
      return new Error('Prop `currentPage` must be an integer in the range [1, `pageCount`]')
    }

    return null
  },
  onPageChange: function (props: Record<string, any>): Error | null {
    if (!props.onPageChange) {
      if (!props.linkAs) {
        return new Error('Either `linkAs` OR `onPageChange` prop is required')
      }
    } else if (typeof props.onPageChange !== 'function') {
      return new Error('Prop `onPageChange` must be a function')
    }

    return null
  },
  linkAs: PropTypes.elementType as PropTypes.Requireable<React.ComponentType<PageLinkProps>>,
  label: PropTypes.string.isRequired,
  currentPageLabel: PropTypes.string.isRequired,
  prevPageLabel: PropTypes.string.isRequired,
  nextPageLabel: PropTypes.string.isRequired,
  lastPageLabel: PropTypes.string.isRequired,
  makeLinkLabel: PropTypes.func.isRequired,
}

Pagination.defaultProps = {
  label: 'Pages',
  currentPageLabel: 'Current page',
  prevPageLabel: 'Go to previous page',
  nextPageLabel: 'Go to next page',
  lastPageLabel: 'Go to last page',
  makeLinkLabel: (page: number): string => `Go to page ${page}`,
}

export default Pagination

const RotatedMenuDots = styled(NavigationMenuDots)`
  margin-top: 5px;
  transform: rotate(90deg);
  cursor: default;
  display: block;
`

const Nav = styled.nav`
  ${margin}
`

const PageList = styled.ol`
  display: flex;
  flex-wrap: nowrap;
  list-style: none;
  margin: 0;
  padding: 0;
`

const PageItem = styled.li`
  min-width: 15px;
  height: 24px;
  text-align: center;
  background: none;
  appearance: none;
  padding: 2px 8px;
  display: block;
  box-sizing: content-box;

  &,
  :link {
    color: ${(p): string => p.theme.colors.darkestContrast};
    ${(p): string => fontSize(p.theme, 'small')};
    line-height: 18px;
    text-decoration: none;
  }

  border-left: ${(p): string => border(p.theme, 'lightContrast')};

  &:last-child {
    border-right: ${(p): string => border(p.theme, 'lightContrast')};
  }

  svg {
    width: 15px;
    height: 15px;
    vertical-align: middle;
  }
`

const PageLink = styled(PageLinkBase)<PageLinkProps>`
  cursor: pointer;
  padding: 3px;
  vertical-align: middle;
  line-height: 18px;
  display: block;
  border-radius: 8px;

  &:visited {
    color: ${(p): string => p.theme.colors.mediumContrast};
  }

  // For styling active links, and overriding the :visited color.
  text-decoration: none;
  color: inherit;

  &:hover {
    color: ${(p): string => p.theme.colors.callToAction};
  }

  &:active,
  &:focus {
    // Re-stated to prevent a small shift when the button is clicked in Firefox
    padding: 3px;
    outline: none;
    ${(p): ColorStyle => p.theme.colorStyles.callToAction};
  }

  // Just in case they want to use a button for 'linkAs'
  border: none;
  background-color: transparent;
  font: inherit;
  &::-moz-focus-inner {
    border: none;
  }

  &[disabled],
  &[aria-disabled='true'] {
    color: ${(p): string => p.theme.colors.lightGray};
    background-color: transparent;
    cursor: default;
  }

  &[aria-current='page'] {
    ${(p): ColorStyle => p.theme.colorStyles.base};
  }
`
