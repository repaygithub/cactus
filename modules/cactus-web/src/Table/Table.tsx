import { ColorStyle, Shape, TextStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { createContext, useContext, useLayoutEffect } from 'react'
import styled, { css, FlattenSimpleInterpolation } from 'styled-components'
import { width, WidthProps } from 'styled-system'

import { useMergedRefs } from '../helpers/react'
import { border, boxShadow, media, textStyle } from '../helpers/theme'
import variant from '../helpers/variant'
import { ScreenSizeContext, Size, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'

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
  dividers?: boolean
}

interface TableProps
  extends React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement> {
  fullWidth?: boolean
  cardBreakpoint?: Size
  variant?: TableVariant
  as?: React.ElementType
  dividers?: boolean
}

interface TableHeaderProps
  extends React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  > {
  variant?: TableVariant
  dividers?: boolean
}

export interface TableCellProps
  extends WidthProps,
    Omit<
      React.DetailedHTMLProps<
        React.TdHTMLAttributes<HTMLTableDataCellElement> &
          React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
        HTMLTableDataCellElement & HTMLTableHeaderCellElement
      >,
      'width'
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
  dividers: false,
}

const TableContext = createContext<TableContextProps>(DEFAULT_CONTEXT)

const Wrapper = styled.div<TableProps>`
  max-width: 100%;
  overflow-x: auto;
  margin: 0px 16px;
  ${(p): string => (p.fullWidth ? 'min-width: calc(100% - 32px)' : '')};
`

interface heightInfoProps {
  max: number
  cells: any[]
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ children, cardBreakpoint, ...props }, ref): React.ReactElement => {
    const size = useContext(ScreenSizeContext)
    const context: TableContextProps = { ...DEFAULT_CONTEXT, headers: [] }
    const tableRef = React.useRef<HTMLTableElement>(null)
    const mergedRef = useMergedRefs(ref, tableRef)
    useLayoutEffect(() => {
      const heightInfo: heightInfoProps[] = []
      let height = 0

      if (context.variant === 'card') {
        const cells = tableRef.current?.querySelectorAll(`${StyledCell}`)
        if (cells && cells.length > 0) {
          cells.forEach((cell) => {
            const cellIndex = (cell as HTMLTableCellElement).cellIndex
            const info = heightInfo[cellIndex] || (heightInfo[cellIndex] = { max: 0, cells: [] })
            const [first, second] = cell.childNodes as any
            const rect1 = first?.getBoundingClientRect?.()
            const rect2 = second?.getBoundingClientRect?.()
            if (rect1) {
              if (!rect2 || rect1.width + rect2.width < cell.clientWidth - 16) {
                height = rect1.height
              } else {
                height = rect1.height + rect2.height + 16
              }
              info.max = Math.max(info.max, height)
              info.cells.push({ height, cell })
            }
          })

          // We queue the updates then make them all at once to avoid layout thrashing.
          for (const info of heightInfo) {
            for (const cellInfo of info.cells) {
              cellInfo.cell.style.minHeight = `${info.max}px`
            }
          }
        }
      }
    })
    if (props.variant) {
      context.variant = props.variant
    } else if (cardBreakpoint && size <= SIZES[cardBreakpoint]) {
      context.variant = 'card'
    }
    if (props.dividers) {
      context.dividers = props.dividers
    }
    props.variant = context.variant
    return (
      <TableContext.Provider value={context}>
        {props.as ? (
          <StyledTable {...props} ref={mergedRef}>
            {children}
          </StyledTable>
        ) : (
          <Wrapper fullWidth={props.fullWidth}>
            <StyledTable {...props} ref={mergedRef}>
              {children}
            </StyledTable>
          </Wrapper>
        )}
      </TableContext.Provider>
    )
  }
)

