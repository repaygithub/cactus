import { identity } from 'lodash'
import PropTypes from 'prop-types'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { useControllableValue } from '../hooks'
import { ScreenSizeContext, Size, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'
import { TableVariant } from '../Table/Table'
import BottomSection from './BottomSection'
import DataGridColumn, { useColumns } from './DataGridColumn'
import DataGridTable from './DataGridTable'
import { DataGridContext, getMediaQuery, initialPageState } from './helpers'
import PageSizeSelect from './PageSizeSelect'
import { calcPageState, DataGridPagination, DataGridPrevNext, pageStateReducer } from './Pagination'
import TopSection from './TopSection'
import { PageStateAction, PaginationOptions, Pagisort, SortOption, TransientProps } from './types'

interface DataGridProps extends MarginProps {
  paginationOptions?: PaginationOptions
  sortOptions?: SortOption[]
  initialSort?: SortOption[]
  onPagisort?: (newPagisort: Pagisort) => void
  onPageChange?: (newPageOptions: PaginationOptions) => void
  onSort?: (newSortOptions: SortOption[]) => void
  children: React.ReactNode
  fullWidth?: boolean
  cardBreakpoint?: Size
  variant?: TableVariant
}

export const DataGrid = (props: DataGridProps): ReactElement => {
  const {
    children,
    onPagisort,
    initialSort = [],
    onSort: onSortProp,
    onPageChange,
    fullWidth = false,
    cardBreakpoint = 'tiny',
    variant,
    ...rest
  } = props

  const [sortOptions, setSort] = useControllableValue(rest, 'sortOptions', initialSort)
  const [pageState, setPageState] = useControllableValue(
    rest,
    'paginationOptions',
    pageStateReducer,
    initialPageState
  )

  const onSort = (newSortOptions: SortOption[]) => {
    newSortOptions = setSort(newSortOptions)
    onSortProp?.(newSortOptions)
    if (onPagisort) {
      const pagisort = { ...setPageState(identity), sort: newSortOptions }
      onPagisort(calcPageState(pagisort))
    }
  }

  const updatePageState = (action: PageStateAction, raiseEvent = false) => {
    const newPageOptions = setPageState(action)
    if (raiseEvent && newPageOptions !== pageState) {
      onPageChange?.(newPageOptions)
      if (onPagisort) {
        const pagisort: Pagisort = { ...newPageOptions, sort: setSort(identity) }
        onPagisort(pagisort)
      }
    }
  }

  const [columnState, columnDispatch] = useColumns()
  const [topSectionRendered, setTopSectionRendered] = useState<boolean>(false)

  const size = useContext(ScreenSizeContext)
  const isCardView = variant === 'card' || (!variant && size <= SIZES[cardBreakpoint])

  // Because the sort buttons are a part of the top section and those must always be present for card view,
  // we can check if TopSection has been rendered and if it has not, we will render it for them.
  useEffect(() => {
    setTopSectionRendered(false)
    React.Children.forEach(children, (child) => {
      // @ts-ignore
      if (child && child.type.displayName && child.type.displayName.includes('TopSection')) {
        setTopSectionRendered(true)
      }
    })
  }, [children])

  return (
    <StyledDataGrid
      fullWidth={fullWidth}
      $isCardView={isCardView}
      $cardBreakpoint={cardBreakpoint}
      {...rest}
    >
      <DataGridContext.Provider
        value={{
          ...columnState,
          columnDispatch,
          sortOptions: sortOptions,
          onSort,
          pageState,
          updatePageState,
          fullWidth,
          cardBreakpoint,
          isCardView,
          variant,
        }}
      >
        {!topSectionRendered && <TopSection />}
        {children}
      </DataGridContext.Provider>
    </StyledDataGrid>
  )
}

const StyledDataGrid = styled.div<DataGridProps & TransientProps>`
  display: inline;
  flex-direction: column;
  width: ${(p): string => (p.fullWidth ? '100%' : 'auto')};
  ${margin}

  ${getMediaQuery} {
    display: inline-flex;
  }
`

DataGrid.propTypes = {
  paginationOptions: PropTypes.shape({
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    pageCount: PropTypes.number,
    itemCount: PropTypes.number,
    itemOffset: PropTypes.number,
  }),
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, sortAscending: PropTypes.bool.isRequired })
  ),
  onPageChange: PropTypes.func,
  onSort: PropTypes.func,
  children: PropTypes.node.isRequired,
  fullWidth: PropTypes.bool,
  cardBreakpoint: PropTypes.oneOf<Size>(['tiny', 'small', 'medium', 'large', 'extraLarge']),
}

type DataGridType = React.ComponentType<DataGridProps> & {
  Table: typeof DataGridTable
  DataColumn: typeof DataGridColumn
  Column: typeof DataGridColumn
  TopSection: typeof TopSection
  PageSizeSelect: typeof PageSizeSelect
  BottomSection: typeof BottomSection
  Pagination: typeof DataGridPagination
  PrevNext: typeof DataGridPrevNext
}

DataGrid.Table = DataGridTable
DataGrid.DataColumn = DataGridColumn
DataGrid.Column = DataGridColumn
DataGrid.TopSection = TopSection
DataGrid.PageSizeSelect = PageSizeSelect
DataGrid.BottomSection = BottomSection
DataGrid.Pagination = DataGridPagination
DataGrid.PrevNext = DataGridPrevNext

DataGrid.displayName = 'DataGrid'

export default DataGrid as DataGridType
