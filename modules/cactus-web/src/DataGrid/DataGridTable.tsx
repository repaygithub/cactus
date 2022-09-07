import { IconProps, NavigationChevronDown, NavigationChevronUp } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React, { useContext } from 'react'
import styled from 'styled-components'

import { border, radius } from '../helpers/theme'
import Table, { StickyColAlignment } from '../Table/Table'
import { DataGridContext } from './helpers'
import { CellInfo, Column, DataGridContextType, Datum } from './types'

export interface DataGridTableProps {
  children: React.ReactNode
  data: Datum[]
  dividers?: boolean
  sticky?: StickyColAlignment
}

const renderHeader = ({ columns, sortOptions, onSort, isCardView }: DataGridContextType) => (
  <Table.Header>
    {columns.map((column) => {
      const { key, id, title = '' } = column
      const props = { ...column.cellProps, ...column.headerProps, key, children: title }
      if (column.sortable && id) {
        const sortOpt = sortOptions.find((opt) => opt.id === id)
        let sortDesc = false
        let Icon: React.ComponentType<IconProps> | undefined = undefined
        if (sortOpt) {
          sortDesc = !sortOpt.sortAscending
          Icon = sortDesc ? NavigationChevronDown : NavigationChevronUp
          props['aria-sort'] = sortDesc ? 'descending' : 'ascending'
        }
        if (!isCardView) {
          const onSortClick = () => onSort([{ id, sortAscending: sortDesc }])
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

const DataGridTable: React.FC<DataGridTableProps> = (props) => {
  const { children, data, ...rest } = props

  const context = useContext(DataGridContext)
  const { cardBreakpoint, fullWidth, variant } = context

  return (
    <>
      {children}
      <Table
        margin={0}
        fullWidth={fullWidth}
        cardBreakpoint={cardBreakpoint}
        variant={variant}
        {...rest}
      >
        {renderHeader(context)}
        {renderBody(context.columns, data)}
      </Table>
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

    &:after {
      content: '';
      box-sizing: border-box;
      position: absolute;
      height: calc(100% + 8px);
      width: calc(100% + 16px);
      bottom: -4px;
      right: -8px;
      border: ${(p) => border(p.theme, 'lightContrast')};
      border-radius: ${radius(20)};
    }
  }
`

DataGridTable.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  dividers: PropTypes.bool,
}

DataGridTable.displayName = 'Table'

export default DataGridTable
