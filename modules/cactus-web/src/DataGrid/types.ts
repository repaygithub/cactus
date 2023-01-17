import { Key } from 'react'

import { TableCellProps, TableVariant } from '../Table/Table'

export interface CellInfo {
  id?: string
  value?: any
  colIndex: number
  rowIndex: number
}

export type Datum = Record<string, any>

type SortDirection = 'asc' | 'desc'

type RenderFunc = (row: Datum, cellInfo: CellInfo) => React.ReactElement | null

interface BaseColumn {
  order: number
  sortable: boolean
  defaultSort: SortDirection
  id: string | undefined
  title: React.ReactChild | undefined
  headerProps: TableCellProps | undefined
  render?: RenderFunc
}

export interface Column extends BaseColumn {
  key: Key
  cellProps: TableCellProps
  Component?: React.ComponentType<CellInfo & { row: Datum }>
}

export interface ColumnProps
  extends Partial<BaseColumn>,
    Omit<TableCellProps, 'as' | 'children' | 'title'> {
  key?: Key
  children?: RenderFunc
  as?: React.ComponentType<any>
}

interface AddAction {
  type: 'add'
  column: Column
}

interface RemoveAction {
  type: 'remove'
  key: string
}

export type ColumnAction = AddAction | RemoveAction | ColumnProps[]
export type ColumnDispatch = React.Dispatch<ColumnAction>

export interface ColumnState {
  columns: Column[]
  sortableColumns: Column[]
}

export interface SortInfo {
  id: string
  sortAscending: boolean
}

export const pageStateKeys = [
  'currentPage',
  'pageCount',
  'pageSize',
  'itemCount',
  'itemOffset',
] as const

export type PageState = { [K in typeof pageStateKeys[number]]?: number }

export type PageStateAction = React.SetStateAction<PageState>

export interface Pagisort extends PageState {
  sort?: SortInfo
}

export type SortEventHandler = (arg: SortInfo) => void

export interface DataGridContext extends ColumnState {
  data: Datum[]
  onSort?: SortEventHandler
  updateColumns: ColumnDispatch
  sortInfo: SortInfo | undefined
  updateSortInfo: (newSort: SortInfo, raiseEvent: boolean) => void
  pageState: PageState
  updatePageState: (action: PageStateAction, raiseEvent: boolean) => void
  tableVariant: TableVariant
  updateTableVariant: (variant: TableVariant) => void
}
