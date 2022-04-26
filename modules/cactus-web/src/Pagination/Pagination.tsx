import {
  NavigationChevronLeft,
  NavigationChevronRight,
  NavigationFirst,
  NavigationLast,
  NavigationMenuDots,
} from '@repay/cactus-icons'
import { border, color, colorStyle, space, textStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { createRef, ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { margin, MarginProps, maxWidth, MaxWidthProps, width, WidthProps } from 'styled-system'

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

export interface PaginationProps extends MarginProps, MaxWidthProps, WidthProps {
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
  itemsMaxAmmount?: number
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

const useGetWidth = (ref: React.MutableRefObject<HTMLElement | null>) => {
  const [width, setWidth] = useState<number>(1)
  useEffect(() => {
    const { current } = ref
    if (current && current.parentElement) {
      setWidth(current.parentElement.offsetWidth)
      window.addEventListener('resize', () =>
        setWidth((value) => current?.parentElement?.offsetWidth || value)
      )
    }
    return () => {
      window.removeEventListener('resize', () =>
        setWidth((value) => current?.parentElement?.offsetWidth || value)
      )
    }
  }, [ref])

  return width
}

const useGetListLimit = (navigationWidth: number, itemsMaxAmmount = 13) => {
  const MIN_AMOUNT = 5
  const [listLimit, setListLimit] = useState(5)

  useEffect(() => {
    if (Math.floor(navigationWidth / 32) < MIN_AMOUNT) {
      setListLimit(5)
    } else if (Math.floor(navigationWidth / 32) > itemsMaxAmmount) {
      setListLimit(itemsMaxAmmount)
    } else {
      setListLimit(Math.floor(navigationWidth / 32))
    }
  }, [itemsMaxAmmount, navigationWidth])
  return listLimit
}

const useGetItemsList = (
  navigationWidth: number,
  pageCount: number,
  currentPage: number,
  itemsMaxAmmount: number
) => {
  const listLimit = useGetListLimit(navigationWidth, itemsMaxAmmount)

  const pagesShown = pageCount < listLimit - 4 ? pageCount : listLimit - 4
  const pages: Array<number | string> = []

  const neighbours = pagesShown - 1
  const sideNeighbours = Math.floor((pagesShown - 1) / 2)

  let leftBreak = currentPage - sideNeighbours
  if (leftBreak <= 1) {
    leftBreak = 1
  }
  let rightBreak = leftBreak + (pagesShown - 1)
  if (rightBreak >= pageCount) {
    leftBreak = pageCount - neighbours
    rightBreak = pageCount
  }
  if (leftBreak === 0) {
    rightBreak = pagesShown
  }
  for (let item = leftBreak; item <= rightBreak; item++) {
    pages.push(item)
  }

  if (leftBreak > 1 && pagesShown > 2) {
    pages[0] = 'left-break'
  }

  if (rightBreak <= pageCount - 1 && pagesShown > 2) {
    pages[pages.length - 1] = 'right-break'
  }

  return ['first', 'prev', ...pages, 'next', 'last']
}

const itemRenderer = (
  page: string | number,
  props: CommonPageProps,
  pageCount: number,
  navigationLabels: Array<string | undefined>,
  makeLinkLabel: (page: number) => string
) => {
  if (page === 'first') {
    return (
      <PageButton {...props} key={page} page={1} aria-label={makeLinkLabel(1)}>
        <NavigationFirst />
      </PageButton>
    )
  }
  if (page === 'prev') {
    return (
      <PageButton
        {...props}
        key={page}
        rel="prev"
        page={Math.max(1, props.currentPage - 1)}
        aria-label={navigationLabels[0] as string}
      >
        <NavigationChevronLeft />
      </PageButton>
    )
  }
  if (page === 'last') {
    return (
      <PageButton {...props} key={page} page={pageCount} aria-label={navigationLabels[2] as string}>
        <NavigationLast />
      </PageButton>
    )
  }
  if (page === 'next') {
    return (
      <PageButton
        {...props}
        key={page}
        rel="next"
        page={Math.min(pageCount, props.currentPage + 1)}
        aria-label={navigationLabels[1] as string}
      >
        <NavigationChevronRight />
      </PageButton>
    )
  }
  if (page === 'left-break' || page === 'right-break') {
    return (
      <PageItem key={page}>
        <NavigationMenuDots style={ROTATE} />
      </PageItem>
    )
  }

  return getPageButton(page as number, props, makeLinkLabel(page as number))
}

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
  itemsMaxAmmount,
  ...props
}) => {
  const navigation = createRef<HTMLElement>()
  const navigationWidth = useGetWidth(navigation)
  const itemsList = useGetItemsList(
    navigationWidth,
    pageCount,
    currentPage,
    itemsMaxAmmount as number
  )

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
    <Nav {...props} ref={navigation} aria-label={label} aria-disabled={disabled}>
      <PageList role="list">
        {itemsList.map((page) => {
          return itemRenderer(
            page,
            commonProps,
            pageCount,
            [prevPageLabel, nextPageLabel, lastPageLabel],
            makeLinkLabel
          )
        })}
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
  itemsMaxAmmount: function (props: Record<string, any>): Error | null {
    if (props.itemsMaxAmmount < 5) {
      return new Error('Prop `itemsMaxAmmount` must be greather than 5.')
    }

    return null
  },
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
  ${width}
  ${maxWidth}

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
