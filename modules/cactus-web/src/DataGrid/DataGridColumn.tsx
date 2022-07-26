import { isEqual } from 'lodash'
import PropTypes from 'prop-types'
import { useContext, useEffect, useReducer } from 'react'

import useId from '../helpers/useId'
import { DataGridContext } from './helpers'
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

const reduceColumns = (state: ColumnState, action: ColumnAction) => {
  let columns = state.columns
  if (action.type === 'add') {
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

const DataGridColumn = (props: ColumnProps): null => {
  const { columnDispatch } = useContext(DataGridContext)
  const {
    id,
    title,
    order = NaN,
    sortable: sortProp,
    as: component,
    render,
    children,
    headerProps,
    ...cellProps
  } = props
  const sortable = !!(sortProp && id && title)
  const key = useId(id)
  const column: Column = { key, id, sortable, order, title, cellProps, headerProps }
  if (typeof children === 'function') {
    column.render = children
  } else if (component) {
    column.Component = component
  } else if (render) {
    column.render = render
  }

  // Add/update on every render; only remove on unmount.
  useEffect(() => columnDispatch({ type: 'add', column }))
  useEffect(() => () => columnDispatch({ type: 'remove', key }), [key, columnDispatch])
  return null
}
DataGridColumn.displayName = 'DataGrid.Column'

const requiredError = (prop: string, component: string, predicate: string) =>
  new Error(`If ${predicate}, prop \`${prop}\` is required on \`${component}\`.`)

const propTypes: React.WeakValidationMap<ColumnProps> = {
  id: (props, ...args) => {
    if (!props.as && !props.children && !props.render && !props.id) {
      return requiredError('id', args[1], 'no `as` component or render func is given')
    } else if (props.sortable && !props.id) {
      return requiredError('id', args[1], '`sortable=true`')
    }
    return PropTypes.string(props, ...args)
  },
  order: PropTypes.number,
  sortable: PropTypes.bool,
  title: (props, ...args) => {
    if (props.sortable && !props.title) {
      return requiredError('title', args[1], '`sortable=true`')
    }
    return PropTypes.node(props, ...args)
  },
  render: PropTypes.func,
  children: PropTypes.func,
  as: PropTypes.elementType as any,
}

DataGridColumn.propTypes = propTypes
export default DataGridColumn
