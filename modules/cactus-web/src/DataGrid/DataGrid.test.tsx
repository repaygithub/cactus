import { fireEvent } from '@testing-library/react'
import React, { useContext, useState } from 'react'
import { MarginProps } from 'styled-system'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import { ScreenSizeContext, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'
import SplitButton from '../SplitButton/SplitButton'
import DataGrid from './DataGrid'

const TEST_DATA = [
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

const BoolComponent = ({ value }: { value: boolean }): React.ReactElement => {
  return <div>{value ? 'YES' : 'NO'}</div>
}

interface Datum {
  name: string
  created: string
  active: boolean
}

interface ContainerProps extends MarginProps {
  providePageSizeOptions?: boolean
  providePageCount?: boolean
  showResultsCount?: boolean
  fullWidth?: boolean
}

const DataGridContainer = (props: ContainerProps): React.ReactElement => {
  const {
    providePageSizeOptions = true,
    providePageCount = true,
    showResultsCount = true,
    fullWidth,
    ...rest
  } = props
  const size = useContext(ScreenSizeContext)
  const isCardView = size <= SIZES['tiny']
  const [data, setData] = useState<{ [key: string]: any }[]>(TEST_DATA)
  const [sortOptions, setSortOptions] = useState<{ id: string; sortAscending: boolean }[]>([
    { id: 'created', sortAscending: false },
  ])
  const [paginationOptions, setPaginationOptions] = useState<{
    currentPage: number
    pageSize: number
    pageCount?: number
    pageSizeOptions?: number[]
  }>({ currentPage: 1, pageCount: 3, pageSize: 4, pageSizeOptions: [4, 6, 12] })

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
    pageSizeOptions?: number[]
  } => {
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
    <DataGrid
      sortOptions={sortOptions}
      onSort={onSort}
      paginationOptions={getPaginationOptions()}
      onPageChange={onPageChange}
      fullWidth={fullWidth}
      {...rest}
    >
      <DataGrid.TopSection>
        {showResultsCount && !isCardView && <span>{getResultsCountText()}</span>}
        {providePageSizeOptions && <DataGrid.PageSizeSelect pageSizeOptions={[4, 6, 12]} />}
      </DataGrid.TopSection>
      <DataGrid.Table data={paginateData()}>
        <DataGrid.DataColumn id="name" title="Name" />
        <DataGrid.DataColumn id="created" title="Created" sortable={true} />
        <DataGrid.DataColumn id="active" title="Active" as={BoolComponent} sortable={true} />
        <DataGrid.Column>
          {(rowData): React.ReactElement => (
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
      <DataGrid.BottomSection justifyContent="flex-end">
        {isCardView && showResultsCount && size.toString() !== 'tiny' ? (
          <span>{getResultsCountText()}</span>
        ) : null}
        {providePageCount ? (
          <DataGrid.Pagination />
        ) : (
          <DataGrid.PrevNext
            disableNext={paginateData().length < getPaginationOptions().pageSize}
          />
        )}
        {isCardView && showResultsCount && size.toString() === 'tiny' ? (
          <span>{getResultsCountText()}</span>
        ) : null}
      </DataGrid.BottomSection>
    </DataGrid>
  )
}

describe('component: DataGrid', () => {
  test('should be able to change page size', () => {
    const { getByLabelText, getByText } = renderWithTheme(<DataGridContainer />)

    const sixItemsButton = getByLabelText('View 6 rows per page')
    fireEvent.click(sixItemsButton)
    expect(getByText('Showing 1 to 6 of 11')).toBeInTheDocument()
  })

  test('should be able to change sort direction', () => {
    const { getByText } = renderWithTheme(<DataGridContainer />)

    const createdHeader = getByText('Created').parentElement as HTMLElement
    fireEvent.click(createdHeader)
    expect(createdHeader.parentElement).toHaveAttribute('aria-sort', 'ascending')
  })

  test('should render using as prop', () => {
    const { getAllByText } = renderWithTheme(<DataGridContainer />)

    expect(getAllByText('YES')[0]).toBeInTheDocument()
    expect(getAllByText('NO')[0]).toBeInTheDocument()
  })

  test('should be able to change the page using Pagination', () => {
    const { getByText, getByLabelText } = renderWithTheme(<DataGridContainer />)

    const page2Button = getByLabelText('Go to next page, 2')
    fireEvent.click(page2Button)
    // First result on page 2
    expect(getByText('Config 5')).toBeInTheDocument()
    // Last result on page 2
    expect(getByText('Config 8')).toBeInTheDocument()
  })

  test('should be able to change the page using PrevNext', () => {
    const { getByText } = renderWithTheme(<DataGridContainer providePageCount={false} />)

    const nextPageButton = getByText('Next')
    fireEvent.click(nextPageButton)
    // First result on page 2
    expect(getByText('Config 5')).toBeInTheDocument()
    // Last result on page 2
    expect(getByText('Config 8')).toBeInTheDocument()
  })

  test('should render content from Column component', () => {
    const { getAllByText } = renderWithTheme(<DataGridContainer providePageCount={false} />)

    expect(getAllByText('Edit')[0]).toBeInTheDocument()
  })

  test('Should support margin props', () => {
    const { getByTestId } = renderWithTheme(
      <DataGridContainer data-testid="data-grid" marginTop={2} mb="100px" mx={7} />
    )

    const dataGrid = getByTestId('data-grid')
    expect(dataGrid).toHaveStyle('margin-top: 4px')
    expect(dataGrid).toHaveStyle('margin-bottom: 100px')
    expect(dataGrid).toHaveStyle('margin-left: 40px')
    expect(dataGrid).toHaveStyle('margin-right: 40px')
  })
})
