import { noop } from 'lodash'
import PropTypes from 'prop-types'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import Pagination, { PaginationProps } from '../Pagination/Pagination'
import PrevNext, { PrevNextProps } from '../PrevNext/PrevNext'
import { ScreenSizeContext, Size, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'
import { TableVariant } from '../Table/Table'
import BottomSection from './BottomSection'
import DataGridColumn, { useColumns } from './DataGridColumn'
import DataGridTable from './DataGridTable'
import { DataGridContext, getMediaQuery } from './helpers'
import PageSizeSelect from './PageSizeSelect'
import TopSection from './TopSection'
import { PaginationOptions, SortOption, TransientProps } from './types'

interface DataGridProps extends MarginProps {
  paginationOptions?: PaginationOptions
  sortOptions?: SortOption[]
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
    fullWidth = false,
    sortOptions,
    onSort = noop,
    paginationOptions,
    onPageChange = noop,
    cardBreakpoint = 'tiny',
    variant,
    ...rest
  } = props
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
          sortOptions: sortOptions || [],
          onSort,
          paginationOptions,
          onPageChange,
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
  overflow-x: auto;
  ${margin}

  ${getMediaQuery} {
    display: inline-flex;
  }
`

export const DataGridPagination: React.FC<
  Omit<PaginationProps, 'currentPage' | 'onPageChange' | 'pageCount'>
> = (props) => {
  const { paginationOptions, onPageChange } = useContext(DataGridContext)
  return paginationOptions && paginationOptions.pageCount ? (
    <Pagination
      currentPage={paginationOptions.currentPage}
      pageCount={paginationOptions.pageCount}
      onPageChange={(page: number): void => {
        onPageChange({ ...paginationOptions, currentPage: page })
      }}
      {...props}
    />
  ) : null
}

export const DataGridPrevNext: React.FC<PrevNextProps> = (props) => {
  const { paginationOptions, onPageChange } = useContext(DataGridContext)
  return paginationOptions ? (
    <PrevNext
      disablePrev={paginationOptions.currentPage === 1}
      onNavigate={(direction: 'prev' | 'next'): void => {
        onPageChange({
          ...paginationOptions,
          currentPage:
            direction === 'prev'
              ? paginationOptions.currentPage - 1
              : paginationOptions.currentPage + 1,
        })
      }}
      {...props}
    />
  ) : null
}

DataGrid.propTypes = {
  paginationOptions: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    pageCount: PropTypes.number,
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

DataGridPrevNext.displayName = 'PrevNext'
DataGridPagination.displayName = 'Pagination'

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
