import userEvent from '@testing-library/user-event'
import React, { useContext, useState } from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import { ScreenSizeContext, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'
import SplitButton from '../SplitButton/SplitButton'
import DataGrid from './DataGrid'
import { Datum, Pagisort, SortInfo } from './types'

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

interface ContainerProps extends Partial<React.ComponentProps<typeof DataGrid>> {
  providePageSizeOptions?: boolean
  providePageCount?: boolean
  showResultsCount?: boolean
  sticky?: 'none' | 'right'
}

const initialSort = { id: 'created', sortAscending: false }

const DataGridContainer = (props: ContainerProps): React.ReactElement => {
  const {
    providePageSizeOptions = true,
    providePageCount = true,
    showResultsCount = true,
    sticky,
    ...rest
  } = props
  const size = useContext(ScreenSizeContext)
  const isCardView = size <= SIZES['tiny']
  const [data, setData] = useState<Datum[]>(TEST_DATA)
  const [itemOffset, setOffset] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(4)

  const onPagisort = (options: Pagisort) => {
    setOffset(options.itemOffset || 0)
    if (options.pageSize) setPageSize(options.pageSize)
  }

  const clone = (rowData: Datum): void => {
    setData((currentData) => [...currentData, { ...rowData, name: `${rowData.name} Copy` }])
  }

  const deleteRow = (rowIndex: number): void => {
    setData((currentData) => {
      const newData = [...currentData]
      newData.splice(rowIndex, 1)
      return newData
    })
  }

  const onSort = (sort: SortInfo): void => {
    const dataCopy = [...data]
    if (sort.id === 'created') {
      dataCopy.sort((a: Datum, b: Datum): number => {
        return Date.parse(a.created) - Date.parse(b.created)
      })
    } else if (sort.id === 'active') {
      dataCopy.sort((a: Datum, b: Datum): number => {
        return a.active === b.active ? 0 : a.active ? 1 : -1
      })
    }
    if (!sort.sortAscending) {
      dataCopy.reverse()
    }
    setData(dataCopy)
  }

  const paginatedData = data.slice(itemOffset, itemOffset + pageSize)

  const getResultsCountText = (): string => {
    if (providePageCount) {
      return `Showing ${itemOffset + 1} to ${itemOffset + pageSize} of ${data.length}`
    } else {
      return `Showing ${itemOffset + 1} to ${itemOffset + pageSize}`
    }
  }

  return (
    <DataGrid onPagisort={onPagisort} data={paginatedData} {...rest}>
      {showResultsCount && !isCardView && <span>{getResultsCountText()}</span>}
      <DataGrid.Sort onSort={onSort} initialSort={initialSort} />
      {providePageSizeOptions && (
        <DataGrid.PageSizeSelect pageSize={pageSize} pageSizeOptions={[4, 6, 12]} />
      )}
      <DataGrid.Table sticky={sticky}>
        <DataGrid.DataColumn id="name" title="Name" />
        <DataGrid.DataColumn id="created" title="Created" sortable={true} />
        <DataGrid.DataColumn id="active" title="Active" as={BoolComponent} sortable={true} />
        <DataGrid.Column data-testid="last-col">
          {(rowData, { rowIndex }): React.ReactElement => (
            <SplitButton>
              <SplitButton.Action main>Edit</SplitButton.Action>
              <SplitButton.Action onClick={() => clone(rowData)}>Clone</SplitButton.Action>
              <SplitButton.Action onClick={() => deleteRow(rowIndex)}>Delete</SplitButton.Action>
            </SplitButton>
          )}
        </DataGrid.Column>
      </DataGrid.Table>
      {isCardView && showResultsCount && size.toString() !== 'tiny' ? (
        <span>{getResultsCountText()}</span>
      ) : null}
      {providePageCount ? (
        <DataGrid.Pagination itemOffset={itemOffset} itemCount={data.length} pageSize={pageSize} />
      ) : (
        <DataGrid.PrevNext
          itemOffset={itemOffset}
          pageSize={pageSize}
          disableNext={paginatedData.length < pageSize}
        />
      )}
      {isCardView && showResultsCount && size.toString() === 'tiny' ? (
        <span>{getResultsCountText()}</span>
      ) : null}
    </DataGrid>
  )
}

describe('component: DataGrid', () => {
  test('should be able to change page size', () => {
    const { getByLabelText, getByText } = renderWithTheme(<DataGridContainer />)

    const sixItemsButton = getByLabelText('View 6 rows per page')
    userEvent.click(sixItemsButton)
    expect(getByText('Showing 1 to 6 of 11')).toBeInTheDocument()
  })

  test('should be able to change sort direction', () => {
    const { getByText } = renderWithTheme(<DataGridContainer />)

    const createdHeader = getByText('Created').parentElement as HTMLElement
    userEvent.click(createdHeader)
    expect(createdHeader.parentElement).toHaveAttribute('aria-sort', 'ascending')
  })

  test('should render using as prop', () => {
    const { getAllByText } = renderWithTheme(<DataGridContainer />)

    expect(getAllByText('YES')[0]).toBeInTheDocument()
    expect(getAllByText('NO')[0]).toBeInTheDocument()
  })

  test('should be able to change the page using Pagination', () => {
    const { getByText, getByLabelText } = renderWithTheme(<DataGridContainer />)

    const page2Button = getByLabelText('Go to page 2')
    userEvent.click(page2Button)
    // First result on page 2
    expect(getByText('Config 5')).toBeInTheDocument()
    // Last result on page 2
    expect(getByText('Config 8')).toBeInTheDocument()
  })

  test('should be able to change the page using PrevNext', () => {
    const { getByText } = renderWithTheme(<DataGridContainer providePageCount={false} />)

    const nextPageButton = getByText('Next')
    userEvent.click(nextPageButton)
    // First result on page 2
    expect(getByText('Config 5')).toBeInTheDocument()
    // Last result on page 2
    expect(getByText('Config 8')).toBeInTheDocument()
  })

  test('should render content from Column component', () => {
    const { getAllByText } = renderWithTheme(<DataGridContainer providePageCount={false} />)

    expect(getAllByText('Edit')[0]).toBeInTheDocument()
  })

  test('Should support style props', () => {
    const { getByTestId } = renderWithTheme(
      <DataGridContainer
        data-testid="data-grid"
        marginTop={2}
        mb="100px"
        mx={7}
        width="500px"
        justifyContent="space-between"
      />
    )

    const dataGrid = getByTestId('data-grid')
    expect(dataGrid).toHaveStyle({
      marginTop: '4px',
      marginBottom: '100px',
      marginLeft: '40px',
      marginRight: '40px',
      width: '500px',
      justifyContent: 'space-between',
    })
    expect(dataGrid).toHaveStyle('margin-bottom: 100px')
    expect(dataGrid).toHaveStyle('margin-left: 40px')
    expect(dataGrid).toHaveStyle('margin-right: 40px')
  })

  test('Should support setting position of right column as sticky', () => {
    const { getAllByTestId, rerender } = renderWithTheme(<DataGridContainer sticky="right" />)
    getAllByTestId('last-col').forEach((element) => {
      expect(element).toHaveStyle('position: sticky')
    })
    rerender(<DataGridContainer />)
    getAllByTestId('last-col').forEach((element) => {
      expect(element).not.toHaveStyle('position: sticky')
    })
  })

  test('should allow uncontrolled pagisort', () => {
    const onSort = jest.fn()
    const onPageChange = jest.fn()
    const onPagisort = jest.fn()
    const data: Datum[] = Array(2).fill({ hi: 'there', hello: '!' })
    const { getByLabelText, getByRole } = renderWithTheme(
      <DataGrid data={data} onPagisort={onPagisort}>
        <DataGrid.Sort onSort={onSort} />
        <DataGrid.PageSizeSelect initialPageSize={2} pageSizeOptions={[2, 5]} />
        <DataGrid.Table>
          <DataGrid.Column id="hi" title="Hi" defaultSort="asc" />
          <DataGrid.Column id="hello" title="Hello" />
        </DataGrid.Table>
        <DataGrid.Pagination itemCount={3} onPageChange={onPageChange} />
      </DataGrid>
    )
    // Sort ascending
    userEvent.click(getByRole('button', { name: 'Hi' }))
    expect(onSort).toHaveBeenCalledTimes(1)
    expect(onSort).toHaveBeenLastCalledWith({ id: 'hi', sortAscending: true })
    expect(onPageChange).toHaveBeenCalledTimes(0)
    expect(onPagisort).toHaveBeenCalledTimes(1)
    expect(onPagisort).toHaveBeenLastCalledWith({
      currentPage: 1,
      pageSize: 2,
      itemCount: 3,
      itemOffset: 0,
      pageCount: 2,
      sort: { id: 'hi', sortAscending: true },
    })
    // Page change
    userEvent.click(getByLabelText('Go to page 2'))
    expect(onSort).toHaveBeenCalledTimes(1)
    expect(onPageChange).toHaveBeenCalledTimes(1)
    expect(onPageChange).toHaveBeenLastCalledWith(2)
    expect(onPagisort).toHaveBeenCalledTimes(2)
    expect(onPagisort).toHaveBeenLastCalledWith({
      currentPage: 2,
      pageSize: 2,
      itemCount: 3,
      itemOffset: 2,
      pageCount: 2,
      sort: { id: 'hi', sortAscending: true },
    })
    // Sort descending
    userEvent.click(getByRole('button', { name: 'Hi' }))
    expect(onSort).toHaveBeenCalledTimes(2)
    expect(onSort).toHaveBeenLastCalledWith({ id: 'hi', sortAscending: false })
    expect(onPageChange).toHaveBeenCalledTimes(1)
    expect(onPagisort).toHaveBeenCalledTimes(3)
    expect(onPagisort).toHaveBeenLastCalledWith({
      currentPage: 2,
      pageSize: 2,
      itemCount: 3,
      itemOffset: 2,
      pageCount: 2,
      sort: { id: 'hi', sortAscending: false },
    })
    // Page size change
    userEvent.click(getByLabelText('View 5 rows per page'))
    expect(onSort).toHaveBeenCalledTimes(2)
    expect(onPageChange).toHaveBeenCalledTimes(1)
    expect(onPagisort).toHaveBeenCalledTimes(4)
    // Note that itemOffset & currentPage changed, as they were no longer valid.
    expect(onPagisort).toHaveBeenLastCalledWith({
      currentPage: 1,
      pageSize: 5,
      itemCount: 3,
      itemOffset: 0,
      pageCount: 1,
      sort: { id: 'hi', sortAscending: false },
    })
  })

  test('should allow controlled pagisort at root', () => {
    const data: Datum[] = Array(2).fill({ hi: 'there', hello: '!' })
    const { container, getByLabelText, rerender } = renderWithTheme(
      <DataGrid
        data={data}
        pagisort={{
          currentPage: 2,
          pageCount: 3,
          pageSize: 2,
          sort: { id: 'hi', sortAscending: true },
        }}
      >
        <DataGrid.Sort />
        <DataGrid.PageSizeSelect pageSizeOptions={[2, 5]} />
        <DataGrid.Table>
          <DataGrid.Column id="hi" title="Hi" sortable />
          <DataGrid.Column id="hello" title="Hello" />
        </DataGrid.Table>
        <DataGrid.Pagination />
      </DataGrid>
    )
    const sortHeader = container.querySelector('[aria-sort]')
    expect(sortHeader).toHaveTextContent('Hi')
    expect(sortHeader).toHaveAttribute('aria-sort', 'ascending')
    expect(getByLabelText('View 2 rows per page')).toHaveAttribute('aria-selected', 'true')
    expect(getByLabelText('Current page, 2')).toHaveAttribute('aria-current', 'page')

    rerender(
      <DataGrid
        data={data}
        pagisort={{
          itemCount: 12,
          itemOffset: 10,
          pageSize: 5,
          sort: { id: 'hi', sortAscending: false },
        }}
      >
        <DataGrid.Sort />
        <DataGrid.PageSizeSelect pageSizeOptions={[2, 5]} />
        <DataGrid.Table>
          <DataGrid.Column id="hi" title="Hi" sortable />
          <DataGrid.Column id="hello" title="Hello" />
        </DataGrid.Table>
        <DataGrid.Pagination />
      </DataGrid>
    )
    expect(sortHeader).toHaveAttribute('aria-sort', 'descending')
    expect(getByLabelText('View 5 rows per page')).toHaveAttribute('aria-selected', 'true')
    expect(getByLabelText('Current page, 3')).toHaveAttribute('aria-current', 'page')
  })

  test('should allow controlled pagisort at leaf', () => {
    const data: Datum[] = Array(2).fill({ hi: 'there', hello: '!' })
    const { container, getByLabelText, rerender } = renderWithTheme(
      <DataGrid data={data}>
        <DataGrid.Sort sort={{ id: 'hi', sortAscending: true }} />
        <DataGrid.PageSizeSelect pageSize={2} pageSizeOptions={[2, 5]} />
        <DataGrid.Table>
          <DataGrid.Column id="hi" title="Hi" sortable />
          <DataGrid.Column id="hello" title="Hello" />
        </DataGrid.Table>
        <DataGrid.Pagination currentPage={2} pageCount={3} />
      </DataGrid>
    )
    const sortHeader = container.querySelector('[aria-sort]')
    expect(sortHeader).toHaveTextContent('Hi')
    expect(sortHeader).toHaveAttribute('aria-sort', 'ascending')
    expect(getByLabelText('View 2 rows per page')).toHaveAttribute('aria-selected', 'true')
    expect(getByLabelText('Current page, 2')).toHaveAttribute('aria-current', 'page')

    rerender(
      <DataGrid data={data}>
        <DataGrid.Sort sort={{ id: 'hi', sortAscending: false }} />
        <DataGrid.PageSizeSelect pageSize={5} pageSizeOptions={[2, 5]} />
        <DataGrid.Table>
          <DataGrid.Column id="hi" title="Hi" sortable />
          <DataGrid.Column id="hello" title="Hello" />
        </DataGrid.Table>
        <DataGrid.Pagination itemCount={12} itemOffset={10} />
      </DataGrid>
    )
    expect(sortHeader).toHaveAttribute('aria-sort', 'descending')
    expect(getByLabelText('View 5 rows per page')).toHaveAttribute('aria-selected', 'true')
    expect(getByLabelText('Current page, 3')).toHaveAttribute('aria-current', 'page')
  })

  // Common functionality tested above, these are tests that ONLY apply to this component.
  describe('component: DataGrid.Sort', () => {
    const columns = [{ id: 'col', title: 'Col', defaultSort: 'desc' as const }]

    test('should support style props', () => {
      const { getByTestId } = renderWithTheme(
        <DataGrid data={TEST_DATA}>
          <DataGrid.Sort
            data-testid="sort"
            showSortMenu
            margin={3}
            alignItems="flex-start"
            alignSelf="flex-end"
          />
          <DataGrid.Table columns={columns} />
        </DataGrid>
      )
      expect(getByTestId('sort')).toHaveStyle({
        margin: '8px',
        alignItems: 'flex-start',
        alignSelf: 'flex-end',
      })
    })

    test('should display menu only on card variant', () => {
      const { getByRole, rerender } = renderWithTheme(
        <DataGrid data={TEST_DATA}>
          <DataGrid.Sort />
          <DataGrid.Table variant="card" columns={columns} />
        </DataGrid>
      )
      const sortColumn = getByRole('button', { name: 'Sort by' })
      const sortDirection = getByRole('button', { name: 'Order' })
      expect(sortColumn).toBeInTheDocument()
      expect(sortDirection).toBeInTheDocument()

      rerender(
        <DataGrid data={TEST_DATA}>
          <DataGrid.Sort />
          <DataGrid.Table variant="table" columns={columns} />
        </DataGrid>
      )
      expect(sortColumn).not.toBeInTheDocument()
      expect(sortDirection).not.toBeInTheDocument()
    })
  })
})
