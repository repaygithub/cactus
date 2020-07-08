import { border, boxShadow } from '../helpers/theme'
import { ScreenSizeContext, Size, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'
import { Shape } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'
import styled, { css, StyledComponentType } from 'styled-components'
import variant from '../helpers/variant'

type CellAlignment = 'center' | 'right' | 'left'

type CellType = 'th' | 'td'

type BorderCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

type TableVariant = 'table' | 'card'

interface TableContextProps {
  cellType?: CellType
  inHeader: boolean
  headers?: React.ReactNode[]
  cellIndex: number
  variant: TableVariant
}

interface TableProps
  extends React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement> {
  fullWidth?: boolean
  cardBreakpoint?: Size
  variant?: TableVariant
  as?: React.ReactType
}

interface TableHeaderProps
  extends React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  > {
  variant?: TableVariant
}

interface TableCellProps
  extends React.DetailedHTMLProps<
    React.TdHTMLAttributes<HTMLTableDataCellElement> &
      React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
    HTMLTableDataCellElement & HTMLTableHeaderCellElement
  > {
  variant?: TableVariant
  align?: CellAlignment
  as?: CellType
}

type TableRowProps = React.DetailedHTMLProps<
  React.TableHTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>

type TableBodyProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableSectionElement>,
  HTMLTableSectionElement
>

const DEFAULT_CONTEXT: TableContextProps = {
  inHeader: false,
  cellIndex: 0,
  variant: 'table',
}

const TableContext = createContext<TableContextProps>(DEFAULT_CONTEXT)

const Wrapper = styled.div<TableProps>`
  max-width: 100%;
  overflow-x: auto;
  margin: 0px 16px;
  ${(p) => p.fullWidth && 'min-width: calc(100% - 32px)'};
`

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ children, cardBreakpoint, ...props }, ref) => {
    const size = useContext(ScreenSizeContext)
    const context: TableContextProps = { ...DEFAULT_CONTEXT, headers: [] }
    if (props.variant) {
      context.variant = props.variant
    } else if (cardBreakpoint && size <= SIZES[cardBreakpoint]) {
      context.variant = 'card'
    }
    props.variant = context.variant
    return (
      <TableContext.Provider value={context}>
        {props.as ? (
          <StyledTable {...props} ref={ref}>
            {children}
          </StyledTable>
        ) : (
          <Wrapper fullWidth={props.fullWidth}>
            <StyledTable {...props} ref={ref}>
              {children}
            </StyledTable>
          </Wrapper>
        )}
      </TableContext.Provider>
    )
  }
)

export const TableCell = React.forwardRef<HTMLTableDataCellElement, TableCellProps>(
  ({ children, ...props }, ref) => {
    const context = useContext<TableContextProps>(TableContext)
    if (context.cellType && !props.as) {
      props.as = context.cellType
    }
    const colSpan = parseInt((props.colSpan as any) || '1')

    if (context.inHeader && context.headers) {
      context.headers[context.cellIndex] = children
      context.cellIndex += colSpan
    } else if (context.variant === 'card') {
      const headerContent = context.headers && context.headers[context.cellIndex]
      context.cellIndex += colSpan
      props.variant = 'card'
      return (
        <StyledCell {...props} ref={ref}>
          {headerContent && <HeaderBox>{headerContent}</HeaderBox>}
          <ContentBox>{children}</ContentBox>
        </StyledCell>
      )
    }

    props.variant = 'table'
    return (
      <StyledCell {...props} ref={ref}>
        {children}
      </StyledCell>
    )
  }
)

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, ...props }, ref) => {
    const context = useContext<TableContextProps>(TableContext)
    return (
      <TableContext.Provider value={{ ...context, inHeader: true, cellType: 'th', cellIndex: 0 }}>
        <StyledHeader {...props} variant={context.variant} ref={ref}>
          <tr>{children}</tr>
        </StyledHeader>
      </TableContext.Provider>
    )
  }
)

export const TableRow: React.FC<TableRowProps> = ({ children, ...props }) => {
  const context = useContext<TableContextProps>(TableContext)

  return (
    <TableContext.Provider value={{ ...context, cellIndex: 0 }}>
      <tr {...props} tabIndex={0}>
        {children}
      </tr>
    </TableContext.Provider>
  )
}

export const TableBody = 'tbody'

