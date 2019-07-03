import { border } from '../helpers/theme'
import { margin, MarginProps } from 'styled-system'
import {
  NavigationChevronLeft,
  NavigationChevronRight,
  NavigationMenuDots,
} from '@repay/cactus-icons'
import pick from 'lodash/pick'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

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

interface PaginationProps extends MarginProps {
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

const PageButton = (props: PageProps) => {
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

function getPageButton(page: number, props: CommonPageProps, label: string) {
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

function dots(key: string) {
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
) {
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

  const pages: Array<React.ReactElement> = []
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

const PageLinkBase: React.FC<PageLinkProps> = (props: PageLinkProps) => {
  const { page, disabled, children, onClick, ...rest } = props
  const linkProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = rest
  if (disabled) {
    linkProps['aria-disabled'] = 'true'
  } else {
    linkProps.tabIndex = 0
  }
  if (onClick) {
    // TODO This is a handy accessibility tool, should we make it available?
    linkProps.onKeyPress = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onClick()
      }
    }
  }
  return (
    <a role="link" onClick={onClick} {...linkProps}>
      {children}
    </a>
  )
}

export const Pagination: React.FC<PaginationProps> = (props) => {
  const { pageCount, currentPage, label, className, onPageChange, linkAs } = props
  const pageChangeHandler = React.useCallback(
    (page: number) => {
      if (onPageChange) {
        return () => onPageChange(page)
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
  const marginProps = pick(props, margin.propNames as Array<string>)

  return (
    <Nav className={className} aria-label={label} {...marginProps}>
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

//@ts-ignore
Pagination.propTypes = {
  pageCount: function (props: PaginationProps, propName, componentName) {
    const pageCount = parseInt(props.pageCount as any)
    if (pageCount < 1 || pageCount !== parseFloat(props.pageCount as any)) {
      return new Error('Prop `pageCount` must be a positive integer')
    }
  },
  currentPage: function (props: PaginationProps, propName, componentName) {
    const pageCount = parseInt(props.pageCount as any)
    const current = parseInt(props.currentPage as any)
    if (current < 1 || current > pageCount || current !== parseFloat(props.currentPage as any)) {
      return new Error('Prop `currentPage` must be an integer in the range [1, `pageCount`]')
    }
  },
  onPageChange: function (props: PaginationProps, propName, componentName) {
    if (!props.onPageChange) {
      if (!props.linkAs) {
        return new Error('Either `linkAs` OR `onPageChange` prop is required')
      }
    } else if (typeof props.onPageChange !== 'function') {
      return new Error('Prop `onPageChange` must be a function')
    }
  },
  linkAs: PropTypes.elementType,
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
  makeLinkLabel: (page: number) => `Go to page ${page}`,
}

export default Pagination

// TODO Use the real icons once they're added to the library
const NavigationFirst = () => {
  return (
    <svg
      fill="currentcolor"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2.66671 1.33335C2.66671 0.965164 2.36823 0.666687 2.00004 0.666687C1.63185 0.666687 1.33337 0.965164 1.33337 1.33335V14.6667C1.33337 15.0349 1.63185 15.3334 2.00004 15.3334C2.36823 15.3334 2.66671 15.0349 2.66671 14.6667L2.66671 1.33335ZM13.5286 0.861949C13.789 0.6016 14.2111 0.6016 14.4714 0.861949C14.7318 1.1223 14.7318 1.54441 14.4714 1.80476L8.27618 8.00002L14.4714 14.1953C14.7318 14.4556 14.7318 14.8777 14.4714 15.1381C14.2111 15.3984 13.789 15.3984 13.5286 15.1381L6.86197 8.47142C6.60162 8.21107 6.60162 7.78897 6.86197 7.52862L13.5286 0.861949Z" />
    </svg>
  )
}

const NavigationLast = () => {
  return (
    <svg
      fill="currentcolor"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M14.6667 1.33335C14.6667 0.965164 14.3682 0.666687 14 0.666687C13.6319 0.666687 13.3334 0.965164 13.3334 1.33335L13.3334 14.6667C13.3334 15.0349 13.6318 15.3334 14 15.3334C14.3682 15.3334 14.6667 15.0349 14.6667 14.6667L14.6667 1.33335ZM1.52864 0.861949C1.26829 1.1223 1.26829 1.54441 1.52864 1.80476L7.7239 8.00002L1.52864 14.1953C1.26829 14.4556 1.26829 14.8777 1.52864 15.1381C1.78899 15.3984 2.2111 15.3984 2.47144 15.1381L9.13811 8.47142C9.39846 8.21107 9.39846 7.78897 9.13811 7.52862L2.47144 0.861949C2.2111 0.6016 1.78899 0.6016 1.52864 0.861949Z" />
    </svg>
  )
}

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

  &,
  :link {
    color: ${(p) => p.theme.colors.darkestContrast};
    ${(p) => p.theme.textStyles.small};
    line-height: 18px;
    text-decoration: none;
  }

  border-left: ${(p) => border(p.theme, 'lightContrast')};

  &:last-child {
    border-right: ${(p) => border(p.theme, 'lightContrast')};
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
    color: ${(p) => p.theme.colors.mediumContrast};
  }

  // For styling active links, and overriding the :visited color.
  text-decoration: none;
  color: inherit;

  &:hover {
    color: ${(p) => p.theme.colors.callToAction};
  }

  &:active,
  &:focus {
    // Re-stated to prevent a small shift when the button is clicked in Firefox
    padding: 3px;
    outline: none;
    ${(p) => p.theme.colorStyles.callToAction};
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
    color: ${(p) => p.theme.colors.lightGray};
    background-color: transparent;
    cursor: default;
  }

  &[aria-current='page'] {
    ${(p) => p.theme.colorStyles.base};
  }
`
