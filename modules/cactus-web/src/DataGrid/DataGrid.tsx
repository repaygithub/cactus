import { NavigationChevronDown } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import useId from '../helpers/useId'
import Pagination, { PaginationProps } from '../Pagination/Pagination'
import PrevNext, { PrevNextProps } from '../PrevNext/PrevNext'
import { ScreenSizeContext, Size, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'
import BottomSection, { BottomSectionProps } from './BottomSection'
import DataGridTable, { DataGridTableProps } from './DataGridTable'
import { DataGridContext, getMediaQuery } from './helpers'
import PageSizeSelect, { PageSizeSelectProps } from './PageSizeSelect'
import TopSection, { TopSectionProps } from './TopSection'
import {
  ColumnObject,
  ColumnProps,
  DataColumnObject,
  DataColumnProps,
  PaginationOptions,
  SortOption,
  TransientProps,
} from './types'

interface DataGridProps extends MarginProps {
  paginationOptions?: PaginationOptions
  sortOptions?: SortOption[]
  onPageChange?: (newPageOptions: PaginationOptions) => void
  onSort?: (newSortOptions: SortOption[]) => void
  children: React.ReactNode
  fullWidth?: boolean
  cardBreakpoint?: Size
}

export const DataGrid = (props: DataGridProps): ReactElement => {
  const {
    children,
    fullWidth = false,
    sortOptions,
    onSort = () => undefined,
    paginationOptions,
    onPageChange = () => undefined,
    cardBreakpoint = 'tiny',
  } = props
  const [columns, setColumns] = useState(new Map<string, DataColumnObject | ColumnObject>())
  const [topSectionRendered, setTopSectionRendered] = useState<boolean>(false)

  const size = useContext(ScreenSizeContext)
  const isCardView = cardBreakpoint && size <= SIZES[cardBreakpoint]

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

  const addDataColumn = ({
    id,
    title,
    sortable = false,
    as: asComponent,
    ...cellProps
  }: DataColumnProps): void => {
    setColumns(new Map(columns.set(id, { title, sortable, asComponent, cellProps })))
  }

  const addColumn = (
    key: string,
    { children: columnFn, title, ...cellProps }: ColumnProps
  ): void => {
    setColumns(new Map(columns.set(key, { columnFn, title, cellProps })))
  }

  return (
    <StyledDataGrid fullWidth={fullWidth} $isCardView={isCardView} $cardBreakpoint={cardBreakpoint}>
      <DataGridContext.Provider
        value={{
          addDataColumn,
          addColumn,
          columns,
          sortOptions: sortOptions || [],
          onSort,
          paginationOptions,
          onPageChange,
          fullWidth,
          cardBreakpoint,
          isCardView,
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

  th {
    ${NavigationChevronDown} {
      margin-left: 8px;
    }
  }

  .flip-chevron {
    ${NavigationChevronDown} {
      transform: rotate3d(1, 0, 0, 180deg);
    }
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

const DataColumn = (props: DataColumnProps): ReactElement => {
  const { addDataColumn } = useContext(DataGridContext)
  useEffect((): void => {
    addDataColumn(props)
  }, [props]) // eslint-disable-line react-hooks/exhaustive-deps
  return <React.Fragment />
}

const Column = (props: ColumnProps): ReactElement => {
  const { addColumn } = useContext(DataGridContext)
  const fnKey = useId()
  useEffect((): void => {
    if (props.children && typeof props.children === 'function') {
      addColumn(fnKey, props)
    }
  }, [props]) // eslint-disable-line react-hooks/exhaustive-deps
  return <React.Fragment />
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

DataColumn.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  sortable: PropTypes.bool,
  as: PropTypes.elementType,
  width: PropTypes.string,
}

Column.propTypes = {
  children: PropTypes.func.isRequired,
  title: PropTypes.node,
  width: PropTypes.string,
}

DataGrid.defaultProps = {
  onSort: () => undefined,
  onPageChange: () => undefined,
  cardBreakpoint: 'tiny',
}

DataGridPrevNext.displayName = 'PrevNext'
DataGridPagination.displayName = 'Pagination'

type DataGridType = React.ComponentType<DataGridProps> & {
  Table: React.ComponentType<DataGridTableProps>
  DataColumn: React.ComponentType<DataColumnProps>
  Column: React.ComponentType<ColumnProps>
  TopSection: React.ComponentType<TopSectionProps>
  PageSizeSelect: React.ComponentType<PageSizeSelectProps>
  BottomSection: React.ComponentType<BottomSectionProps>
  Pagination: React.ComponentType<
    Omit<PaginationProps, 'currentPage' | 'onPageChange' | 'pageCount'>
  >
  PrevNext: React.ComponentType<PrevNextProps>
}

DataGrid.Table = DataGridTable
DataGrid.DataColumn = DataColumn
DataGrid.Column = Column
DataGrid.TopSection = TopSection
DataGrid.PageSizeSelect = PageSizeSelect
DataGrid.BottomSection = BottomSection
DataGrid.Pagination = DataGridPagination
DataGrid.PrevNext = DataGridPrevNext

DataGrid.displayName = 'DataGrid'

export default DataGrid as DataGridType
