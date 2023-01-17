import React, { ReactElement, useContext, useState } from 'react'

import { DataGrid, ScreenSizeContext, SIZES, SplitButton } from '../'
import { HIDE_CONTROL, SPACE, Story, STRING } from '../helpers/storybook'
import { FocusOption, StickyColAlignment, TableVariant } from '../Table/Table'
import { Datum, Pagisort, SortInfo } from './types'

const INITIAL_DATA = [
  {
    name: 'Config 1',
    created: '4/13/2020',
    updated: '6/29/2022',
    items: 0,
    author: 'unknown',
    active: true,
  },
  {
    name: 'Config 2',
    created: '5/25/2019',
    updated: '6/29/2022',
    items: 3,
    author: 'unknown',
    active: true,
  },
  {
    name: 'Config 3',
    created: '8/16/2019',
    updated: '6/29/2022',
    items: 2,
    author: 'unknown',
    active: false,
  },
  {
    name: 'Config 4',
    created: '2/20/2019',
    updated: '6/29/2022',
    items: 3,
    author: 'unknown',
    active: true,
  },
  {
    name: 'Config 5',
    created: '5/16/2019',
    updated: '6/29/2022',
    items: 3,
    author: 'unknown',
    active: false,
  },
  {
    name: 'Config 6',
    created: '10/31/2019',
    updated: '6/29/2022',
    items: 3,
    author: 'unknown',
    active: true,
  },
  {
    name: 'Config 7',
    created: '11/23/2019',
    updated: '6/29/2022',
    items: 3,
    author: 'unknown',
    active: true,
  },
  {
    name: 'Config 8',
    created: '3/20/2020',
    updated: '6/29/2022',
    items: 3,
    author: 'unknown',
    active: false,
  },
  {
    name: 'Config 9',
    created: '6/13/2020',
    updated: '6/29/2022',
    items: 2,
    author: 'unknown',
    active: false,
  },
  {
    name: 'Config 10',
    created: '7/1/2020',
    updated: '6/29/2022',
    items: 3,
    author: 'unknown',
    active: true,
  },
  {
    name: 'Config 11',
    created: '3/3/2020',
    updated: '6/29/2022',
    items: 3,
    author: 'Danilo',
    active: true,
  },
]
const justifyOptions = [
  'unset',
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
]

const BoolComponent = ({ value }: { value: boolean }): ReactElement => {
  return <div>{value ? 'YES' : 'NO'}</div>
}

interface Args {
  align: 'center' | 'right' | 'left'
  initialData: Datum[]
  includePaginationAndSort?: boolean
  activeColumnWidth: string
  actionColumnWidth: string
  dividers: boolean
  showResultsCount: boolean
  providePageSizeSelect: boolean
  providePageCount: boolean
  prevText: string
  nextText: string
  disableNext: boolean
  sortableCols: boolean
  sticky: StickyColAlignment
  width: string
  justifyContent: string
  gap: string
  pageSizeSelectLabel: string
  paginationLabel: string
  currentPageLabel: string
  prevPageLabel: string
  nextPageLabel: string
  lastPageLabel: string
  rowFocus: FocusOption
  rowHover: boolean
  showSortMenu: boolean | 'card-only'
  variant: TableVariant
}

