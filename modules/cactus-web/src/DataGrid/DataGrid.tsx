import { border } from '../helpers/theme'
import { margin, MarginProps } from 'styled-system'
import { NavigationChevronDown } from '@repay/cactus-icons'
import Pagination from '../Pagination/Pagination'
import PrevNext from '../PrevNext/PrevNext'
import PropTypes from 'prop-types'
import React, { createContext, useContext, useEffect, useState } from 'react'
import styled, { css, DefaultTheme, StyledComponent } from 'styled-components'
import Table from '../Table/Table'
import useId from '../helpers/useId'

interface DataGridContextType {
  addDataColumn: (dataColumn: DataColumn) => void
  addColumn: (key: string, columnFn: ColumnFn, title?: string) => void
}

type ColumnFn = (rowData: { [key: string]: any }) => React.ReactNode

interface DataColumn {
  id: string
  title: string
  sortable: boolean
  asComponent?: React.ComponentType<any>
}

const DataGridContext = createContext<DataGridContextType>({
  addDataColumn: () => {},
  addColumn: () => {},
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

interface DataColumnProps {
  id: string
  title: string
  sortable?: boolean
  as?: React.ComponentType<any>
}

interface ColumnProps {
  children: ColumnFn
  title?: string
}

interface DataColumnObject {
  title: string
  sortable: boolean
  asComponent?: React.ComponentType<any>
}

interface ColumnObject {
  columnFn: ColumnFn
  title?: string
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
  const [columns, setColumns] = useState(new Map<string, DataColumnObject | ColumnObject>())

  const addDataColumn = ({ id, title, sortable, asComponent }: DataColumn) => {
    setColumns(new Map(columns.set(id, { title, sortable, asComponent })))
  }

  const addColumn = (key: string, columnFn: ColumnFn, title?: string) => {
    setColumns(new Map(columns.set(key, { columnFn, title })))
  }

  return (
    <div className={className}>
      <DataGridContext.Provider value={{ addDataColumn, addColumn }}>
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
            {[...columns.keys()].map((key) => {
              let column = columns.get(key)
              if (column && column.hasOwnProperty('sortable')) {
                column = column as DataColumnObject
                let sortOpt: SortOption | undefined = undefined
                if (column.sortable) {
                  sortOpt = sortOptions.find((opt: SortOption) => opt.id === key)
                }
                const flipChevron = sortOpt !== undefined && sortOpt.sortAscending === true
                return (
                  <Table.Cell
                    className={`table-cell ${flipChevron ? 'flip-chevron' : ''} ${
                      column.sortable ? 'cursor-pointer' : ''
                    }`}
                    key={key}
                    aria-sort={
                      column.sortable
                        ? sortOpt
                          ? sortOpt.sortAscending
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                        : undefined
                    }
                    tabIndex={!column.sortable ? -1 : undefined}
                  >
                    {column.sortable ? (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          const { sortAscending: currentSortAscending } = sortOptions[0] || {}
                          const newOptions = [
                            { id: key, sortAscending: sortOpt ? !currentSortAscending : false },
                          ]
                          onSort(newOptions)
                        }}
                      >
                        {column.title}

                        {sortOpt !== undefined && <NavigationChevronDown aria-hidden="true" />}
                      </span>
                    ) : (
                      column.title
                    )}
                  </Table.Cell>
                )
              } else {
                column = column as ColumnObject
                return <Table.Cell key={`col-${key}`}>{column.title || ''}</Table.Cell>
              }
            })}
          </Table.Header>
          <Table.Body>
            {data.map((datum, datumIndex) => (
              <Table.Row key={`row-${datumIndex}`}>
                {[...columns.keys()].map((key, keyIndex) => {
                  let column = columns.get(key)
                  if (column && column.hasOwnProperty('sortable')) {
                    column = column as DataColumnObject
                    const AsComponent = column.asComponent
                    return (
                      <Table.Cell key={`cell-${datumIndex}-${keyIndex}`}>
                        {AsComponent ? <AsComponent value={datum[key]} /> : datum[key]}
                      </Table.Cell>
                    )
                  } else {
                    column = column as ColumnObject
                    return (
                      <Table.Cell key={`cell-${datumIndex}-${keyIndex}`}>
                        {column && column.columnFn(datum)}
                      </Table.Cell>
                    )
                  }
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
          onNavigate={(direction: 'prev' | 'next') => {
            onPageChange({
              ...paginationOptions,
              currentPage:
                direction === 'prev'
                  ? paginationOptions.currentPage - 1
                  : paginationOptions.currentPage + 1,
            })
          }}
          disableNext={
            prevNextProps
              ? prevNextProps.disableNext || data.length < paginationOptions.pageSize
              : data.length < paginationOptions.pageSize
          }
          {...prevNextProps}
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
  ${margin}

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

const IEStyles = () => {
  if (typeof window !== 'undefined' && /MSIE|Trident/.test(window.navigator.userAgent)) {
    return css`
      width: 100%;
    `
  }
}

const ResultsViewSection = styled(ResultsViewSectionBase)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 40px;

  .results-count-text {
    margin-bottom: 8px;
  }

  ${(p) => p.theme.mediaQueries && p.theme.mediaQueries.medium} {
    flex-direction: row;
    align-items: flex-start;

    ${IEStyles()}

    .results-count-text: {
      margin-bottom: 0;
    }
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
  display: inline-box;

  ${(p) => p.theme.mediaQueries && p.theme.mediaQueries.medium} {
    margin-left: auto;
  }

  span {
    margin-right: 8px;
  }

  .page-options-list {
    display: inline-flex;
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

export const DataColumn = (props: DataColumnProps) => {
  const { id, title, sortable = false, as: asComponent } = props
  const { addDataColumn } = useContext(DataGridContext)
  useEffect(() => {
    addDataColumn({ id, title, sortable, asComponent })
  }, [asComponent, id, sortable, title]) // eslint-disable-line react-hooks/exhaustive-deps
  return <React.Fragment />
}

const Column = (props: ColumnProps) => {
  const { children, title } = props
  const { addColumn } = useContext(DataGridContext)
  const fnKey = useId()
  useEffect(() => {
    if (children && typeof children === 'function') {
      addColumn(fnKey, children, title)
    }
  }, [children]) // eslint-disable-line react-hooks/exhaustive-deps
  return <React.Fragment />
}

PageSizeSelect.defaultProps = {
  makePageSizeLabel: (pageSize: number) => `View ${pageSize} rows per page`,
}

DataGrid.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  paginationOptions: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    pageCount: PropTypes.number,
    pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, sortAscending: PropTypes.bool.isRequired })
  ).isRequired,
  onPageChange: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  fullWidth: PropTypes.bool,
  resultsCountText: PropTypes.string,
  pageSizeSelectLabel: PropTypes.string,
  makePageSizeLabel: PropTypes.func,
  paginationProps: PropTypes.shape({
    label: PropTypes.string,
    currentPageLabel: PropTypes.string,
    prevPageLabel: PropTypes.string,
    nextPageLabel: PropTypes.string,
    lastPageLabel: PropTypes.string,
    makeLinkLabel: PropTypes.func,
  }),
  prevNextProps: PropTypes.shape({
    prevText: PropTypes.string,
    nextText: PropTypes.string,
    disableNext: PropTypes.bool,
  }),
}

DataColumn.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  sortable: PropTypes.bool,
  as: PropTypes.elementType,
}

Column.propTypes = {
  children: PropTypes.func.isRequired,
}

type DataGridType = StyledComponent<typeof DataGridBase, DefaultTheme, DataGridProps> & {
  DataColumn: React.ComponentType<DataColumnProps>
  Column: React.ComponentType<ColumnProps>
}

DataGrid.DataColumn = DataColumn
DataGrid.Column = Column

export default DataGrid as DataGridType
