import { border } from '../helpers/theme'
import { margin, MarginProps } from 'styled-system'
import { NavigationChevronDown } from '@repay/cactus-icons'
import Pagination from '../Pagination/Pagination'
import PrevNext from '../PrevNext/PrevNext'
import React, { createContext, useContext, useEffect, useState } from 'react'
import styled, { DefaultTheme, StyledComponent } from 'styled-components'
import Table from '../Table/Table'
import useId from '../helpers/useId'

interface DataGridContextType {
  addDataColumn: ((dataColumn: DataColumn) => void) | undefined
  addColumnFn: ((fnKey: string, columnFn: ColumnFn) => void) | undefined
}

type ColumnFn = (rowData: { [key: string]: any }) => React.ReactNode

interface DataColumn {
  id: string
  title: string
  sortable: boolean
  asComponent?: React.ComponentType<any>
}

const DataGridContext = createContext<DataGridContextType>({
  addDataColumn: undefined,
  addColumnFn: undefined,
})

interface DataGridProps extends MarginProps {
  data: Array<{ [key: string]: any }>
  paginationOptions: PaginationOptions
  sortOptions: Array<SortOption>
  onPageChange: (newPageOptions: PaginationOptions) => void
  onSort: (newSortOptions: Array<SortOption>) => void
  children: React.ReactNode
  fullWidth?: boolean
  className?: string
  resultsCountText?: string
  pageSizeSelectLabel?: string
  makePageSizeLabel?: (pageSize: number) => string
  paginationProps?: {
    label?: string
    currentPageLabel?: string
    prevPageLabel?: string
    nextPageLabel?: string
    lastPageLabel?: string
    makeLinkLabel?: (page: number) => string
  }
  prevNextProps?: {
    prevText?: string
    nextText?: string
    disableNext?: boolean
  }
}

interface PaginationOptions {
  currentPage: number
  pageSize: number
  pageCount?: number
  pageSizeOptions?: Array<number>
}

interface SortOption {
  id: string
  sortAscending: boolean
}

interface ResultsViewSectionProps {
  resultsCountText?: string
  paginationOptions: PaginationOptions
  onPageChange: (newPageOptions: PaginationOptions) => void
  makePageSizeLabel?: (pageSize: number) => string
  pageSizeSelectLabel?: string
  className?: string
}

interface PageSizeSelectProps {
  paginationOptions: PaginationOptions
  onPageChange: (newPageOptions: PaginationOptions) => void
  makePageSizeLabel?: (pageSize: number) => string
  pageSizeSelectLabel?: string
  className?: string
}

interface HeaderButtonProps {
  title: string
  onClick: () => void
  className?: string
  sortOption?: SortOption
}

interface DataColumnProps {
  id: string
  title: string
  sortable?: boolean
  as?: React.ComponentType<any>
}

interface ColumnProps {
  children: ColumnFn
}

