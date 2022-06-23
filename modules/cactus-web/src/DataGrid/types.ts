import { Size } from '../ScreenSizeProvider/ScreenSizeProvider'
import { TableCellProps, TableVariant } from '../Table/Table'

export type ColumnFn = (rowData: { [key: string]: any }) => React.ReactNode
export type JustifyContent =
  | 'unset'
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'

export interface TransientProps {
  $isCardView: boolean
  $cardBreakpoint: Size
  $variant?: TableVariant
}

export interface DataColumnObject {
  title: React.ReactChild
  sortable: boolean
  asComponent?: React.ComponentType<any>
  cellProps?: { [K: string]: any }
}

export interface ColumnObject {
  columnFn: ColumnFn
  title?: React.ReactChild
  cellProps?: { [K: string]: any }
}

export interface SortOption {
  id: string
  sortAscending: boolean
}

export interface PaginationOptions {
  currentPage: number
  pageSize: number
  pageCount?: number
}

type BaseColumnProps = Omit<TableCellProps, 'as' | 'children' | 'title'>

export interface DataColumnProps extends BaseColumnProps {
  id: string
  title: React.ReactChild
  sortable?: boolean
  as?: React.ComponentType<any>
}

export interface ColumnProps extends BaseColumnProps {
  children: ColumnFn
  title?: React.ReactChild
}

export interface DataGridContextType {
  addDataColumn: (dataColumn: DataColumnProps) => void
  addColumn: (key: string, column: ColumnProps) => void
  columns: Map<string, DataColumnObject | ColumnObject>
  sortOptions: SortOption[]
  onSort: (newSortOptions: SortOption[]) => void
  paginationOptions: PaginationOptions | undefined
  onPageChange: (newPageOptions: PaginationOptions) => void
  fullWidth: boolean
  cardBreakpoint: Size
  isCardView: boolean
  variant: TableVariant | undefined
}
