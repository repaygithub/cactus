import { NavigationChevronDown } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React, { ReactElement, useContext } from 'react'
import styled from 'styled-components'

import { border } from '../helpers/theme'
import Table from '../Table/Table'
import { DataGridContext } from './helpers'
import { ColumnObject, DataColumnObject, SortOption } from './types'

export interface DataGridTableProps {
  children: React.ReactNode
  data: { [key: string]: any }[]
}

const isDataColumn = (col: any): col is DataColumnObject => {
  return col && col.hasOwnProperty('sortable')
}
const isColumn = (col: any): col is ColumnObject => {
  return col && col.hasOwnProperty('columnFn')
}

const DataGridTable: React.FC<DataGridTableProps> = (props) => {
  const { children, data } = props

  const { columns, isCardView, cardBreakpoint, fullWidth, sortOptions, onSort } = useContext(
    DataGridContext
  )

  const handleSort = (id: string, exists: boolean) => {
    if (sortOptions) {
      const { sortAscending: currentSortAscending } = sortOptions[0] || {}
      const newOptions = [{ id, sortAscending: exists ? !currentSortAscending : false }]
      onSort(newOptions)
    }
  }

  return (
    <>
      {children}
      <Table fullWidth={fullWidth} cardBreakpoint={cardBreakpoint}>
        <Table.Header>
          {[...columns.keys()].map((key) => {
            const column = columns.get(key)
            if (isDataColumn(column)) {
              let sortOpt: SortOption | undefined = undefined
              if (column.sortable && sortOptions !== undefined) {
                sortOpt = sortOptions.find((opt: SortOption): boolean => opt.id === key)
              }
              const flipChevron = sortOpt !== undefined && sortOpt.sortAscending === true
              return (
                <Table.Cell
                  className={`table-cell ${flipChevron ? 'flip-chevron' : ''}`}
                  key={key}
                  aria-sort={
                    column.sortable
                      ? sortOpt
                        ? sortOpt.sortAscending
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                      : undefined
                  }
                  {...column.cellProps}
                >
                  {column.sortable && sortOptions !== undefined && !isCardView ? (
                    <HeaderButton onClick={(): void => handleSort(key, sortOpt !== undefined)}>
                      <TextWrapper>{column.title}</TextWrapper>
                      <IconWrapper aria-hidden>
                        {sortOpt !== undefined && <NavigationChevronDown />}
                      </IconWrapper>
                    </HeaderButton>
                  ) : (
                    column.title
                  )}
                </Table.Cell>
              )
            } else if (isColumn(column)) {
              return (
                <Table.Cell key={`col-${key}`} {...column.cellProps}>
                  {column.title || ''}
                </Table.Cell>
              )
            }
          })}
        </Table.Header>
        <Table.Body>
          {data.map(
            (datum, datumIndex): ReactElement => (
              <Table.Row key={`row-${datumIndex}`}>
                {[...columns.keys()].map((key, keyIndex) => {
                  const column = columns.get(key)
                  if (isDataColumn(column)) {
                    const AsComponent = column.asComponent
                    return (
                      <Table.Cell key={`cell-${datumIndex}-${keyIndex}`} {...column.cellProps}>
                        {AsComponent ? <AsComponent value={datum[key]} /> : datum[key]}
                      </Table.Cell>
                    )
                  } else if (isColumn(column)) {
                    return (
                      <Table.Cell key={`cell-${datumIndex}-${keyIndex}`} {...column.cellProps}>
                        {column && column.columnFn(datum)}
                      </Table.Cell>
                    )
                  }
                })}
              </Table.Row>
            )
          )}
        </Table.Body>
      </Table>
    </>
  )
}

const IconWrapper = styled.div`
  flex-shrink: 1;
`

const TextWrapper = styled.div`
  flex-grow: 1;
`

const shapeMap = {
  square: 'border-radius: 1px;',
  intermediate: 'border-radius: 8px;',
  round: 'border-radius: 20px;',
}

const HeaderButton = styled.button`
  display: flex;
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
      ${(p) => shapeMap[p.theme.shape]}
    }
  }
`

DataGridTable.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
}

DataGridTable.displayName = 'Table'

export default DataGridTable
