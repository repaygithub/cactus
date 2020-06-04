import { BorderSize, Shape } from '@repay/cactus-theme'
import { CactusTheme } from '@repay/cactus-theme'
import React, { FunctionComponent } from 'react'
import styled, { css, StyledComponentBase } from 'styled-components'

type cellAlignment = 'center' | 'right' | 'left'

type cellType = 'th' | 'td'

interface TableProps {
  className?: string
}

interface TableHeaderProps {
  className?: string
}
interface TableCellProps {
  className?: string
  align: cellAlignment
  cellType: cellType
}

interface TableRowProps {
  className?: string
}
interface TableBodyProps {
  className?: string
}

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

const doubleBorder = {
  square: css`
    border-radius: 1px;
  `,
  intermediate: css`
    border-radius: 7px;
  `,
  round: css`
    border-radius: 11px;
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
const getDoubleBorder = (shape: Shape) => doubleBorder[shape]
const getBorder = (size: BorderSize) => borderMap[size]

const Tablebase: FunctionComponent<TableProps> = props => {
  const { children, className } = props

  return <table className={className}>{children}</table>
}

const TableCellBase: FunctionComponent<TableCellProps> = props => {
  const { children, className, cellType: Type } = props

  return (
    <Type className={className} align="left">
      {children}
    </Type>
  )
}

const TableHeaderBase: FunctionComponent<TableHeaderProps> = props => {
  const { children, className } = props

  return (
    <thead className={className}>
      <tr>{React.Children.map(children, child => child)}</tr>
    </thead>
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
  return <tbody className={className}>{children}</tbody>
}

export const TableHeader = styled(TableHeaderBase)`
  border-color: ${p => p.theme.colors.base};
  background-color: ${p => p.theme.colors.base};
  ${p => getBorder(p.theme.border)};
  ${p => getShape(p.theme.shape)};
  margin-bottom: 4px;
  tr > th {
    color: white;
    font-weight: bold;
    text-transform: uppercase;
  }
`

export const TableBody = styled(TableBodyBase)`
  display: flex;
  flex-direction: column;
`
export const TableCell = styled(TableCellBase)`
  max-width: 160px;
  align-items: center;
  padding: 23px 16px;
  color: ${p => p.theme.colors.darkestContrast};
  font-size: 15px;
  font-weight: normal;
  > svg {
    vertical-align: text-top;
    margin: 1px 10px;
  }

  ${p => p.theme.mediaQueries.medium} {
    width: calc(160px * 0.7125);
  }
  ${p => p.theme.mediaQueries.large} {
    width: calc(160px * 0.875);
  }

  ${p => p.theme.mediaQueries.extraLarge} {
    width: 160px;
  }
`

export const TableRow = styled(TableRowBase)`
  position: relative;
  margin: 4px 0;
  outline: 0;
  background-color: ${p => p.theme.colors.white};
  ${p => getShape(p.theme.shape)};
  ${p => getBorder(p.theme.border)};
  border-color: #dee8ed;
  :nth-of-type(even) {
    background-color: ${p => p.theme.colors.lightContrast};
    ${p => getShape(p.theme.shape)};
    ${p => getBorder(p.theme.border)};
    border-color: #5f7a88;
    :hover {
      background-color: #d5e8f2;
      border-color: ${p => p.theme.colors.callToAction};
    }
  }

  & small {
    color: ${p => p.theme.colors.darkestContrast};
  }
  :hover {
    fill: ${p => p.theme.colors.callToAction};
    cursor: pointer;
    background-color: #d5e8f2;
    border: 1px solid;
    border-color: ${p => p.theme.colors.callToAction};
    box-shadow: 0px 9px 24px rgba(3, 118, 176, 0.35);
  }
  :focus {
    ::after {
      content: '';
      display: block;
      position: absolute;
      height: calc(100% + 10px);
      width: calc(100% + 10px);
      top: -5px;
      left: -5px;
      border: 1px solid;
      ${p => getDoubleBorder(p.theme.shape)};
      border-color: ${p => p.theme.colors.callToAction};
      box-sizing: border-box;
    }
  }
`

export const Table = styled(Tablebase)`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  margin: 0 16px;
` as any

interface TableComponent extends StyledComponentBase<'div', CactusTheme, TableProps> {
  Header: React.ComponentType<TableHeaderProps>
  Cell: React.ComponentType<TableCellProps>
  Row: React.ComponentType<TableRowProps>
  Body: React.ComponentType<TableBodyProps>
}

Table.Header = TableHeader
Table.Cell = TableCell
Table.Row = TableRow
Table.Body = TableBody

export default Table as TableComponent
