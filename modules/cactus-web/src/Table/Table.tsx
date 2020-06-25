import { border } from '../helpers/theme'
import { Shape } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { createContext, FunctionComponent, useContext } from 'react'
import styled, { StyledComponentType } from 'styled-components'

type cellAlignment = 'center' | 'right' | 'left'

type cellType = 'th' | 'td'

type BorderCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

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
  square: '1px',
  intermediate: '4px',
  round: '8px',
}

const getShape = (shape: Shape, location: BorderCorner) =>
  `border-${location}-radius: ${shapeMap[shape]}`

const Wrapper = styled.div<TableProps>`
  max-width: 100%;
  overflow-x: auto;
  margin: 0px 16px;
  ${(p) => p.fullWidth && 'min-width: calc(100% - 32px)'};
`
const TableBase: FunctionComponent<TableProps> = (props) => {
  const { children, className, fullWidth } = props

  return (
    <Wrapper fullWidth={fullWidth}>
      <table className={className}>{children}</table>
    </Wrapper>
  )
}

const TableCellBase: FunctionComponent<TableCellProps> = (props) => {
  const { children, className, align } = props
  const { cellType: Type } = useContext(TableContext)

  return <Type className={className}>{children}</Type>
}

const TableHeaderBase: FunctionComponent<TableHeaderProps> = (props) => {
  const { children, className } = props

  return (
    <TableContext.Provider value={{ cellType: 'th' }}>
      <thead className={className}>
        <Table.Row>{children}</Table.Row>
      </thead>
    </TableContext.Provider>
  )
}

const TableRowBase: FunctionComponent<TableRowProps> = (props) => {
  const { children, className } = props

  return (
    <tr className={className} tabIndex={0}>
      {children}
    </tr>
  )
}

const TableBodyBase: FunctionComponent<TableBodyProps> = (props) => {
  const { children, className } = props
  return (
    <TableContext.Provider value={{ cellType: 'td' }}>
      <tbody className={className}>{children}</tbody>
    </TableContext.Provider>
  )
}

export const TableHeader = styled(TableHeaderBase)`
  // Lots of specificity to override the first/last row border colors.
  &&&&& th,
  &&&&& td {
    text-transform: uppercase;
    border: ${(p) => border(p.theme, 'base')};
    ${(p) => p.theme.colorStyles.base};
  }
`

export const TableBody = styled(TableBodyBase)``
export const TableCell = styled(TableCellBase)`
  text-align: ${(p) => p.align || 'left'};
  padding: 16px;
  min-width: calc(160px * 0.7125);

  ${(p) =>
    p.theme.mediaQueries &&
    `${p.theme.mediaQueries.large} {
    min-width: calc(160px * 0.875);
  }`}

  ${(p) =>
    p.theme.mediaQueries &&
    `${p.theme.mediaQueries.extraLarge} {
    min-width: 160px;
  }`}
`

const TableRow = styled(TableRowBase)``

type TableComponentType = StyledComponentType<TableProps> & {
  Header: StyledComponentType<TableHeaderProps>
  Cell: StyledComponentType<TableCellProps>
  Row: StyledComponentType<TableRowProps>
  Body: StyledComponentType<TableBodyProps>
}

const Table = styled(TableBase)`
  ${(p) => p.fullWidth && 'min-width: 100%'};
  border-spacing: 0;
  color: ${(p) => p.theme.colors.darkestContrast};
  ${(p) => p.theme.textStyles.small};

  th {
    font-weight: bold;
  }

  td,
  th {
    background-color: ${(p) => p.theme.colors.white};
    border-top: ${(p) => border(p.theme, 'transparent')};
    border-bottom: ${(p) => border(p.theme, 'transparent')};
    :first-child {
      border-left: ${(p) => border(p.theme, 'lightContrast')};
    }
    :last-child {
      border-right: ${(p) => border(p.theme, 'lightContrast')};
    }
  }

  tr:nth-of-type(even) {
    td,
    th {
      background-color: ${(p) => p.theme.colors.lightContrast};
    }
  }

  &&& tr:hover {
    cursor: pointer;
    th,
    td {
      border-color: ${(p) => p.theme.colors.callToAction};
    }
  }

  &&& tr:focus {
    outline: 0;
    td,
    th {
      background-color: ${(p) => p.theme.colors.transparentCTA};
      border-color: ${(p) => p.theme.colors.callToAction};
    }
  }

  // first row
  & > tr:first-of-type,
  tbody > tr:first-child,
  thead > tr:first-child {
    th,
    td {
      border-top-color: ${(p) => p.theme.colors.lightContrast};
      :first-child {
        ${(p) => getShape(p.theme.shape, 'top-left')};
      }
      :last-child {
        ${(p) => getShape(p.theme.shape, 'top-right')};
      }
    }
  }

  // first row false positives
  && > thead + tr:first-of-type,
  && > thead + tbody > tr:first-child {
    th,
    td {
      border-top-color: transparent;
      border-top-left-radius: 0px;
      border-top-right-radius: 0px;
    }
  }

  // last row
  &,
  tbody:last-child,
  thead:last-child,
  tfoot:last-child {
    & > tr:last-child {
      th,
      td {
        border-bottom-color: ${(p) => p.theme.colors.lightContrast};
        :first-child {
          ${(p) => getShape(p.theme.shape, 'bottom-left')};
        }
        :last-child {
          ${(p) => getShape(p.theme.shape, 'bottom-right')};
        }
      }
    }
  }
` as TableComponentType

Table.propTypes = {
  fullWidth: PropTypes.bool,
}

Table.Header = TableHeader
Table.Cell = TableCell
Table.Row = TableRow
Table.Body = TableBody

export default Table
