import { BorderSize, Shape } from '@repay/cactus-theme'
import React, { createContext, FunctionComponent, useContext } from 'react'
import styled, { css, StyledComponentType } from 'styled-components'
import PropTypes from 'prop-types'

type cellAlignment = 'center' | 'right' | 'left'

type cellType = 'th' | 'td'

interface TableContextProps {
  cellType: cellType
}

interface TableProps
  extends React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement> {
  className?: string
  fullWidth?: boolean
}

interface TableHeaderProps
  extends React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  > {
  className?: string
}
interface TableCellProps
  extends React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableDataCellElement & HTMLTableHeaderCellElement>,
    HTMLTableDataCellElement & HTMLTableHeaderCellElement
  > {
  className?: string
  align?: cellAlignment
}

interface TableRowProps
  extends React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  > {
  className?: string
}
interface TableBodyProps
  extends React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  > {
  className?: string
}

const TableContext = createContext<TableContextProps>({
  cellType: 'td',
})

const shapeMap = {
  square: css`
    border-radius: 1px;
  `,
  intermediate: css`
    border-radius: 4px;
  `,
  round: css`
    border-radius: 8px;
  `,
}

const lastRowShapeMap = {
  square: css`
    border-radius: 0 0 1px 1px;
  `,
  intermediate: css`
    border-radius: 0 0 4px 4px;
  `,
  round: css`
    border-radius: 0 0 8px 8px;
  `,
}

const borderMap = {
  thin: css`
    border: 1px solid;
  `,
  thick: css`
    border: 2px solid;
  `,
}

const getShape = (shape: Shape) => shapeMap[shape]
const getLastRowShape = (shape: Shape) => lastRowShapeMap[shape]
const getBorder = (size: BorderSize) => borderMap[size]
const TableBase: FunctionComponent<TableProps> = props => {
  const { children, className } = props

  return <table className={className}>{children}</table>
}

const TableCellBase: FunctionComponent<TableCellProps> = props => {
  const { children, className, align } = props
  const { cellType: Type } = useContext(TableContext)

  return (
    <Type className={className} align={align || 'left'}>
      {children}
    </Type>
  )
}

const TableHeaderBase: FunctionComponent<TableHeaderProps> = props => {
  const { children, className } = props

  return (
    <TableContext.Provider value={{ cellType: 'th' }}>
      <thead className={className}>
        <Table.Row>{children}</Table.Row>
      </thead>
    </TableContext.Provider>
  )
}

const TableRowBase: FunctionComponent<TableRowProps> = props => {
  const { children, className } = props

  return (
    <tr className={className} tabIndex={0}>
      {children}
    </tr>
  )
}

const TableBodyBase: FunctionComponent<TableBodyProps> = props => {
  const { children, className } = props
  return (
    <TableContext.Provider value={{ cellType: 'td' }}>
      <tbody className={className}>{children}</tbody>
    </TableContext.Provider>
  )
}

export const TableHeader = styled(TableHeaderBase)`
  display: flex;
  flex-direction: column;
  tr {
    display: flex;
    border-color: ${p => p.theme.colors.base};
    background-color: ${p => p.theme.colors.base};
    ${p => getBorder(p.theme.border)};
    text-transform: uppercase;
  }
  tr > th {
    color: white;
    font-weight: bold;
  }
`

export const TableBody = styled(TableBodyBase)`
  display: flex;
  flex-direction: column;
`
export const TableCell = styled(TableCellBase)`
  max-width: 160px;
  align-items: center;
  padding: 16px;
  color: ${p => p.theme.colors.darkestContrast};
  font-size: 15px;
  font-weight: normal;
  > svg {
    vertical-align: text-top;
    margin: 1px 10px;
  }

  ${p => p.theme.mediaQueries && `${p.theme.mediaQueries.medium} {
    width: calc(160px * 0.7125);
  }`}
  ${p => p.theme.mediaQueries && `${p.theme.mediaQueries.large} {
    width: calc(160px * 0.875);
  }`}

  ${p => p.theme.mediaQueries && `${p.theme.mediaQueries.extraLarge} {
    width: 160px;
  }`}

  ${p => !p.theme.mediaQueries && 'width: 160px;'}
`

const TableRow = styled(TableRowBase)`
  position: relative;
  outline: 0;
  display: flex;
  background-color: ${p => p.theme.colors.white};
  ${p => getBorder(p.theme.border)};
  border-color: ${p => p.theme.colors.white};

  & small {
    color: ${p => p.theme.colors.darkestContrast};
  }

  ${TableBody} > &:nth-of-type(even) {
    background-color: ${p => p.theme.colors.lightContrast};
    ${p => getBorder(p.theme.border)};
    border-color: ${p => p.theme.colors.lightContrast};
  }

  ${TableBody} > &:last-of-type {
    ${p => getLastRowShape(p.theme.shape)};
  }

  ${TableBody} > &:hover {
    cursor: pointer;
    ${p => getBorder(p.theme.border)}
    border-color: ${p => p.theme.colors.callToAction};

  }

  ${TableBody} > &:focus {
    background-color: ${p => p.theme.colors.transparentCTA};
    ${p => getBorder(p.theme.border)}
    border-color: ${p => p.theme.colors.callToAction};
  }
`

type TableComponentType = StyledComponentType<TableProps>  & {
  Header: StyledComponentType<TableHeaderProps>
  Cell: StyledComponentType<TableCellProps>
  Row: StyledComponentType<TableRowProps>
  Body: StyledComponentType<TableBodyProps>
}

const Table = styled(TableBase)`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  justify-content: center;
  flex-direction: column;
  ${p => getShape(p.theme.shape)};
  ${p => getBorder(p.theme.border)};
  border-color: ${p => p.theme.colors.lightContrast};
  ${p => p.fullWidth && 'min-width: 100%'};
` as TableComponentType

Table.propTypes = {
  fullWidth: PropTypes.bool,
}

Table.Header = TableHeader
Table.Cell = TableCell
Table.Row = TableRow
Table.Body = TableBody

export default Table
