import {
  NavigationChevronLeft,
  NavigationChevronRight,
  NavigationFirst,
  NavigationLast,
  NavigationMenuDots,
} from '@repay/cactus-icons'
import { border, color, colorStyle, space, textStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { keyDownAsClick, preventAction } from '../helpers/a11y'

type EmptyFn = () => void
export interface PageLinkProps {
  'aria-label': string
  'aria-current'?: 'page'
  page: number
  disabled: boolean
  children: React.ReactChild
  rel?: string
  className?: string
  onClick?: EmptyFn
}

export interface PaginationProps extends MarginProps {
  disabled?: boolean
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
  disabled: boolean
  currentPage: number
  className?: string
  'aria-label': string
  'aria-current'?: 'page'
  linkAs?: React.ComponentType<PageLinkProps>
  makeChangeHandler: (() => undefined) | ((page: number) => EmptyFn)
}

interface PageProps extends CommonPageProps {
  page: number
  rel?: string
  children: React.ReactChild
  onClick?: EmptyFn
}

const PageButton = (props: PageProps): ReactElement => {
  const { currentPage, linkAs, makeChangeHandler, ...rest } = props
  if (rest.page === currentPage) {
    rest.disabled = true
  } else {
    rest.onClick = makeChangeHandler(rest.page)
  }
  return (
    <PageItem>
      <PageLink as={linkAs} {...rest} />
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

const ROTATE = { transform: 'rotate(90deg)' }
function dots(key: string): ReactElement {
  return (
    <PageItem key={key}>
      <NavigationMenuDots style={ROTATE} />
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

const noop = () => undefined

export const Pagination: React.FC<PaginationProps> = ({
  disabled = false,
  label,
  linkAs,
  pageCount,
  currentPage,
  onPageChange,
  makeLinkLabel = defaultLinkLabel,
  lastPageLabel,
  currentPageLabel,
  prevPageLabel,
  nextPageLabel,
  ...props
}) => {
  if (pageCount < 1 || currentPage < 1 || currentPage > pageCount) {
    return null
  }

  const commonProps: CommonPageProps = {
    linkAs,
    disabled,
    currentPage,
    makeChangeHandler: noop,
    'aria-label': `${currentPageLabel}, ${currentPage}`,
  }
  if (onPageChange && !disabled) {
    commonProps.makeChangeHandler = (page: number) => () => onPageChange(page)
  }
  const prevPage = Math.max(1, currentPage - 1)
  prevPageLabel = `${prevPageLabel}, ${prevPage}`
  const nextPage = Math.min(pageCount, currentPage + 1)
  nextPageLabel = `${nextPageLabel}, ${nextPage}`
  lastPageLabel = `${lastPageLabel}, ${pageCount}`

  return (
    <Nav {...props} aria-label={label} aria-disabled={disabled}>
      <PageList role="list">
        <PageButton {...commonProps} page={1} aria-label={makeLinkLabel(1)}>
          <NavigationFirst />
        </PageButton>
        <PageButton {...commonProps} rel="prev" page={prevPage} aria-label={prevPageLabel}>
          <NavigationChevronLeft />
        </PageButton>

        {getPages(commonProps, pageCount, makeLinkLabel)}

        <PageButton {...commonProps} rel="next" page={nextPage} aria-label={nextPageLabel}>
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
  disabled: PropTypes.bool,
  pageCount: function (props: Record<string, any>): Error | null {
    const pageCount = parseInt(props.pageCount)
    if (pageCount < 1 || pageCount !== parseFloat(props.pageCount)) {
      return new Error('Prop `pageCount` must be a positive integer')
    }

    return null
  },
  currentPage: function (props: Record<string, any>): Error | null {
    const pageCount = parseInt(props.pageCount)
    const current = parseInt(props.currentPage)
    if (current < 1 || current > pageCount || current !== parseFloat(props.currentPage)) {
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

const defaultLinkLabel = (page: number): string => `Go to page ${page}`

Pagination.defaultProps = {
  label: 'Pages',
  currentPageLabel: 'Current page',
  prevPageLabel: 'Go to previous page',
  nextPageLabel: 'Go to next page',
  lastPageLabel: 'Go to last page',
  makeLinkLabel: defaultLinkLabel,
}

export default Pagination

const Nav = styled.nav`
  ${margin}
  ${textStyle('small')}
  ${colorStyle('standard')}
  text-align: center;

  &&[aria-disabled='true'] {
    * {
      color: ${color('lightGray')};
      border-color: currentcolor;
      cursor: not-allowed;
    }
    [aria-current='page'] {
      ${colorStyle('white', 'mediumGray')}
    }
  }
`

const PageList = styled.ol`
  display: flex;
  flex-wrap: nowrap;
  list-style: none;
  margin: 0;
  padding: 0;
`

const PageItem = styled.li`
  padding: ${space(1)} ${space(3)};
  display: block;

  border-left: ${border('lightContrast')};
  &:last-child {
    border-right: ${border('lightContrast')};
  }

  svg {
    display: block;
    padding: ${space(2)} 0;
  }
`

// Vertical padding is implied by line-height.
const PageLink = styled(PageLinkBase)<PageLinkProps>`
  box-sizing: border-box;
  min-width: 1em;
  display: block;
  cursor: pointer;
  padding: 0 ${space(1)};
  border-radius: 8px;

  // For styling active links, and overriding the :visited color.
  text-decoration: none;
  color: inherit;
  &:visited {
    color: ${color('mediumContrast')};
  }

  &:hover {
    color: ${color('callToAction')};
  }

  &:focus-visible {
    outline: none;
    ${colorStyle('callToAction')}
  }

  // Just in case they want to use a button for 'linkAs'
  border: none;
  background-color: transparent;
  font: inherit;
  &::-moz-focus-inner {
    border: none;
  }

  &:disabled,
  &[aria-disabled='true'] {
    color: ${color('lightGray')};
    cursor: default;
  }

  &[aria-current='page'] {
    ${colorStyle('base')}
  }

  svg {
    // This is to offset the padding on the text nodes.
    margin: 0 -${space(1)};
  }
`
