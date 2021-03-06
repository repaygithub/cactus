import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React, { ReactElement, useContext, useState } from 'react'

import { DataGrid, ScreenSizeContext, SIZES, SplitButton } from '../'
import { JustifyContent } from './types'

interface Datum {
  name: string
  created: string
  active: boolean
}

const INITIAL_DATA = [
  {
    name: 'Config 1',
    created: '4/13/2020',
    active: true,
  },
  {
    name: 'Config 2',
    created: '5/25/2019',
    active: true,
  },
  {
    name: 'Config 3',
    created: '8/16/2019',
    active: false,
  },
  {
    name: 'Config 4',
    created: '2/20/2019',
    active: true,
  },
  {
    name: 'Config 5',
    created: '5/16/2019',
    active: false,
  },
  {
    name: 'Config 6',
    created: '10/31/2019',
    active: true,
  },
  {
    name: 'Config 7',
    created: '11/23/2019',
    active: true,
  },
  {
    name: 'Config 8',
    created: '3/20/2020',
    active: false,
  },
  {
    name: 'Config 9',
    created: '6/13/2020',
    active: false,
  },
  {
    name: 'Config 10',
    created: '7/1/2020',
    active: true,
  },
  {
    name: 'Config 11',
    created: '3/3/2020',
    active: true,
  },
]

type Variant = 'table' | 'card' | 'mini'
const varOptions = {
  undefined: '',
  table: 'table',
  card: 'card',
  mini: 'mini',
}

const BoolComponent = ({ value }: { value: boolean }): ReactElement => {
  return <div>{value ? 'YES' : 'NO'}</div>
}