export const TableCell = React.forwardRef<HTMLTableDataCellElement, TableCellProps>(
  ({ children, ...props }, ref): React.ReactElement => {
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
  ({ children, ...props }, ref): React.ReactElement => {
    const context = useContext<TableContextProps>(TableContext)
    return (
      <TableContext.Provider value={{ ...context, inHeader: true, cellType: 'th', cellIndex: 0 }}>
        <StyledHeader {...props} variant={context.variant} ref={ref} dividers={context.dividers}>
          <tr>{children}</tr>
        </StyledHeader>
      </TableContext.Provider>
    )
  }
)

export const TableRow: React.FC<TableRowProps> = ({ children, ...props }): React.ReactElement => {
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
  Body: React.ElementType<TableBodyProps>
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

const getShape = (shape: Shape, location: BorderCorner): string =>
  `border-${location}-radius: ${shapeMap[shape]}`

const HeaderBox = styled.div.attrs({ 'aria-hidden': 'true' })`
  text-transform: uppercase;
  font-weight: 600;
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
  &:only-child,
  ${HeaderBox}:empty + & {
    text-align: center;
  }
  ${HeaderBox}:not(:empty) + & {
    align-self: flex-end;
  }
`

const StyledCell = styled.td(
  variant({
    table: css<TableCellProps>`
      text-align: ${(p): string => p.align || 'left'};
      padding: 16px;
      ${(p) =>
        p.width
          ? width
          : css`
              min-width: calc(160px * 0.7125);
              ${media(p.theme, 'large')} {
                min-width: calc(160px * 0.875);
              }
              ${media(p.theme, 'extraLarge')} {
                min-width: 160px;
              }
            `};
    `,
    card: css`
      && {
        display: flex;
        width: 240px;
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: flex-start;
        box-sizing: border-box;
        padding: 8px 16px;
        :nth-of-type(even) {
          background-color: ${(p): string => p.theme.colors.lightContrast};
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
    border: ${(p): string => border(p.theme, 'base')};
    border-right: ${(p): string => (p.dividers ? border(p.theme, 'mediumContrast') : '')};
    ${(p): ColorStyle => p.theme.colorStyles.base};
  }
  ${headerVariants}
`

const table = css<TableProps>`
  display: table;
  ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'body')};
  border-spacing: 0;
  td,
  th {
    border-right: ${(p): string => (p.dividers ? border(p.theme, 'lightContrast') : '')};
    background-color: ${(p): string => p.theme.colors.white};
    border-top: ${(p): string => border(p.theme, 'transparent')};
    border-bottom: ${(p): string => border(p.theme, 'transparent')};
    :first-child {
      border-left: ${(p): string => border(p.theme, 'lightContrast')};
    }
    :last-child {
      border-right: ${(p): string => border(p.theme, 'lightContrast')};
    }
  }
  tr:nth-of-type(even) {
    td,
    th {
      background-color: ${(p): string => p.theme.colors.lightContrast};
    }
    td:not(:last-child) {
      border-right: ${(p): string => (p.dividers ? border(p.theme, 'white') : '')};
    }
  }

  &&& tr:hover {
    th,
    td {
      border-color: ${(p): string => p.theme.colors.callToAction};
    }
  }
  &&& tr:focus {
    outline: 0;
    td,
    th {
      background-color: ${(p): string => p.theme.colors.transparentCTA};
      border-color: ${(p): string => p.theme.colors.callToAction};
    }
  }
  // first row
  & > tr:first-of-type,
  tbody > tr:first-child,
  thead > tr:first-child {
    th,
    td {
      border-top-color: ${(p): string => p.theme.colors.lightContrast};
      :first-child {
        ${(p): string => getShape(p.theme.shape, 'top-left')};
      }
      :last-child {
        ${(p): string => getShape(p.theme.shape, 'top-right')};
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
        border-bottom-color: ${(p): string => p.theme.colors.lightContrast};
        :first-child {
          ${(p): string => getShape(p.theme.shape, 'bottom-left')};
        }
        :last-child {
          ${(p): string => getShape(p.theme.shape, 'bottom-right')};
        }
      }
    }
  }
`

const card = css`
  ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'tiny')};
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
    min-width: 240px;
    max-width: 360px;
    ${(p): string => boxShadow(p.theme, 1)};
    background-color: ${(p): string => p.theme.colors.white};
    border: ${(p): string => border(p.theme, 'lightContrast')};
    border-radius: ${(p): string => shapeMap[p.theme.shape]};
    margin: 4px;
    outline: 0;
    :focus {
      border-color: ${(p): string => p.theme.colors.callToAction};
    }
  }
  th,
  td {
    display: block;
    text-align: center;
    max-width: 100%;
    padding: 8px 16px;
    :nth-of-type(even) {
      background-color: ${(p): string => p.theme.colors.lightContrast};
    }
    :last-child {
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
    }
  }
`

const StyledTable = styled.table<TableProps>`
  ${(p): string => (p.fullWidth ? 'min-width: 100%' : '')};
  color: ${(p): string => p.theme.colors.darkestContrast};
  th {
    font-weight: 600;
  }
  ${variant({ table, card })};
`
