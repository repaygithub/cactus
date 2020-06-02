import { BorderSize, Shape } from '@repay/cactus-theme'
import { CactusTheme } from '@repay/cactus-theme'
import Flex from '../Flex/Flex'
import React, { FunctionComponent } from 'react'
import styled, { css, StyledComponentBase, ThemeProps } from 'styled-components'
import Text from '../Text/Text'

const BASE_WIDTH = 160

interface TableProps {
  className?: string
}

interface TableHeaderProps {
  className?: string
}
interface TableCellProps {
  className?: string
  type: string
}

interface TableRowProps {
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
const borderMap = {
  thin: css`
    border: 1px solid;
  `,
  thick: css`
    border: 2px solid;
  `,
}

const getShape = (shape: Shape) => shapeMap[shape]
const getBorder = (size: BorderSize) => borderMap[size]

const Tablebase: FunctionComponent<TableProps> = props => {
  const { children, className } = props

  return <div className={className}>{children}</div>
}

const getCellAlignment = (type: string) => {
  switch (type) {
    case 'label':
      return `flex-start`
    case 'amount':
      return 'flex-end'
    case 'icon':
      return 'center'
    default:
      return 'flex-start'
  }
}

const TableCellBase: FunctionComponent<TableCellProps & ThemeProps<CactusTheme>> = props => {
  const { children, className, type } = props

  return (
    <Flex className={className} padding="23px 16px">
      <Flex justifyContent={getCellAlignment(type)}>{children}</Flex>
    </Flex>
  )
}

const TableHeaderBase: FunctionComponent<TableHeaderProps> = props => {
  const { children, className } = props

  return (
    <Flex height="70px" width="auto" className={className}>
      {children}
    </Flex>
  )
}

const TableRowBase: FunctionComponent<TableRowProps> = props => {
  const { children, className } = props

  return (
    <Flex
      height="70px"
      width="auto"
      className={`${className} row`}
      tabIndex={0}
      justifyContent="space-evenly"
    >
      {children}
    </Flex>
  )
}

export const TableHeader = styled(TableHeaderBase)`
  border-color: ${p => p.theme.colors.base};
  background-color: ${p => p.theme.colors.base};
  ${p => getBorder(p.theme.border)};
  ${p => getShape(p.theme.shape)};
  margin-bottom: 4px;
  div > div {
    color: white;
    font-weight: bold;
    text-transform: uppercase;
  }
`
export const TableCell = styled(TableCellBase)`
  > div {
    width: 100%;
    align-items: center;
    color: ${p => p.theme.colors.darkestContrast};
    font-size: 15px;
    > svg {
      margin: 0 5px;
    }
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
  :nth-child(2n + 1) {
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
    fill-opacity: 0.17;
    cursor: pointer;
    background-color: #d5e8f2;
    border: 1px solid;
    fill-opacity: 0.17;
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
      ${p => getShape(p.theme.shape)};
      border-color: ${p => p.theme.colors.callToAction};
      box-sizing: border-box;
    }
  }
`

export const Table = styled(Tablebase)`
  display: flex;
  flex-direction: column;
  margin: 0 16px;
` as any

interface TableComponent extends StyledComponentBase<'div', CactusTheme, TableProps> {
  Header: React.ComponentType<TableHeaderProps>
  Cell: React.ComponentType<TableCellProps>
  Row: React.ComponentType<TableRowProps>
}

Table.Header = TableHeader
Table.Cell = TableCell
Table.Row = TableRow

export default Table as TableComponent
