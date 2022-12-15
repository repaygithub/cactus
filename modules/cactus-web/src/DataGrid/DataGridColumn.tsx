import { isEqual } from 'lodash'
import PropTypes from 'prop-types'
import { useEffect, useReducer } from 'react'

import useId from '../helpers/useId'
import { useDataGridContext } from './DataGridContext'
import { Column, ColumnAction, ColumnDispatch, ColumnProps, ColumnState } from './types'

const addColumn = (columns: Column[], column: Column) => {
  let index = columns.findIndex((c) => c.key === column.key)
  const oldColumn = columns[index]
  if (isNaN(column.order)) {
    column.order = oldColumn ? oldColumn.order : columns.length
  }
  // Depending on JS version, sort isn't guaranteed stable so use this instead.
  if (!isEqual(oldColumn, column)) {
    const newColumns = [...columns]
    if (column.order === oldColumn?.order) {
      newColumns[index] = column
    } else {
      if (oldColumn) newColumns.splice(index, 1)
      for (index = 0; index < newColumns.length; index++) {
        if (newColumns[index].order > column.order) break
      }
      newColumns.splice(index, 0, column)
    }
    return newColumns
  }
  return columns
}

const removeColumn = (columns: Column[], key: string) => {
  const index = columns.findIndex((c) => c.key === key)
  if (index >= 0) {
    columns = [...columns]
    columns.splice(index, 1)
  }
  return columns
}

const reduceColumns = (state: ColumnState, action: ColumnAction | Column[]) => {
  let columns = state.columns
  if (Array.isArray(action)) {
    columns = action.map(normalizeColumn)
  } else if (action.type === 'add') {
    columns = addColumn(columns, action.column)
  } else if (action.type === 'remove') {
    columns = removeColumn(columns, action.key)
  }
  if (columns !== state.columns) {
    const sortableColumns = columns.filter((c) => c.sortable)
    return { columns, sortableColumns }
  }
  return state
}

const DEFAULT = { columns: [], sortableColumns: [] }

export const useColumns = (): [ColumnState, ColumnDispatch] => useReducer(reduceColumns, DEFAULT)

const normalizeColumn = (props: ColumnProps, altKey: React.Key): Column => {
  const {
    id,
    key = id || altKey,
    title,
    order = NaN,
    sortable: sortProp,
    defaultSort,
    as: component,
    render,
    children,
    headerProps,
    ...cellProps
  } = props
  const sortable = !!((sortProp || defaultSort) && id && title)
  const column: Column = {
    key,
    id,
    sortable,
    defaultSort: defaultSort || 'asc',
    order: isNaN(order) && typeof altKey === 'number' ? altKey : order,
    title,
    cellProps,
    headerProps,
  }
  if (typeof children === 'function') {
    column.render = children
  } else if (component) {
    column.Component = component
  } else if (render) {
    column.render = render
  }
  return column
}

const DataGridColumn = (props: ColumnProps): null => {
  const { updateColumns } = useDataGridContext('DataGrid.Column')
  const key = useId(props.id)
  const column = normalizeColumn(props, key)

  // Add/update on every render; only remove on unmount.
  useEffect(() => updateColumns({ type: 'add', column }))
  useEffect(() => () => updateColumns({ type: 'remove', key }), [key, updateColumns])
  return null
}
DataGridColumn.displayName = 'DataGrid.Column'

const requiredError = (prop: string, component: string, predicate: string) =>
  new Error(`If ${predicate}, prop \`${prop}\` is required on \`${component}\`.`)

export const columnPropTypes: React.WeakValidationMap<ColumnProps> = {
  id: (props, ...args) => {
    if (!props.as && !props.children && !props.render && !props.id) {
      return requiredError('id', args[1], 'no `as` component or render func is given')
    } else if ((props.sortable || props.defaultSort) && !props.id) {
      return requiredError('id', args[1], 'the column is sortable')
    }
    return PropTypes.string(props, ...args)
  },
  order: PropTypes.number,
  sortable: PropTypes.bool,
  defaultSort: PropTypes.oneOf(['asc', 'desc'] as const),
  title: (props, ...args) => {
    if ((props.sortable || props.defaultSort) && !props.title) {
      return requiredError('title', args[1], 'the column is sortable')
    }
    return PropTypes.node(props, ...args)
  },
  render: PropTypes.func,
  children: PropTypes.func,
  as: PropTypes.elementType as any,
}

DataGridColumn.propTypes = columnPropTypes
export default DataGridColumn
