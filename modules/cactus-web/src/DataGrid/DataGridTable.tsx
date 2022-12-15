import { IconProps, NavigationChevronDown, NavigationChevronUp } from '@repay/cactus-icons'
import { border, radius } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import Box from '../Box/Box'
import Table, { BaseTableProps, useTableVariant } from '../Table/Table'
import { columnPropTypes } from './DataGridColumn'
import { useDataGridContext } from './DataGridContext'
import { CellInfo, Column, ColumnProps, DataGridContext, Datum } from './types'

export interface DataGridTableProps extends BaseTableProps {
  columns?: Omit<ColumnProps, 'children'>[]
}

const renderHeader = (
  columns: Column[],
  { sortInfo, updateSortInfo, tableVariant }: DataGridContext
) => (
  <Table.Header>
    {columns.map((column) => {
      const { key, id, title = '' } = column
      const props = { ...column.cellProps, ...column.headerProps, key, children: title }
      if (column.sortable && id) {
        // Invert the initial sort to simplify the onClick logic.
        let sortDesc = column.defaultSort !== 'desc'
        let Icon: React.ComponentType<IconProps> | undefined = undefined
        if (sortInfo?.id === id) {
          sortDesc = !sortInfo.sortAscending
          Icon = sortDesc ? NavigationChevronDown : NavigationChevronUp
          props['aria-sort'] = sortDesc ? 'descending' : 'ascending'
        }
        if (tableVariant !== 'card') {
          const onSortClick = () => updateSortInfo({ id, sortAscending: sortDesc }, true)
          props.children = (
            <HeaderButton type="button" onClick={onSortClick}>
              <div>{title}</div>
              {Icon && <Icon aria-hidden marginLeft={3} />}
            </HeaderButton>
          )
        }
      }
      return <Table.Cell {...props} />
    })}
  </Table.Header>
)

const renderBody = (columns: Column[], data: Datum[]) => (
  <Table.Body>
    {data.map((row, rowIndex) => (
      <Table.Row key={rowIndex}>
        {columns.map((column, colIndex) => {
          const { Component, render, key, id } = column
          const value = id === undefined ? undefined : row[id]
          const cellProps = { ...column.cellProps, key, children: value }
          const cellInfo: CellInfo = { value, id, rowIndex, colIndex }
          if (render) {
            cellProps.children = render(row, cellInfo)
          } else if (Component) {
            cellProps.children = <Component {...cellInfo} row={row} />
          }
          return <Table.Cell {...cellProps} />
        })}
      </Table.Row>
    ))}
  </Table.Body>
)

const useColumnState = (context: DataGridContext, columnProp?: ColumnProps[]) => {
  const { updateColumns, columns } = context
  React.useEffect(() => {
    if (columnProp) {
      updateColumns(columnProp)
    }
  }, [columnProp, updateColumns])
  return columns
}

const useVariantState = (context: DataGridContext, props: DataGridTableProps) => {
  const { updateTableVariant } = context
  const variant = useTableVariant(props)
  React.useEffect(() => updateTableVariant(variant), [variant, updateTableVariant])
  return variant
}

const DataGridTable: React.FC<DataGridTableProps> = (props) => {
  const context = useDataGridContext('DataGrid.Table')
  const { children, columns: columnProp, ...rest } = props
  const columns = useColumnState(context, columnProp)
  // Replace the (possibly) responsive prop with the singular value.
  rest.variant = context.tableVariant = useVariantState(context, rest)

  return (
    <>
      {children}
      <Box overflowX="auto" width="100%" flexShrink="0">
        <Table {...rest} width="100%" noScrollWrapper>
          {renderHeader(columns, context)}
          {renderBody(columns, context.data)}
        </Table>
      </Box>
    </>
  )
}

const HeaderButton = styled.button`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  color: inherit;
  font-size: inherit;
  text-transform: inherit;
  font-weight: inherit;
  padding: 0;
  cursor: pointer;
  position: relative;
  overflow: visible;

  &:focus {
    outline: none;

    &::after {
      content: '';
      box-sizing: border-box;
      position: absolute;
      height: calc(100% + 8px);
      width: calc(100% + 16px);
      bottom: -4px;
      right: -8px;
      border: ${border('lightContrast')};
      border-radius: ${radius(20)};
    }
  }
`

DataGridTable.defaultProps = { ...Table.defaultProps }

DataGridTable.propTypes = {
  ...Table.propTypes,
  columns: PropTypes.arrayOf(PropTypes.shape(columnPropTypes).isRequired),
}

DataGridTable.displayName = 'Table'

export default DataGridTable