const DataGridBase = (props: DataGridProps) => {
  const {
    children,
    data,
    fullWidth,
    sortOptions,
    onSort,
    paginationOptions,
    onPageChange,
    className,
    resultsCountText,
    pageSizeSelectLabel,
    makePageSizeLabel,
    paginationProps,
    prevNextProps,
  } = props
  const [dataColumns, setDataColumns] = useState<{
    [id: string]: { title: string; sortable: boolean; asComponent?: React.ComponentType<any> }
  }>({})
  const [columnFns, setColumnFns] = useState<{ [key: string]: ColumnFn }>({})

  useEffect(() => {
    if (sortOptions.length > 0 && typeof onSort === 'function') {
      onSort(sortOptions)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const addDataColumn = ({ id, title, sortable, asComponent }: DataColumn) => {
    setDataColumns((currentDataColumns) => ({
      ...currentDataColumns,
      [id]: { title, sortable, asComponent },
    }))
  }

  const addColumnFn = (fnKey: string, columnFn: ColumnFn) => {
    setColumnFns((currentColumnFns) => ({ ...currentColumnFns, [fnKey]: columnFn }))
  }

  const dataColumnOrder = Object.keys(dataColumns)

  return (
    <div className={className}>
      <DataGridContext.Provider value={{ addDataColumn, addColumnFn }}>
        {children}
        <ResultsViewSection
          onPageChange={onPageChange}
          pageSizeSelectLabel={pageSizeSelectLabel}
          resultsCountText={resultsCountText}
          paginationOptions={paginationOptions}
          makePageSizeLabel={makePageSizeLabel}
        />
        <Table fullWidth={fullWidth}>
          <Table.Header>
            {dataColumnOrder.map((key) => {
              const dataColumn = dataColumns[key]
              let sortOpt: SortOption | undefined = undefined
              if (dataColumn.sortable) {
                sortOpt = sortOptions.find((opt: SortOption) => opt.id === key)
              }
              const flipChevron = sortOpt !== undefined && sortOpt.sortAscending === true
              return (
                <Table.Cell
                  className={`table-cell ${flipChevron ? 'flip-chevron' : ''} ${
                    dataColumn.sortable ? 'cursor-pointer' : ''
                  }`}
                  key={key}
                  aria-sort={
                    sortOpt ? (sortOpt.sortAscending ? 'ascending' : 'descending') : 'none'
                  }
                  onClick={
                    dataColumn.sortable
                      ? () => {
                          const sortOptionsCopy = JSON.parse(JSON.stringify(sortOptions))
                          const toUpdate = sortOptionsCopy.find((opt: SortOption) => opt.id === key)
                          if (sortOpt) {
                            toUpdate.sortAscending = !toUpdate.sortAscending
                          } else {
                            sortOptionsCopy[0] = { id: key, sortAscending: false }
                          }
                          if (typeof onSort === 'function') {
                            onSort(sortOptionsCopy)
                          }
                        }
                      : undefined
                  }
                  tabIndex={dataColumn.sortable ? 0 : undefined}
                >
                  {dataColumn.title}
                  {sortOpt !== undefined && <NavigationChevronDown aria-hidden="true" />}
                </Table.Cell>
              )
            })}
            {Object.keys(columnFns).map((fnKey) => (
              <Table.Cell key={`col-${fnKey}`}></Table.Cell>
            ))}
          </Table.Header>
          <Table.Body>
            {data.map((datum, datumIndex) => (
              <Table.Row key={`row-${datumIndex}`}>
                {dataColumnOrder.map((key, keyIndex) => {
                  const AsComponent = dataColumns[key].asComponent
                  return (
                    <Table.Cell key={`cell-${datumIndex}-${keyIndex}`}>
                      {AsComponent ? <AsComponent value={datum[key]} /> : datum[key]}
                    </Table.Cell>
                  )
                })}
                {Object.keys(columnFns).map((fnKey) => {
                  const columnFn = columnFns[fnKey]
                  return <Table.Cell key={fnKey}>{columnFn(datum)}</Table.Cell>
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </DataGridContext.Provider>
      {paginationOptions.pageCount ? (
        <Pagination
          className="pagination"
          currentPage={paginationOptions.currentPage}
          pageCount={paginationOptions.pageCount}
          onPageChange={(page: number) => {
            onPageChange({ ...paginationOptions, currentPage: page })
          }}
          {...paginationProps}
        />
      ) : (
        <PrevNext
          className="pagination"
          disablePrev={paginationOptions.currentPage === 1}
          onNavigate={(direction) => {
            onPageChange({
              ...paginationOptions,
              currentPage:
                direction === 'prev'
                  ? paginationOptions.currentPage - 1
                  : paginationOptions.currentPage + 1,
            })
          }}
          {...prevNextProps}
          disableNext={
            prevNextProps
              ? prevNextProps.disableNext || data.length < paginationOptions.pageSize
              : data.length < paginationOptions.pageSize
          }
        />
      )}
    </div>
  )
}

export const DataGrid = styled(DataGridBase)`
  display: inline-flex;
  align-items: center;
  flex-direction: column;
  width: ${(p) => (p.fullWidth ? '100%' : 'auto')};
  overflow-x: auto;

  ${(p) => p.theme.mediaQueries && p.theme.mediaQueries.medium} {
    align-items: unset;
    .pagination {
      margin-left: auto;
    }
  }

  .results-count {
    margin-bottom: 40px;
    margin-left: 16px;
    margin-right: auto;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  ${NavigationChevronDown} {
    margin-left: 8px;
  }

  .flip-chevron {
    ${NavigationChevronDown} {
      transform: rotate3d(1, 0, 0, 180deg);
    }
  }

  .pagination {
    margin-right: 16px;
    margin-top: 40px;
  }
` as any

const ResultsViewSectionBase = (props: ResultsViewSectionProps) => {
  const {
    onPageChange,
    resultsCountText,
    pageSizeSelectLabel,
    makePageSizeLabel,
    paginationOptions: { pageSizeOptions },
    className,
  } = props
  if (!resultsCountText && !pageSizeOptions) {
    return null
  } else {
    return (
      <div className={className}>
        {resultsCountText && <span className="results-count-text">{resultsCountText}</span>}
        {pageSizeOptions && (
          <PageSizeSelect
            paginationOptions={props.paginationOptions}
            pageSizeSelectLabel={pageSizeSelectLabel}
            makePageSizeLabel={makePageSizeLabel}
            onPageChange={onPageChange}
          />
        )}
      </div>
    )
  }
}

const ResultsViewSection = styled(ResultsViewSectionBase)`
  display: flex;
  flex-direction: column;
  margin: 0 16px 40px 16px;
  justify-content: space-between;

  ${(p) => p.theme.mediaQueries && p.theme.mediaQueries.medium} {
    flex-direction: row;

    .results-count-text: {
      margin-bottom: 0;
    }
  }

  .results-count-text {
    margin-bottom: 8px;
  }
`

const PageSizeSelectBase = (props: PageSizeSelectProps) => {
  const { paginationOptions, onPageChange, pageSizeSelectLabel, className } = props
  const { pageSizeOptions } = paginationOptions
  const makePageSizeLabel = props.makePageSizeLabel as (pageSize: number) => string
  return (
    <div className={className}>
      <span>{pageSizeSelectLabel || 'View'}</span>
      <ol className="page-options-list">
        {pageSizeOptions &&
          pageSizeOptions.map((pageSize) => {
            const isCurrentPageSize = paginationOptions.pageSize === pageSize
            return (
              <li className="page-option" key={`page-size-option-${pageSize}`}>
                <a
                  role="link"
                  aria-selected={isCurrentPageSize ? 'true' : 'false'}
                  onClick={() => {
                    onPageChange({ ...paginationOptions, pageSize: pageSize })
                  }}
                  tabIndex={isCurrentPageSize ? undefined : 0}
                  aria-label={makePageSizeLabel(pageSize)}
                >
                  {pageSize}
                </a>
              </li>
            )
          })}
      </ol>
    </div>
  )
}

const PageSizeSelect = styled(PageSizeSelectBase)`
  display: flex;
  margin-left: auto;

  span {
    margin-right: 8px;
  }

  .page-options-list {
    display: flex;
    flex-wrap: nowrap;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .page-option {
    min-width: 15px;
    height: 24px;
    text-align: center;
    background: none;
    appearance: none;
    padding: 2px 8px;
    display: block;

    border-left: ${(p) => border(p.theme, 'lightContrast')};

    &:last-child {
      border-right: ${(p) => border(p.theme, 'lightContrast')};
    }

    &,
    a {
      color: ${(p) => p.theme.colors.darkestContrast};
      ${(p) => p.theme.textStyles.small};
      line-height: 18px;
      text-decoration: none;
    }

    a {
      cursor: pointer;
      padding: 3px;
      vertical-align: middle;
      line-height: 18px;
      display: block;
      border-radius: 8px;

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

      &[aria-selected='true'] {
        ${(p) => p.theme.colorStyles.base};
      }
    }
  }
`

const DataColumn = (props: DataColumnProps) => {
  const { id, title, sortable = false, as: asComponent } = props
  const { addDataColumn } = useContext(DataGridContext)
  useEffect(() => {
    if (addDataColumn && typeof addDataColumn === 'function') {
      addDataColumn({ id, title, sortable, asComponent })
    }
  }, [asComponent, id, sortable, title]) // eslint-disable-line react-hooks/exhaustive-deps
  return <React.Fragment />
}

const Column = (props: ColumnProps) => {
  const { children } = props
  const { addColumnFn } = useContext(DataGridContext)
  const fnKey = useId()
  useEffect(() => {
    if (
      addColumnFn &&
      typeof addColumnFn === 'function' &&
      children &&
      typeof children === 'function'
    ) {
      addColumnFn(fnKey, children)
    }
  }, [children]) // eslint-disable-line react-hooks/exhaustive-deps
  return <React.Fragment />
}

PageSizeSelect.defaultProps = {
  makePageSizeLabel: (pageSize: number) => `View ${pageSize} rows per page`,
}

type DataGridType = StyledComponent<typeof DataGridBase, DefaultTheme, DataGridProps> & {
  DataColumn: React.ComponentType<DataColumnProps>
  Column: React.ComponentType<ColumnProps>
}

DataGrid.DataColumn = DataColumn
DataGrid.Column = Column

export default DataGrid as DataGridType