const DataGridContainer: Story<typeof DataGrid, Args> = ({
  align,
  initialData,
  includePaginationAndSort = true,
  variant,
  width,
  justifyContent,
  gap,
  activeColumnWidth,
  actionColumnWidth,
  dividers,
  showResultsCount,
  providePageSizeSelect,
  providePageCount,
  prevText,
  nextText,
  disableNext,
  sortableCols,
  pageSizeSelectLabel,
  paginationLabel,
  currentPageLabel,
  prevPageLabel,
  nextPageLabel,
  lastPageLabel,
  margin,
  sticky,
  rowFocus,
  rowHover,
  showSortMenu,
}) => {
  const size = useContext(ScreenSizeContext)
  const isCardView = variant === 'card' || (!variant && size === SIZES.tiny)

  const [data, setData] = useState<Datum[]>(initialData)
  const [pageSize, setPageSize] = useState<number>(4)
  const [itemOffset, setItemOffset] = useState<number>(0)

  const onPagisort = (options: Pagisort) => {
    options.pageSize && setPageSize(options.pageSize)
    setItemOffset(options.itemOffset || 0)
  }

  const clone = (index: number) =>
    setData((currentData): Datum[] => {
      const rowData = currentData[index]
      return [...currentData, { ...rowData, name: `${rowData.name} Copy` }]
    })

  const deleteRow = (deleteIndex: number) =>
    setData((currentData) => {
      const newData = [...currentData]
      newData.splice(deleteIndex, 1)
      return newData
    })

  const onSort = ({ id: sortId, sortAscending }: SortInfo): void => {
    const dataCopy = [...data]
    if (sortId === 'created') {
      if (sortAscending) {
        dataCopy.sort((a: Datum, b: Datum): number => {
          return Date.parse(a.created) - Date.parse(b.created)
        })
      } else {
        dataCopy.sort((a: Datum, b: Datum): number => {
          return Date.parse(b.created) - Date.parse(a.created)
        })
      }
    } else if (sortId === 'active') {
      if (sortAscending) {
        dataCopy.sort((a: Datum, b: Datum): number => {
          return a.active === b.active ? 0 : a.active ? 1 : -1
        })
      } else {
        dataCopy.sort((a: Datum, b: Datum): number => {
          return a.active === b.active ? 0 : a.active ? -1 : 1
        })
      }
    }
    setData(dataCopy)
  }

  const itemCount = data.length
  const firstItem = itemOffset + 1

  const paginateData = (): Datum[] => {
    return data.slice(itemOffset, itemOffset + pageSize)
  }

  const getResultsCountText = (): string => {
    const lastItem = Math.min(itemOffset + pageSize, itemCount)
    if (providePageCount) {
      return `Showing ${firstItem} to ${lastItem} of ${itemCount}`
    } else {
      return `Showing ${firstItem} to ${lastItem}`
    }
  }

  const usableData = includePaginationAndSort ? paginateData() : data

  return (
    <DataGrid
      onPagisort={onPagisort}
      width={width}
      margin={margin}
      gap={gap}
      justifyContent={justifyContent}
      data={usableData}
    >
      <DataGrid.Sort onSort={onSort} showSortMenu={showSortMenu} />
      {showResultsCount && !isCardView && <span>{getResultsCountText()}</span>}
      {includePaginationAndSort && providePageSizeSelect && (
        <DataGrid.PageSizeSelect
          pageSize={pageSize}
          pageSizeOptions={[4, 6, 12]}
          pageSizeSelectLabel={pageSizeSelectLabel}
        />
      )}
      <DataGrid.Table
        variant={variant}
        dividers={dividers}
        sticky={sticky}
        rowFocus={rowFocus}
        rowHover={rowHover}
      >
        <DataGrid.DataColumn id="name" title="Name" align={align} />
        <DataGrid.DataColumn id="created" title="Created" sortable={sortableCols} align={align} />
        <DataGrid.DataColumn id="updated" title="Updated" sortable={sortableCols} align={align} />
        <DataGrid.DataColumn id="items" title="Items" sortable={sortableCols} align={align} />
        <DataGrid.DataColumn id="author" title="Author" sortable={sortableCols} align={align} />
        <DataGrid.DataColumn
          id="active"
          title="Active"
          as={BoolComponent}
          sortable={sortableCols}
          width={activeColumnWidth}
          align={align}
        />
        <DataGrid.Column width={actionColumnWidth}>
          {(_, { rowIndex }) => (
            <SplitButton>
              <SplitButton.Action main>Edit</SplitButton.Action>
              <SplitButton.Action onClick={() => clone(rowIndex + itemOffset)}>
                Clone this row
              </SplitButton.Action>
              <SplitButton.Action onClick={() => deleteRow(rowIndex + itemOffset)}>
                Delete
              </SplitButton.Action>
            </SplitButton>
          )}
        </DataGrid.Column>
      </DataGrid.Table>
      {isCardView && showResultsCount && size.toString() !== 'tiny' ? (
        <span>{getResultsCountText()}</span>
      ) : null}
      {includePaginationAndSort ? (
        providePageCount ? (
          <DataGrid.Pagination
            itemCount={itemCount}
            itemOffset={itemOffset}
            label={paginationLabel}
            currentPageLabel={currentPageLabel}
            prevPageLabel={prevPageLabel}
            nextPageLabel={nextPageLabel}
            lastPageLabel={lastPageLabel}
          />
        ) : (
          <DataGrid.PrevNext
            itemOffset={itemOffset}
            prevText={prevText}
            nextText={nextText}
            disableNext={usableData.length < pageSize || disableNext}
          />
        )
      ) : null}
      {isCardView && showResultsCount && size.toString() === 'tiny' ? (
        <span>{getResultsCountText()}</span>
      ) : null}
    </DataGrid>
  )
}

