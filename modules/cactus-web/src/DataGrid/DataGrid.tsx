import { NavigationChevronDown } from '@repay/cactus-icons'
import { ColorStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { createContext, ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import styled, { DefaultTheme, StyledComponent, ThemedStyledProps } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { keyPressAsClick } from '../helpers/a11y'
import { border, fontSize } from '../helpers/theme'
import useId from '../helpers/useId'
import MenuButton from '../MenuButton/MenuButton'
import Pagination from '../Pagination/Pagination'
import PrevNext from '../PrevNext/PrevNext'
import { ScreenSizeContext, Size, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'
import Table, { TableCellProps } from '../Table/Table'

interface DataGridContextType {
  addDataColumn: (dataColumn: DataColumnProps) => void
  addColumn: (key: string, column: ColumnProps) => void
}

type ColumnFn = (rowData: { [key: string]: any }) => React.ReactNode

const DataGridContext = createContext<DataGridContextType>({
  addDataColumn: (): void => {
    return
  },
  addColumn: (): void => {
    return
  },
})

interface DataGridProps extends MarginProps {
  data: { [key: string]: any }[]
  paginationOptions?: PaginationOptions
  sortOptions?: SortOption[]
  onPageChange?: (newPageOptions: PaginationOptions) => void
  onSort?: (newSortOptions: SortOption[]) => void
  children: React.ReactNode
  fullWidth?: boolean
  cardBreakpoint?: Size
  className?: string
  resultsCountText?: React.ReactChild
  pageSizeSelectLabel?: React.ReactChild
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
    prevText?: React.ReactNode
    nextText?: React.ReactNode
    disableNext?: boolean
  }
  sortLabels?: SortLabels
}

interface PaginationOptions {
  currentPage: number
  pageSize: number
  pageCount?: number
  pageSizeOptions?: number[]
}

interface SortOption {
  id: string
  sortAscending: boolean
}

interface SortLabels {
  sortBy?: React.ReactChild
  order?: React.ReactChild
  ascending?: React.ReactChild
  descending?: React.ReactChild
}

interface TopSectionProps {
  resultsCountText?: React.ReactChild
  paginationOptions?: PaginationOptions
  onPageChange: (newPageOptions: PaginationOptions) => void
  makePageSizeLabel?: (pageSize: number) => string
  pageSizeSelectLabel?: React.ReactChild
  cardBreakpoint: Size
  isCardView: boolean
  sortableColumns: Map<string, DataColumnObject>
  handleSortColChange: (id: string) => void
  handleSortDirChange: (sortAscending: boolean) => void
  sortLabels: SortLabels
  className?: string
}

interface PageSizeSelectProps {
  paginationOptions: PaginationOptions
  onPageChange: (newPageOptions: PaginationOptions) => void
  makePageSizeLabel?: (pageSize: number) => string
  pageSizeSelectLabel?: React.ReactChild
  cardBreakpoint: Size
  className?: string
}

interface DataColumnProps extends Omit<TableCellProps, 'as' | 'title'> {
  id: string
  title: React.ReactChild
  sortable?: boolean
  as?: React.ComponentType<any>
}

interface ColumnProps extends Omit<TableCellProps, 'as' | 'title'> {
  children: ColumnFn
  title?: React.ReactChild
}

interface DataColumnObject {
  title: React.ReactChild
  sortable: boolean
  asComponent?: React.ComponentType<any>
  cellProps?: { [K: string]: any }
}

interface ColumnObject {
  columnFn: ColumnFn
  title?: React.ReactChild
  cellProps?: { [K: string]: any }
}

const IconWrapper = styled.div`
  flex-shrink: 1;
`

const TextWrapper = styled.div`
  flex-grow: 1;
`

const isDataColumn = (col: any): col is DataColumnObject => {
  return col && col.hasOwnProperty('sortable')
}
const isColumn = (col: any): col is ColumnObject => {
  return col && col.hasOwnProperty('columnFn')
}

const DataGridBase = (props: DataGridProps): ReactElement => {
  const {
    children,
    data,
    fullWidth,
    sortOptions,
    onSort = () => undefined,
    paginationOptions,
    onPageChange = () => undefined,
    cardBreakpoint = 'tiny',
    className,
    resultsCountText,
    pageSizeSelectLabel,
    makePageSizeLabel,
    paginationProps,
    prevNextProps,
    sortLabels = {},
  } = props
  const [columns, setColumns] = useState(new Map<string, DataColumnObject | ColumnObject>())
  const sortableColumns = useMemo(() => {
    const sortableCols: Map<string, DataColumnObject> = new Map()
    for (const k of columns.keys()) {
      let col = columns.get(k)
      if (col !== undefined && col.hasOwnProperty('sortable')) {
        col = col as DataColumnObject
        if (col.sortable) {
          sortableCols.set(k, col)
        }
      }
    }
    return sortableCols
  }, [columns])

  const size = useContext(ScreenSizeContext)
  const isCardView = cardBreakpoint && size <= SIZES[cardBreakpoint]

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

  const handleSort = (id: string, exists: boolean) => {
    if (sortOptions) {
      const { sortAscending: currentSortAscending } = sortOptions[0] || {}
      const newOptions = [{ id, sortAscending: exists ? !currentSortAscending : false }]
      onSort(newOptions)
    }
  }

  const handleSortColChange = (id: string) => {
    if (sortOptions) {
      const { sortAscending: currentSortAscending } = sortOptions[0] || {}
      const newOptions = [
        { id, sortAscending: currentSortAscending !== undefined ? currentSortAscending : false },
      ]
      onSort(newOptions)
    }
  }

  const handleSortDirChange = (sortAscending: boolean) => {
    if (sortOptions) {
      onSort([{ ...sortOptions[0], sortAscending }])
    }
  }

  return (
    <div className={className}>
      <DataGridContext.Provider value={{ addDataColumn, addColumn }}>
        {children}
        <TopSection
          onPageChange={onPageChange}
          pageSizeSelectLabel={pageSizeSelectLabel}
          resultsCountText={resultsCountText}
          paginationOptions={paginationOptions}
          makePageSizeLabel={makePageSizeLabel}
          cardBreakpoint={cardBreakpoint}
          isCardView={isCardView}
          sortableColumns={sortableColumns}
          handleSortColChange={handleSortColChange}
          handleSortDirChange={handleSortDirChange}
          sortLabels={sortLabels}
        />
        <Table fullWidth={fullWidth} cardBreakpoint={cardBreakpoint}>
          <Table.Header>
            {[...columns.keys()].map((key) => {
              const column = columns.get(key)
              if (isDataColumn(column)) {
                let sortOpt: SortOption | undefined = undefined
                if (column.sortable && sortOptions !== undefined) {
                  sortOpt = sortOptions.find((opt: SortOption): boolean => opt.id === key)
                }
                const flipChevron = sortOpt !== undefined && sortOpt.sortAscending === true
                return (
                  <Table.Cell
                    className={`table-cell ${flipChevron ? 'flip-chevron' : ''}`}
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
                    {...column.cellProps}
                  >
                    {column.sortable && sortOptions !== undefined && !isCardView ? (
                      <HeaderButton onClick={(): void => handleSort(key, sortOpt !== undefined)}>
                        <TextWrapper>{column.title}</TextWrapper>
                        <IconWrapper aria-hidden>
                          {sortOpt !== undefined && <NavigationChevronDown />}
                        </IconWrapper>
                      </HeaderButton>
                    ) : (
                      column.title
                    )}
                  </Table.Cell>
                )
              } else if (isColumn(column)) {
                return (
                  <Table.Cell key={`col-${key}`} {...column.cellProps}>
                    {column.title || ''}
                  </Table.Cell>
                )
              }
            })}
          </Table.Header>
          <Table.Body>
            {data.map(
              (datum, datumIndex): ReactElement => (
                <Table.Row key={`row-${datumIndex}`}>
                  {[...columns.keys()].map((key, keyIndex) => {
                    const column = columns.get(key)
                    if (isDataColumn(column)) {
                      const AsComponent = column.asComponent
                      return (
                        <Table.Cell key={`cell-${datumIndex}-${keyIndex}`} {...column.cellProps}>
                          {AsComponent ? <AsComponent value={datum[key]} /> : datum[key]}
                        </Table.Cell>
                      )
                    } else if (isColumn(column)) {
                      return (
                        <Table.Cell key={`cell-${datumIndex}-${keyIndex}`} {...column.cellProps}>
                          {column && column.columnFn(datum)}
                        </Table.Cell>
                      )
                    }
                  })}
                </Table.Row>
              )
            )}
          </Table.Body>
        </Table>
      </DataGridContext.Provider>
      <div className={`bottom-section ${isCardView ? 'is-card-view' : ''}`}>
        {paginationOptions !== undefined ? (
          paginationOptions.pageCount ? (
            <Pagination
              currentPage={paginationOptions.currentPage}
              pageCount={paginationOptions.pageCount}
              onPageChange={(page: number): void => {
                onPageChange({ ...paginationOptions, currentPage: page })
              }}
              {...paginationProps}
            />
          ) : (
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
              disableNext={
                prevNextProps
                  ? prevNextProps.disableNext || data.length < paginationOptions.pageSize
                  : data.length < paginationOptions.pageSize
              }
              {...prevNextProps}
            />
          )
        ) : null}
        {isCardView && resultsCountText !== undefined && (
          <span className="results-count-text">{resultsCountText}</span>
        )}
      </div>
    </div>
  )
}

const getMediaQuery = (
  props:
    | ThemedStyledProps<DataGridProps, DefaultTheme>
    | ThemedStyledProps<TopSectionProps, DefaultTheme>
    | ThemedStyledProps<PageSizeSelectProps, DefaultTheme>
) => {
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

export const DataGrid = styled(DataGridBase)`
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

  .bottom-section {
    // Card view styles
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 40px;

    .results-count-text {
      margin-top: 16px;
    }

    // Non-card view styles
    ${getMediaQuery} {
      flex-direction: row;
      justify-content: flex-end;
      margin-right: 16px;
    }

    // Card view styles when screen is larger than tiny
    &.is-card-view {
      ${(p) =>
        p.theme.mediaQueries &&
        `${p.theme.mediaQueries.small} {
        flex-direction: row-reverse;
        justify-content: space-between;
        margin-right: 16px;
        margin-top: 16px;

        .results-count-text {
          margin-top: 0px;
          margin-left: 16px;
        }
      }`}
    }
  }
` as any

const shapeMap = {
  square: 'border-radius: 1px;',
  intermediate: 'border-radius: 8px;',
  round: 'border-radius: 20px;',
}

const HeaderButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: inherit;
  font-size: inherit;
  text-transform: inherit;
  font-weight: inherit;
  padding: 0;
  cursor: pointer;
  position: relative;
  overflow: visible;

  &:focus {
    outline: none;

    &:after {
      content: '';
      box-sizing: border-box;
      position: absolute;
      height: calc(100% + 8px);
      width: calc(100% + 16px);
      bottom: -4px;
      right: -8px;
      border: ${(p) => border(p.theme, 'lightContrast')};
      ${(p) => shapeMap[p.theme.shape]}
    }
  }
`

const TopSectionBase = (props: TopSectionProps): ReactElement | null => {
  const {
    onPageChange,
    resultsCountText,
    pageSizeSelectLabel,
    makePageSizeLabel,
    paginationOptions,
    cardBreakpoint,
    isCardView,
    sortableColumns,
    handleSortColChange,
    handleSortDirChange,
    sortLabels,
    className,
  } = props
  return (
    <div className={className}>
      {resultsCountText && !isCardView && (
        <span className="results-count-text">{resultsCountText}</span>
      )}
      {isCardView && sortableColumns.size > 1 && (
        <div className="sort-buttons">
          <MenuButton variant="unfilled" label={sortLabels.sortBy || 'Sort by'} mr={4}>
            {[...sortableColumns.keys()].map(
              (key): ReactElement => {
                const col = sortableColumns.get(key) as DataColumnObject
                return (
                  <MenuButton.Item onSelect={() => handleSortColChange(key)}>
                    {col.title}
                  </MenuButton.Item>
                )
              }
            )}
          </MenuButton>
          <MenuButton variant="unfilled" label={sortLabels.order || 'Order'}>
            <MenuButton.Item onSelect={() => handleSortDirChange(true)}>
              {sortLabels.ascending || 'Ascending'}
            </MenuButton.Item>
            <MenuButton.Item onSelect={() => handleSortDirChange(false)}>
              {sortLabels.descending || 'Descending'}
            </MenuButton.Item>
          </MenuButton>
        </div>
      )}
      {paginationOptions !== undefined && paginationOptions.pageSizeOptions && (
        <PageSizeSelect
          paginationOptions={paginationOptions}
          pageSizeSelectLabel={pageSizeSelectLabel}
          makePageSizeLabel={makePageSizeLabel}
          onPageChange={onPageChange}
          cardBreakpoint={cardBreakpoint}
        />
      )}
    </div>
  )
}

const TopSection = styled(TopSectionBase)`
  // Card view styles
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;

  ${(p) =>
    (p.isCardView && p.sortableColumns.size > 0) ||
    (p.paginationOptions?.pageSizeOptions !== undefined &&
      p.paginationOptions?.pageSizeOptions.length > 0)
      ? 'margin-bottom: 40px;'
      : ''}

  // Non-card view styles
  ${getMediaQuery} {
    flex-direction: row;
    align-items: flex-start;

    ${(p) =>
      p.resultsCountText !== undefined && p.resultsCountText !== null && 'margin-bottom: 40px;'}
  }

  .sort-buttons {
    ${(p) =>
      p.paginationOptions?.pageSizeOptions !== undefined &&
      p.paginationOptions?.pageSizeOptions.length > 0 &&
      'margin-bottom: 16px;'}
  }

  // Card view styles when screen is larger than tiny
  ${(p) =>
    p.isCardView &&
    `${p.theme.mediaQueries && p.theme.mediaQueries.small} {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;
    .sort-buttons {
      margin-bottom: 0px;
    }
  }`}
`

const PageSizeSelectBase = (props: PageSizeSelectProps): ReactElement => {
  const { paginationOptions, onPageChange, pageSizeSelectLabel, className } = props
  const { pageSizeOptions } = paginationOptions
  const makePageSizeLabel = props.makePageSizeLabel || (() => undefined)
  return (
    <div className={className}>
      <span>{pageSizeSelectLabel || 'View'}</span>
      <ol className="page-options-list">
        {pageSizeOptions &&
          pageSizeOptions.map(
            (pageSize): ReactElement => {
              const isCurrentPageSize = paginationOptions.pageSize === pageSize
              return (
                <li className="page-option" key={`page-size-option-${pageSize}`}>
                  <a
                    role="link"
                    aria-selected={isCurrentPageSize ? 'true' : 'false'}
                    onClick={(): void => {
                      onPageChange({ ...paginationOptions, pageSize: pageSize })
                    }}
                    onKeyPress={keyPressAsClick}
                    tabIndex={isCurrentPageSize ? undefined : 0}
                    aria-label={makePageSizeLabel(pageSize)}
                  >
                    {pageSize}
                  </a>
                </li>
              )
            }
          )}
      </ol>
    </div>
  )
}

const PageSizeSelect = styled(PageSizeSelectBase)`
  display: inline-box;

  ${(p) => p.theme.mediaQueries && p.theme.mediaQueries.small} {
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

    border-left: ${(p): string => border(p.theme, 'lightContrast')};

    &:last-child {
      border-right: ${(p): string => border(p.theme, 'lightContrast')};
    }

    &,
    a {
      color: ${(p): string => p.theme.colors.darkestContrast};
      ${(p): string => fontSize(p.theme, 'small')};
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
        color: ${(p): string => p.theme.colors.callToAction};
      }

      &:active,
      &:focus {
        // Re-stated to prevent a small shift when the button is clicked in Firefox
        padding: 3px;
        outline: none;
        ${(p): ColorStyle => p.theme.colorStyles.callToAction};
      }

      &[aria-selected='true'] {
        ${(p): ColorStyle => p.theme.colorStyles.base};
      }
    }
  }
`

export const DataColumn = (props: DataColumnProps): ReactElement => {
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

PageSizeSelect.defaultProps = {
  makePageSizeLabel: (pageSize: number): string => `View ${pageSize} rows per page`,
}

DataGrid.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  paginationOptions: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    pageCount: PropTypes.number,
    pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  }),
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, sortAscending: PropTypes.bool.isRequired })
  ),
  onPageChange: PropTypes.func,
  onSort: PropTypes.func,
  children: PropTypes.node.isRequired,
  fullWidth: PropTypes.bool,
  resultsCountText: PropTypes.node,
  pageSizeSelectLabel: PropTypes.node,
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
    prevText: PropTypes.node,
    nextText: PropTypes.node,
    disableNext: PropTypes.bool,
  }),
  cardBreakpoint: PropTypes.oneOf<Size>(['tiny', 'small', 'medium', 'large', 'extraLarge']),
  sortLabels: PropTypes.shape({
    sortBy: PropTypes.node,
    order: PropTypes.node,
    ascending: PropTypes.node,
    descending: PropTypes.node,
  }),
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
  sortLabels: {
    sortBy: 'Sort by',
    order: 'Order',
    ascending: 'Ascending',
    descending: 'Descending',
  },
}

type DataGridType = StyledComponent<typeof DataGridBase, DefaultTheme, DataGridProps> & {
  DataColumn: React.ComponentType<DataColumnProps>
  Column: React.ComponentType<ColumnProps>
}

DataGrid.DataColumn = DataColumn
DataGrid.Column = Column

export default DataGrid as DataGridType
