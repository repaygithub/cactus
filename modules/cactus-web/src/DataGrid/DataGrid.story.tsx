import React, { ReactElement, useContext, useState } from 'react'

import { DataGrid, ScreenSizeContext, SIZES, SplitButton } from '../'
import { HIDE_CONTROL, SPACE, Story, STRING } from '../helpers/storybook'
import { StickyColAlignment } from '../Table/Table'
import { JustifyContent } from './types'

interface Datum {
  name: string
  created: string
  updated: string
  items: number
  author: string
  active: boolean
}

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
const justifyOptions: JustifyContent[] = [
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
  topSection: boolean
  sticky: StickyColAlignment
  fullWidth: boolean
  justifyTop: JustifyContent
  spacingTop: string
  pageSizeSelectLabel: string
  justifyBottom: JustifyContent
  spacingBottom: string
  paginationLabel: string
  currentPageLabel: string
  prevPageLabel: string
  nextPageLabel: string
  lastPageLabel: string
}

const DataGridContainer: Story<typeof DataGrid, Args> = ({
  align,
  initialData,
  includePaginationAndSort = true,
  cardBreakpoint,
  variant,
  fullWidth,
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
  topSection,
  justifyTop,
  spacingTop,
  pageSizeSelectLabel,
  justifyBottom,
  spacingBottom,
  paginationLabel,
  currentPageLabel,
  prevPageLabel,
  nextPageLabel,
  lastPageLabel,
  margin,
  sticky,
}) => {
  const size = useContext(ScreenSizeContext)
  const isCardView = cardBreakpoint && size <= SIZES[cardBreakpoint]

  const [data, setData] = useState<Datum[]>(initialData)
  const [paginationOptions, setPaginationOptions] = useState<{
    currentPage: number
    pageSize: number
    itemOffset?: number
  }>({ currentPage: 1, pageSize: 4 })

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

  const onSort = (newSortOptions: { id: string; sortAscending: boolean }[]): void => {
    const sortId = newSortOptions[0].id
    const sortAscending = newSortOptions[0].sortAscending
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
  const { itemOffset = 0, pageSize } = paginationOptions
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
      onSort={onSort}
      onPageChange={setPaginationOptions}
      fullWidth={fullWidth}
      cardBreakpoint={cardBreakpoint}
      variant={variant}
      margin={margin}
    >
      {topSection && (
        <DataGrid.TopSection justifyContent={justifyTop} spacing={spacingTop}>
          {showResultsCount && !isCardView && <span>{getResultsCountText()}</span>}
          {includePaginationAndSort && providePageSizeSelect && (
            <DataGrid.PageSizeSelect
              pageSize={pageSize}
              pageSizeOptions={[4, 6, 12]}
              pageSizeSelectLabel={pageSizeSelectLabel}
            />
          )}
        </DataGrid.TopSection>
      )}
      <DataGrid.Table data={usableData} dividers={dividers} sticky={sticky}>
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
            <SplitButton
              onSelectMainAction={(): void => {
                return
              }}
              mainActionLabel="Edit"
            >
              <SplitButton.Action onSelect={() => clone(rowIndex + itemOffset)}>
                Clone
              </SplitButton.Action>
              <SplitButton.Action onSelect={() => deleteRow(rowIndex + itemOffset)}>
                Delete
              </SplitButton.Action>
            </SplitButton>
          )}
        </DataGrid.Column>
      </DataGrid.Table>
      <DataGrid.BottomSection justifyContent={justifyBottom} spacing={spacingBottom}>
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
      </DataGrid.BottomSection>
    </DataGrid>
  )
}

export default {
  title: 'DataGrid',
  component: DataGrid,
  argTypes: {
    paginationOptions: HIDE_CONTROL,
    sortOptions: HIDE_CONTROL,
    onPageChange: HIDE_CONTROL,
    onSort: HIDE_CONTROL,
    cardBreakpoint: { options: ['tiny', 'small', 'medium', 'large'] },
    variant: { options: ['table', 'card', 'mini'] },
    activeColumnWidth: { name: 'active column width', ...STRING },
    actionColumnWidth: { name: 'action column width', ...STRING },
    initialData: HIDE_CONTROL,
  },
  args: {
    cardBreakpoint: 'tiny',
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
  fullWidth: { name: 'Full Width' },
  topSection: { name: 'show top section' },
  justifyTop: {
    name: 'top section: justifyContent',
    options: justifyOptions,
  },
  spacingTop: { name: 'top section: spacing', ...SPACE },
  pageSizeSelectLabel: { name: 'rows per page label', ...STRING },
  justifyBottom: {
    name: 'bottom section: justifyContent',
    options: justifyOptions,
  },
  spacingBottom: { name: 'bottom section: spacing', ...SPACE },
  paginationLabel: { name: 'Pagination: label', ...STRING },
  currentPageLabel: { name: 'Pagination: currentPageLabel', ...STRING },
  prevPageLabel: { name: 'Pagination: prevPageLabel', ...STRING },
  nextPageLabel: { name: 'Pagination: nextPageLabel', ...STRING },
  lastPageLabel: { name: 'Pagination: lastPageLabel', ...STRING },
  margin: SPACE,
}
BasicUsage.args = {
  initialData: INITIAL_DATA,
  showResultsCount: true,
  providePageSizeSelect: true,
  providePageCount: true,
  prevText: 'Prev',
  nextText: 'Next',
  sortableCols: true,
  topSection: true,
  justifyTop: 'space-between',
  spacingTop: '4',
  justifyBottom: 'flex-end',
  spacingBottom: '4',
  sticky: 'none',
  fullWidth: true,
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