export default {
  title: 'DataGrid',
  component: DataGrid,
  argTypes: {
    onPagisort: HIDE_CONTROL,
    variant: { options: ['table', 'card', 'mini'] },
    activeColumnWidth: { name: 'active column width', ...STRING },
    actionColumnWidth: { name: 'action column width', ...STRING },
    initialData: HIDE_CONTROL,
    data: HIDE_CONTROL,
  },
  args: {
    dividers: false,
  },
} as const

export const BasicUsage = DataGridContainer.bind(null)
BasicUsage.argTypes = {
  align: { options: ['left', 'center', 'right'] },
  showResultsCount: { name: 'show result count' },
  providePageSizeSelect: { name: 'show page size select' },
  providePageCount: { name: 'show page count' },
  prevText: { name: 'PrevNext: prevText', ...STRING },
  nextText: { name: 'PrevNext: nextText', ...STRING },
  disableNext: { name: 'PrevNext: disableNext', control: 'boolean' },
  sortableCols: { name: 'include sortable columns' },
  sticky: { name: 'Sticky column', options: ['none', 'right'] },
  width: STRING,
  justifyContent: { name: 'flex justify', options: justifyOptions },
  gap: { name: 'flex gap', ...SPACE },
  pageSizeSelectLabel: { name: 'rows per page label', ...STRING },
  paginationLabel: { name: 'Pagination: label', ...STRING },
  currentPageLabel: { name: 'Pagination: currentPageLabel', ...STRING },
  prevPageLabel: { name: 'Pagination: prevPageLabel', ...STRING },
  nextPageLabel: { name: 'Pagination: nextPageLabel', ...STRING },
  lastPageLabel: { name: 'Pagination: lastPageLabel', ...STRING },
  margin: SPACE,
  rowFocus: { options: [true, false, 'mouse-only'] },
  showSortMenu: {
    options: [true, false, 'card-only'],
    mapping: { true: true, false: false },
  },
}
BasicUsage.args = {
  initialData: INITIAL_DATA,
  showResultsCount: true,
  providePageSizeSelect: true,
  providePageCount: true,
  prevText: 'Prev',
  nextText: 'Next',
  sortableCols: true,
  justifyContent: 'space-between',
  gap: '4',
  sticky: 'none',
  rowFocus: true,
  rowHover: true,
}

export const LotsAndLotsOfRows = DataGridContainer.bind(null)
LotsAndLotsOfRows.argTypes = { includePaginationAndSort: HIDE_CONTROL }
LotsAndLotsOfRows.args = {
  includePaginationAndSort: false,
  initialData: INITIAL_DATA.concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA)
    .concat(INITIAL_DATA),
}
LotsAndLotsOfRows.parameters = {
  cactus: {
    overrides: {
      textAlign: 'center',
    },
    // Only applies to flex container
    align: 'top',
  },
}
LotsAndLotsOfRows.storyName = 'Lots and Lots of Rows'
