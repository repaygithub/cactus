import { Size } from '../ScreenSizeProvider/ScreenSizeProvider'
import { TableCellProps, TableVariant } from '../Table/Table'

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

export interface TableProps {
  fullWidth: boolean
  cardBreakpoint: Size
  variant: TableVariant | undefined
}

export interface CellInfo {
  id?: string
  value?: any
  colIndex: number
  rowIndex: number
}

export type Datum = Record<string, any>
type RenderFunc = (row: Datum, cellInfo: CellInfo) => React.ReactElement | null

export interface Column {
  key: string
  order: number
  sortable: boolean
  id: string | undefined
  title: React.ReactChild | undefined
  headerProps: TableCellProps | undefined
  cellProps: TableCellProps
  Component?: React.ComponentType<CellInfo & { row: Datum }>
  render?: RenderFunc
}

interface AddAction {
  type: 'add'
  column: Column
}

interface RemoveAction {
  type: 'remove'
  key: string
}

export type ColumnAction = AddAction | RemoveAction
export type ColumnDispatch = React.Dispatch<ColumnAction>

export interface ColumnState {
  columns: Column[]
  sortableColumns: Column[]
}

export interface SortOption {
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

// Backwards compat; if we ever make a breaking change, use `PageState` everywhere.
export interface PaginationOptions extends PageState {
  currentPage: number
  pageSize: number
}
export type PageStateAction = React.SetStateAction<PageState>

export interface Pagisort extends PaginationOptions {
  sort?: SortOption[]
}

export interface ColumnProps extends Omit<TableCellProps, 'as' | 'children' | 'title'> {
  id?: string
  order?: number
  sortable?: boolean
  title?: React.ReactChild
  headerProps?: TableCellProps
  render?: RenderFunc
  children?: RenderFunc
  as?: React.ComponentType<any>
}

export interface DataGridContextType extends ColumnState, TableProps {
  columnDispatch: ColumnDispatch
  sortOptions: SortOption[]
  onSort: (newSortOptions: SortOption[]) => void
  pageState: PaginationOptions
  updatePageState: (action: PageStateAction, raiseEvent?: boolean) => void
  isCardView: boolean
}
