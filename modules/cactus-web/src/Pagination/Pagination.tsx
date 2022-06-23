import {
  NavigationChevronLeft,
  NavigationChevronRight,
  NavigationFirst,
  NavigationLast,
  NavigationMenuDots,
} from '@repay/cactus-icons'
import { border, color, colorStyle, space, textStyle } from '@repay/cactus-theme'
import { debounce, noop } from 'lodash'
import PropTypes from 'prop-types'
import React, { ReactElement, useRef, useState } from 'react'
import styled from 'styled-components'
import { margin, MarginProps, maxWidth, MaxWidthProps, width, WidthProps } from 'styled-system'

import { keyDownAsClick, preventAction } from '../helpers/a11y'
import { SIZES, useScreenSize } from '../ScreenSizeProvider/ScreenSizeProvider'

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
  maxItems?: number
}

interface CommonPageProps {
  disabled: boolean
  currentPage: number
  className?: string
  'aria-label': string
  'aria-current'?: 'page'
  linkAs?: React.ComponentType<PageLinkProps>
  makeChangeHandler: (page: number) => EmptyFn | undefined
}

interface PageProps extends CommonPageProps {
  page: number
  rel?: string
  children: React.ReactChild
  onClick?: EmptyFn
}

const ITEM_WIDTH = 32
const CHEVRONS = 4
const MIN_ITEMS = CHEVRONS + 1
const RESPONSIVE_MAX_ITEMS = [7, 10, 13, 13, 16]
// If any of these props change we need to recalculate the width & item count.
const recalcPropNames = ['maxItems', 'pageCount', 'currentPage', 'width', 'maxWidth'] as const
const RECALC = { value: NaN }

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

