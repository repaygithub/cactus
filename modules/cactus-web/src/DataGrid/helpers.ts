import { noop } from 'lodash'
import { createContext } from 'react'
import { DefaultTheme, ThemedStyledProps } from 'styled-components'

import { DataGridContextType, PaginationOptions, TableProps } from './types'

export const getMediaQuery = (
  props: ThemedStyledProps<Partial<TableProps>, DefaultTheme>
): string | undefined => {
  // Media queries in the theme were built using "min-width", meaning if a user wants
  // the card breakpoint to be at "medium", we will add a media query to apply different
  // styles when the screen reaches the "large" size. Therefore, we get the media query
  // for the next screen size up. For "extraLarge", we can just return a media query for
  // an absurdly large screen that would probably never even occur.
  const {
    cardBreakpoint,
    theme: { mediaQueries },
  } = props
  if (mediaQueries !== undefined) {
    switch (cardBreakpoint) {
      case 'tiny':
        return mediaQueries.small
      case 'small':
        return mediaQueries.medium
      case 'medium':
        return mediaQueries.large
      case 'large':
        return mediaQueries.extraLarge
      case 'extraLarge':
        return '@media screen and (min-width: 100000px)'
      default:
        return mediaQueries.small
    }
  }
}

export const initialPageState: PaginationOptions = { currentPage: 0, pageSize: 0 }

export const DataGridContext = createContext<DataGridContextType>({
  columns: [],
  sortableColumns: [],
  columnDispatch: noop,
  sortOptions: [],
  onSort: noop,
  pageState: initialPageState,
  updatePageState: noop,
  fullWidth: false,
  cardBreakpoint: 'tiny',
  isCardView: false,
  variant: undefined,
})
