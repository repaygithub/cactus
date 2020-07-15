import React, { useState } from 'react'

import { boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import DataGrid from './DataGrid'
import ScreenSizeProvider from '../ScreenSizeProvider/ScreenSizeProvider'
import SplitButton from '../SplitButton/SplitButton'

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

const BoolComponent = ({ value }: { value: boolean }) => {
  return <div>{value ? 'YES' : 'NO'}</div>
}

const DataGridContainer = () => {
  const showResultsCount = boolean('Show Results Count', true)
  const providePageSizeOptions = boolean('Provide Page Size Options', true)
  const providePageCount = boolean('Provide Page Count', true)
  const prevText = text('PrevNext: prevText', 'Prev')
  const nextText = text('PrevNext: nextText', 'Next')
  const disableNext = boolean('PrevNext: disableNext', false)

  const [data, setData] = useState<Array<{ [key: string]: any }>>(INITIAL_DATA)
  const [sortOptions, setSortOptions] = useState<Array<{ id: string; sortAscending: boolean }>>([])
  const [paginationOptions, setPaginationOptions] = useState<{
    currentPage: number
    pageSize: number
    pageCount?: number
    pageSizeOptions?: Array<number>
  }>({ currentPage: 1, pageCount: 3, pageSize: 4, pageSizeOptions: [4, 6, 12] })

  const clone = (rowData: { [key: string]: any }) => {
    setData((currentData) => [...currentData, { ...rowData, name: `${rowData.name} Copy` }])
  }

  const deleteRow = (rowData: { [key: string]: any }) => {
    const deleteIndex = data.findIndex((datum) => datum.name === rowData.name)
    setData((currentData) => {
      const newData = [...currentData]
      newData.splice(deleteIndex, 1)
      return newData
    })
  }

  const onSort = (newSortOptions: Array<{ id: string; sortAscending: boolean }>) => {
    const sortId = newSortOptions[0].id
    const sortAscending = newSortOptions[0].sortAscending
    const dataCopy = JSON.parse(JSON.stringify(data))
    if (sortId === 'created') {
      if (sortAscending) {
        dataCopy.sort((a: Datum, b: Datum) => {
          return (new Date(a.created) as any) - (new Date(b.created) as any)
        })
      } else {
        dataCopy.sort((a: Datum, b: Datum) => {
          return (new Date(b.created) as any) - (new Date(a.created) as any)
        })
      }
    } else if (sortId === 'active') {
      if (sortAscending) {
        dataCopy.sort((a: Datum, b: Datum) => {
          return a.active === b.active ? 0 : a.active ? 1 : -1
        })
      } else {
        dataCopy.sort((a: Datum, b: Datum) => {
          return a.active === b.active ? 0 : a.active ? -1 : 1
        })
      }
    }
    setData(dataCopy)
    setSortOptions(newSortOptions)
  }

  const paginateData = () => {
    const index1 = (paginationOptions.currentPage - 1) * paginationOptions.pageSize
    const index2 = index1 + paginationOptions.pageSize
    return data.slice(index1, index2)
  }

  const onPageChange = (newPaginationOptions: {
    currentPage: number
    pageSize: number
    pageCount?: number
  }) => {
    if (newPaginationOptions.pageSize !== paginationOptions.pageSize) {
      newPaginationOptions.pageCount = Math.ceil(data.length / newPaginationOptions.pageSize)
    }
    setPaginationOptions(newPaginationOptions)
  }

  const getResultsCountText = () => {
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

  const getPaginationOptions = () => {
    const paginationOptsCopy = JSON.parse(JSON.stringify(paginationOptions))
    if (!providePageSizeOptions) {
      paginationOptsCopy.pageSizeOptions = undefined
    }

    if (!providePageCount) {
      paginationOptsCopy.pageCount = undefined
    }

    return paginationOptsCopy
  }

  return (
    <ScreenSizeProvider>
      <DataGrid
        data={paginateData()}
        sortOptions={sortOptions}
        onSort={onSort}
        paginationOptions={getPaginationOptions()}
        onPageChange={onPageChange}
        fullWidth={boolean('fullWidth', false)}
        resultsCountText={showResultsCount ? getResultsCountText() : undefined}
        pageSizeSelectLabel={text('pageSizeSelectLabel', '')}
        paginationProps={{
          label: text('Pagination: label', ''),
          currentPageLabel: text('Pagination: currentPageLabel', ''),
          prevPageLabel: text('Pagination: prevPageLabel', ''),
          nextPageLabel: text('Pagination: nextPageLabel', ''),
          lastPageLabel: text('Pagination: lastPageLabel', ''),
        }}
        prevNextProps={
          disableNext
            ? {
                prevText,
                nextText,
                disableNext,
              }
            : {
                prevText,
                nextText,
              }
        }
      >
        <DataGrid.DataColumn id="name" title="Name" />
        <DataGrid.DataColumn id="created" title="Created" sortable={true} />
        <DataGrid.DataColumn id="active" title="Active" as={BoolComponent} sortable={true} />
        <DataGrid.Column>
          {(rowData) => (
            <SplitButton onSelectMainAction={() => {}} mainActionLabel="Edit">
              <SplitButton.Action
                onSelect={() => {
                  clone(rowData)
                }}
              >
                Clone
              </SplitButton.Action>
              <SplitButton.Action onSelect={() => deleteRow(rowData)}>Delete</SplitButton.Action>
            </SplitButton>
          )}
        </DataGrid.Column>
      </DataGrid>
    </ScreenSizeProvider>
  )
}

storiesOf('DataGrid', module).add('Basic Usage', () => <DataGridContainer />)