type ForwardRefComponent<T, P> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<T>
>

type TableComponentType = ForwardRefComponent<HTMLTableElement, TableProps> & {
  Header: ForwardRefComponent<HTMLTableSectionElement, TableHeaderProps>
  Cell: ForwardRefComponent<HTMLTableDataCellElement, TableCellProps>
  Row: React.FC<TableRowProps>
  Body: React.ReactType<TableBodyProps>
}

const DefaultTable = Table as TableComponentType
DefaultTable.Header = TableHeader
DefaultTable.Cell = TableCell
DefaultTable.Row = TableRow
DefaultTable.Body = TableBody

TableCell.propTypes = {
  align: PropTypes.oneOf<CellAlignment>(['center', 'right', 'left']),
  as: PropTypes.oneOf<CellType>(['th', 'td']),
}

Table.displayName = 'Table'

Table.propTypes = {
  fullWidth: PropTypes.bool,
  cardBreakpoint: PropTypes.oneOf<Size>(['tiny', 'small', 'medium', 'large', 'extraLarge']),
  variant: PropTypes.oneOf<TableVariant>(['table', 'card']),
  as: PropTypes.elementType as PropTypes.Validator<React.ElementType>,
}

Table.defaultProps = {
  cardBreakpoint: 'tiny',
}

export default DefaultTable

const shapeMap = {
  square: '1px',
  intermediate: '4px',
  round: '8px',
}

const getShape = (shape: Shape, location: BorderCorner) =>
  `border-${location}-radius: ${shapeMap[shape]}`

const HeaderBox = styled.div.attrs({ 'aria-hidden': 'true' })`
  text-transform: uppercase;
  font-weight: bold;
  text-align: left;
  max-width: 100%;
  flex-grow: 1;
  margin-right: 8px;
  &:empty {
    display: none;
  }
`

const ContentBox = styled.div`
  flex-grow: 1;
  text-align: right;
  max-width: 100%;
  &:only-child,
  ${HeaderBox}:empty + & {
    text-align: center;
    width: 100%;
  }
`

const StyledCell = styled.td(
  variant({
    table: css<TableCellProps>`
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
    `,
    card: css`
      && {
        display: flex;
        max-width: 100%;
        flex-flow: row wrap;
        justify-content: space-between;
        padding: 8px 16px;
        :nth-of-type(even) {
          background-color: ${(p) => p.theme.colors.lightContrast};
        }
        :last-child {
          border-bottom-left-radius: inherit;
          border-bottom-right-radius: inherit;
        }
      }
    `,
  })
)

const headerVariants = variant({
  card: css`
    tr {
      position: absolute;
      top: auto;
      left: -10000px;
    }
  `,
})

const StyledHeader = styled.thead<TableHeaderProps>`
  // Lots of specificity to override the first/last row border colors.
  &&&&& th,
  &&&&& td {
    text-transform: uppercase;
    border: ${(p) => border(p.theme, 'base')};
    ${(p) => p.theme.colorStyles.base};
  }
  ${headerVariants}
`

const table = css`
  display: table;
  ${(p) => p.theme.textStyles.small};
  border-spacing: 0;

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
`

const card = css`
  ${(p) => p.theme.textStyles.tiny};
  overflow-wrap: break-word;

  &,
  thead,
  tbody,
  tfoot {
    display: inline-flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
  }

  tr {
    display: flex;
    flex-flow: column nowrap;
    min-width: 272px;
    max-width: 360px;
    ${(p) => boxShadow(p.theme, 1)};
    background-color: ${(p) => p.theme.colors.white};
    border: ${(p) => border(p.theme, 'lightContrast')};
    border-radius: ${(p) => shapeMap[p.theme.shape]};
    margin: 4px;
    outline: 0;
    :focus {
      border-color: ${(p) => p.theme.colors.callToAction};
    }
  }
  th,
  td {
    display: block;
    text-align: center;
    max-width: 100%;
    padding: 8px 16px;
    :nth-of-type(even) {
      background-color: ${(p) => p.theme.colors.lightContrast};
    }
    :last-child {
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
    }
  }
`

const StyledTable = styled.table<TableProps>`
  ${(p) => p.fullWidth && 'min-width: 100%'};
  color: ${(p) => p.theme.colors.darkestContrast};

  th {
    font-weight: bold;
  }

  ${variant({ table, card })};
`