const DataGridContainer = ({
  initialData,
  includePaginationAndSort = true,
}: {
  initialData: Record<string, any>[]
  includePaginationAndSort?: boolean
}): ReactElement => {
  const cardBreakpoint = select(
    'cardBreakpoint',
    ['tiny', 'small', 'medium', 'large', 'extraLarge'],
    'tiny'
  )
  const variant = select('variant', varOptions, undefined) as Variant
  const size = useContext(ScreenSizeContext)
  const isCardView = cardBreakpoint && size <= SIZES[cardBreakpoint]
  const showResultsCount = includePaginationAndSort
    ? boolean('Show Results Count', true)
    : undefined
  const providePageSizeSelect = includePaginationAndSort
    ? boolean('Provide Page Size Select', true)
    : undefined
  const providePageCount = includePaginationAndSort
    ? boolean('Provide Page Count', true)
    : undefined
  const prevText = includePaginationAndSort ? text('PrevNext: prevText', 'Prev') : undefined
  const nextText = includePaginationAndSort ? text('PrevNext: nextText', 'Next') : undefined
  const disableNext = includePaginationAndSort ? boolean('PrevNext: disableNext', false) : undefined
  const sortableCols = includePaginationAndSort
    ? boolean('Include Sortable Columns', true)
    : undefined

  const [data, setData] = useState<{ [key: string]: any }[]>(initialData)
  const [sortOptions, setSortOptions] = useState<{ id: string; sortAscending: boolean }[]>([])
  const [paginationOptions, setPaginationOptions] = useState<{
    currentPage: number
    pageSize: number
    pageCount?: number
  }>({ currentPage: 1, pageCount: 3, pageSize: 4 })

  const clone = (rowData: { [key: string]: any }): void => {
    setData((currentData): { [key: string]: any }[] => [
      ...currentData,
      { ...rowData, name: `${rowData.name} Copy` },
    ])
  }

  const deleteRow = (rowData: { [key: string]: any }): void => {
    const deleteIndex = data.findIndex((datum): boolean => datum.name === rowData.name)
    setData((currentData): { [key: string]: any }[] => {
      const newData = [...currentData]
      newData.splice(deleteIndex, 1)
      return newData
    })
  }

  const onSort = (newSortOptions: { id: string; sortAscending: boolean }[]): void => {
    const sortId = newSortOptions[0].id
    const sortAscending = newSortOptions[0].sortAscending
    const dataCopy = JSON.parse(JSON.stringify(data))
    if (sortId === 'created') {
      if (sortAscending) {
        dataCopy.sort((a: Datum, b: Datum): number => {
          return (new Date(a.created) as any) - (new Date(b.created) as any)
        })
      } else {
        dataCopy.sort((a: Datum, b: Datum): number => {
          return (new Date(b.created) as any) - (new Date(a.created) as any)
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
    setSortOptions(newSortOptions)
  }

  const paginateData = (): { [key: string]: any }[] => {
    const index1 = (paginationOptions.currentPage - 1) * paginationOptions.pageSize
    const index2 = index1 + paginationOptions.pageSize
    return data.slice(index1, index2)
  }

  const onPageChange = (newPaginationOptions: {
    currentPage: number
    pageSize: number
    pageCount?: number
  }): void => {
    if (newPaginationOptions.pageSize !== paginationOptions.pageSize) {
      newPaginationOptions.pageCount = Math.ceil(data.length / newPaginationOptions.pageSize)
    }
    setPaginationOptions(newPaginationOptions)
  }

  const getResultsCountText = (): string => {
    if (paginationOptions.pageCount) {
      return `Showing ${(paginationOptions.currentPage - 1) * paginationOptions.pageSize + 1} to ${
        paginationOptions.currentPage * paginationOptions.pageSize
      } of ${data.length}`
    } else {
      return `Showing ${(paginationOptions.currentPage - 1) * paginationOptions.pageSize + 1} to ${
        paginationOptions.currentPage * paginationOptions.pageSize
      }`
    }
  }

  const getPaginationOptions = (): {
    currentPage: number
    pageSize: number
    pageCount?: number
  } => {
    const paginationOptsCopy = JSON.parse(JSON.stringify(paginationOptions))
    if (!providePageSizeSelect) {
      paginationOptsCopy.pageSizeOptions = undefined
    }

    if (!providePageCount) {
      paginationOptsCopy.pageCount = undefined
    }

    return paginationOptsCopy
  }

  const usableData = includePaginationAndSort ? paginateData() : data
  const topSection = boolean('topSection', true)
  const justifyOptions: JustifyContent[] = [
    'unset',
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'space-evenly',
  ]

  return (
    <DataGrid
      sortOptions={includePaginationAndSort ? sortOptions : undefined}
      onSort={onSort}
      paginationOptions={includePaginationAndSort ? getPaginationOptions() : undefined}
      onPageChange={onPageChange}
      fullWidth={boolean('fullWidth', false)}
      cardBreakpoint={cardBreakpoint}
      variant={variant}
    >
      {topSection && (
        <DataGrid.TopSection
          justifyContent={select('justifyContent Top', justifyOptions, 'space-between')}
          spacing={select('spacing top', [0, 1, 2, 3, 4, 5, 6, 7], 4)}
        >
          {showResultsCount && !isCardView && <span>{getResultsCountText()}</span>}
          {includePaginationAndSort && providePageSizeSelect && (
            <DataGrid.PageSizeSelect
              pageSizeOptions={[4, 6, 12]}
              pageSizeSelectLabel={text('pageSizeSelectLabel', '')}
            />
          )}
        </DataGrid.TopSection>
      )}
      <DataGrid.Table
        data={includePaginationAndSort ? paginateData() : data}
        dividers={boolean('dividers', false)}
      >
        <DataGrid.DataColumn id="name" title="Name" />
        <DataGrid.DataColumn id="created" title="Created" sortable={sortableCols} />
        <DataGrid.DataColumn
          id="active"
          title="Active"
          as={BoolComponent}
          sortable={sortableCols}
          width={text('Active Column Width', '')}
        />
        <DataGrid.Column width={text('Action Column Width', '')}>
          {(rowData): ReactElement => (
            <SplitButton
              onSelectMainAction={(): void => {
                return
              }}
              mainActionLabel="Edit"
            >
              <SplitButton.Action
                onSelect={(): void => {
                  clone(rowData)
                }}
              >
                Clone
              </SplitButton.Action>
              <SplitButton.Action onSelect={(): void => deleteRow(rowData)}>
                Delete
              </SplitButton.Action>
            </SplitButton>
          )}
        </DataGrid.Column>
      </DataGrid.Table>
      <DataGrid.BottomSection
        justifyContent={select('justifyContent bottom', justifyOptions, 'flex-end')}
        spacing={select('spacing bottom', [0, 1, 2, 3, 4, 5, 6, 7], 4)}
      >
        {isCardView && showResultsCount && size.toString() !== 'tiny' ? (
          <span>{getResultsCountText()}</span>
        ) : null}
        {includePaginationAndSort ? (
          providePageCount ? (
            <DataGrid.Pagination
              label={text('Pagination: label', '')}
              currentPageLabel={text('Pagination: currentPageLabel', '')}
              prevPageLabel={text('Pagination: prevPageLabel', '')}
              nextPageLabel={text('Pagination: nextPageLabel', '')}
              lastPageLabel={text('Pagination: lastPageLabel', '')}
            />
          ) : (
            <DataGrid.PrevNext
              prevText={prevText}
              nextText={nextText}
              disableNext={usableData.length < getPaginationOptions().pageSize || disableNext}
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
} as Meta

export const BasicUsage = (): ReactElement => <DataGridContainer initialData={INITIAL_DATA} />

BasicUsage.parameters = {
  cactus: {
    overrides: {
      display: 'block',
      textAlign: 'center',
      paddingTop: '16px',
      paddingBottom: '16px',
    },
  },
}

export const LotsAndLotsOfRows = (): React.ReactElement => (
  <DataGridContainer
    initialData={INITIAL_DATA.concat(INITIAL_DATA)
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
      .concat(INITIAL_DATA)}
    includePaginationAndSort={false}
  />
)

LotsAndLotsOfRows.storyName = 'Lots and Lots of Rows'

LotsAndLotsOfRows.parameters = {
  cactus: {
    overrides: {
      display: 'block',
      textAlign: 'center',
      paddingTop: '16px',
      paddingBottom: '16px',
    },
  },
}
