import { mediaGTE } from '@repay/cactus-theme'
import { identity } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { margin, MarginProps } from 'styled-system'

import {
  allWidth,
  AllWidthProps,
  flexContainer,
  FlexProps,
  gapWorkaround,
  withStyles,
} from '../helpers/styled'
import { useControllableValue } from '../hooks'
import { TableVariant } from '../Table/Table'
import DataGridColumn, { useColumns } from './DataGridColumn'
import { DataGridContextProvider } from './DataGridContext'
import DataGridSort from './DataGridSort'
import DataGridTable from './DataGridTable'
import PageSizeSelect from './PageSizeSelect'
import { calcPageState, DataGridPagination, DataGridPrevNext, pageStateReducer } from './Pagination'
import { DataGridContext, Datum, PageState, PageStateAction, Pagisort, SortInfo } from './types'

type DivProps = React.HTMLAttributes<HTMLDivElement>
interface BaseDataGridProps extends DivProps {
  data: Datum[]
  onPagisort?: (newPagisort: Pagisort) => void
  pagisort?: Pagisort
}

interface DataGridProps extends BaseDataGridProps, MarginProps, AllWidthProps, FlexProps {}

const initialPageState: PageState = {}
const getSortInfo = (pagisort: Pagisort | undefined, prevState: SortInfo | undefined) => {
  return pagisort ? pagisort.sort : prevState
}
const getPageState = (pagisort: Pagisort | undefined, prevState: PageState) => {
  if (pagisort) {
    const { sort, ...pageState } = pagisort
    return pageState
  }
  return prevState
}

const BaseDataGrid: React.FC<BaseDataGridProps> = (props) => {
  const { children, onPagisort, pagisort, data, ...rest } = props

  const [columnState, updateColumns] = useColumns()
  // `variant` is basically a Table prop, but it affects some styling and
  // Sort visualization so we need to keep track of it at the root level.
  const [tableVariant, updateTableVariant] = React.useState<TableVariant>('table')

  const [sortInfo, setSortInfo] = useControllableValue(pagisort, getSortInfo, undefined)
  const [pageState, setPageState] = useControllableValue(
    pagisort,
    getPageState,
    pageStateReducer,
    initialPageState
  )

  const context: DataGridContext = {
    ...columnState,
    data,
    updateColumns,
    tableVariant,
    updateTableVariant,
    sortInfo,
    pageState,
    updateSortInfo: (newSortInfo: SortInfo, raiseEvent: boolean) => {
      setSortInfo(newSortInfo)
      if (raiseEvent) {
        // Handler should be attached to the context in DataGrid.Sort.
        context.onSort?.(newSortInfo)
        if (onPagisort) {
          const currentPageState = setPageState(identity)
          const newPagisort = { ...currentPageState, sort: newSortInfo }
          onPagisort(calcPageState(newPagisort))
        }
      }
    },
    updatePageState: (action: PageStateAction, raiseEvent: boolean) => {
      const newPageState = setPageState(action)
      if (raiseEvent && onPagisort && newPageState !== pageState) {
        const currentSortInfo = setSortInfo(identity)
        const newPagisort: Pagisort = { ...newPageState, sort: currentSortInfo }
        onPagisort(newPagisort)
      }
    },
  }
  return (
    <div {...rest}>
      <DataGridContextProvider value={context}>{children}</DataGridContextProvider>
    </div>
  )
}

export const DataGrid: DataGridType = withStyles('div', {
  displayName: 'DataGrid',
  as: BaseDataGrid,
  styles: [margin, allWidth, flexContainer],
})<DataGridProps>`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  ${gapWorkaround}
  ${mediaGTE('small')} {
    flex-flow: row wrap;
    justify-content: flex-end;
  }
` as any

DataGrid.defaultProps = { gap: 4 }

DataGrid.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onPagisort: PropTypes.func,
}

interface DataGridType extends React.FC<DataGridProps> {
  Table: typeof DataGridTable
  DataColumn: typeof DataGridColumn
  Column: typeof DataGridColumn
  PageSizeSelect: typeof PageSizeSelect
  Pagination: typeof DataGridPagination
  PrevNext: typeof DataGridPrevNext
  Sort: typeof DataGridSort
}

DataGrid.Table = DataGridTable
DataGrid.DataColumn = DataGridColumn
DataGrid.Column = DataGridColumn
DataGrid.PageSizeSelect = PageSizeSelect
DataGrid.Pagination = DataGridPagination
DataGrid.PrevNext = DataGridPrevNext
DataGrid.Sort = DataGridSort

export default DataGrid