const PageLinkBase: React.FC<PageLinkProps> = (props) => {
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

// Calculates a layout of page numbers, including whether or not to render breaks (ellipses).
const getItems = (pageCount: number, currentPage: number, itemCount: number) => {
  // Invariant: maxPages <= pageCount
  const maxPages = itemCount - CHEVRONS
  let leftBreak = false,
    rightBreak = false,
    leftPage = currentPage,
    rightPage = currentPage + maxPages - 1
  const lowestLeft = 1
  const lowestRight = Math.min(pageCount, currentPage + Math.floor(maxPages / 2))
  const shift = Math.min(leftPage - lowestLeft, rightPage - lowestRight)
  leftPage -= shift
  rightPage -= shift
  let breakLimit = 1
  if (rightPage < pageCount && maxPages > breakLimit) {
    rightBreak = true
    rightPage -= 1
    breakLimit += 2
  }
  // The left break is more implicitly obvious, so we can exclude it easier than the right break.
  breakLimit += 1
  if (leftPage > lowestLeft && maxPages > breakLimit) {
    leftBreak = true
    leftPage += 1
  }
  return [leftBreak, leftPage, rightPage, rightBreak] as const
}

const sumWidths = (sum: number, item: HTMLElement) => sum + item.getBoundingClientRect().width

const useMaxItemCount = (pageCount: number, maxItemProp: number | undefined) => {
  const size = useScreenSize()
  const definedMax = maxItemProp || RESPONSIVE_MAX_ITEMS[SIZES.indexOf(size)]
  return Math.min(pageCount + CHEVRONS, Math.max(MIN_ITEMS, definedMax))
}

const useItemCount = (navRef: React.RefObject<HTMLElement>, props: PaginationProps) => {
  const { pageCount, currentPage } = props
  // Calculate the max number of items, with default based on screen size.

  const [itemCount, setItemCount] = useState<{ value: number }>(RECALC)
  // Track changes to the "recalc" props; if any of these change, the number of items could change.
  const newProps: unknown[] = recalcPropNames.map((k) => props[k])
  const maxItems = (newProps[0] = useMaxItemCount(pageCount, props.maxItems))
  const propsRef = React.useRef(newProps)
  const oldProps = propsRef.current
  const propsHaveChanged = !newProps.every((v, i) => v === oldProps[i])
  if (propsHaveChanged) {
    propsRef.current = newProps
  }
  // Since we already have this handy, might as well make it the hook's dependency array.
  newProps.push(isNaN(itemCount.value))
  const isSettingBaseline = propsHaveChanged || isNaN(itemCount.value)

  React.useLayoutEffect(() => {
    const nav = navRef.current
    // No point in running if the nav is hidden (width = 0).
    if (isSettingBaseline && nav && nav.clientWidth) {
      const navWidth = nav.clientWidth
      const currentItems = Array.from(nav.querySelectorAll<HTMLElement>('li'))
      const totalWidth = Math.round(currentItems.reduce(sumWidths, 0))
      let newItemCount = currentItems.length
      // If the wide layout is TOO wide, propose smaller layouts till one fits.
      if (totalWidth > navWidth && newItemCount > MIN_ITEMS) {
        // Get the layout of the current items, so we can calculate array
        // indexes in the proposed layout relative to the leftmost page.
        const base = getItems(pageCount, currentPage, newItemCount)
        const leftOffset = (base[0] ? 2 : 1) - base[1]
        const widestItem = currentItems[base[2] + leftOffset].offsetWidth

        // Skip all the intermediate values that we know would be too wide.
        newItemCount -= Math.ceil((totalWidth - navWidth) / widestItem)
        while (newItemCount > MIN_ITEMS) {
          // Proposes a layout with the given number of pages, and checks if it fits.
          const [lBreak, left, right, rBreak] = getItems(pageCount, currentPage, newItemCount)
          let listWidth = CHEVRONS * ITEM_WIDTH
          if (lBreak) listWidth += ITEM_WIDTH
          if (rBreak) listWidth += ITEM_WIDTH
          const itemSubset = currentItems.slice(left + leftOffset, 1 + right + leftOffset)
          listWidth += Math.round(itemSubset.reduce(sumWidths, 0))
          if (listWidth <= navWidth) break
          newItemCount -= 1
        }
      }
      if (newItemCount < MIN_ITEMS) {
        newItemCount = MIN_ITEMS
      }
      setItemCount((old) => {
        if (old.value === newItemCount) {
          // If the last render was correct, we don't need to re-render.
          return currentItems.length === newItemCount ? old : { ...old }
        }
        return { value: newItemCount }
      })
    }
  }, newProps) // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    const debounceOpts = { leading: true, trailing: true, maxWait: 300 }
    const handler = debounce(() => setItemCount(RECALC), 200, debounceOpts)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // If something has changed that could affect the width, render at the max widht possible;
  // the layout effect will then calculate the number of items that fits in the real width.
  return isSettingBaseline ? maxItems : itemCount.value
}

export const Pagination: React.FC<PaginationProps> = (props) => {
  const {
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
    maxItems,
    ...rest
  } = props
  const navigation = useRef<HTMLElement>(null)
  const itemCount = useItemCount(navigation, props)

  if (pageCount < 1 || currentPage < 1 || currentPage > pageCount) {
    return null
  }
  const commonProps: CommonPageProps = {
    linkAs,
    disabled,
    currentPage,
    makeChangeHandler: noop as any,
    'aria-label': `${currentPageLabel}, ${currentPage}`,
  }
  if (onPageChange && !disabled) {
    commonProps.makeChangeHandler = (page: number) => () => onPageChange(page)
  }
  const prevPage = Math.max(1, currentPage - 1)
  const prevLabel = `${prevPageLabel}, ${prevPage}`
  const nextPage = Math.min(pageCount, currentPage + 1)
  const nextLabel = `${nextPageLabel}, ${nextPage}`
  const lastLabel = `${lastPageLabel}, ${pageCount}`

  const [leftBreak, left, right, rightBreak] = getItems(pageCount, currentPage, itemCount)
  const pages: ReactElement[] = []
  for (let pageNum = left; pageNum <= right; pageNum++) {
    pages.push(getPageButton(pageNum, commonProps, makeLinkLabel(pageNum)))
  }
  return (
    <Nav {...rest} ref={navigation} aria-label={label} aria-disabled={disabled}>
      <PageList role="list">
        <PageButton {...commonProps} page={1} aria-label={makeLinkLabel(1)}>
          <NavigationFirst />
        </PageButton>
        <PageButton {...commonProps} rel="prev" page={prevPage} aria-label={prevLabel}>
          <NavigationChevronLeft />
        </PageButton>
        {leftBreak && dots('left-break')}
        {pages}
        {rightBreak && dots('right-break')}
        <PageButton {...commonProps} rel="next" page={nextPage} aria-label={nextLabel}>
          <NavigationChevronRight />
        </PageButton>
        <PageButton {...commonProps} page={pageCount} aria-label={lastLabel}>
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
  maxItems: function (props: Record<string, any>): Error | null {
    if (props.maxItems < MIN_ITEMS) {
      return new Error('Prop `maxItems` must be greather than 5.')
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
  min-width: ${MIN_ITEMS * ITEM_WIDTH}px;
  max-width: 100%;
  && {
    ${margin}
    ${width}
    ${maxWidth}
  }

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
