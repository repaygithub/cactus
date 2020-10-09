import { ColorStyle, Shape, TextStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { createContext, useContext, useLayoutEffect } from 'react'
import styled, { css, FlattenSimpleInterpolation } from 'styled-components'
import { width, WidthProps } from 'styled-system'

import { border, boxShadow, media, textStyle } from '../helpers/theme'
import variant from '../helpers/variant'
import { ScreenSizeContext, Size, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'

type CellAlignment = 'center' | 'right' | 'left'

type CellType = 'th' | 'td'

type BorderCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

type TableVariant = 'table' | 'card'

interface CellHeightProps {
  height: number
  cell: number
}

interface TableContextProps {
  cellType?: CellType
  inHeader: boolean
  headers?: React.ReactNode[]
  cellIndex: number
  variant: TableVariant
  largestCell: CellHeightProps
}

interface TableProps
  extends React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement> {
  fullWidth?: boolean
  cardBreakpoint?: Size
  variant?: TableVariant
  as?: React.ElementType
}

interface TableHeaderProps
  extends React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  > {
  variant?: TableVariant
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
  largestCell: {
    height: 0,
    cell: 0,
  },
}

const TableContext = createContext<TableContextProps>(DEFAULT_CONTEXT)

const Wrapper = styled.div<TableProps>`
  max-width: 100%;
  overflow-x: auto;
  margin: 0px 16px;
  ${(p): string => (p.fullWidth ? 'min-width: calc(100% - 32px)' : '')};
`

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ children, cardBreakpoint, ...props }, ref): React.ReactElement => {
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

function useCombinedRefs(...refs: any) {
  const targetRef = React.useRef<HTMLTableDataCellElement | null>(null)

  React.useEffect(() => {
    refs.forEach((ref: typeof targetRef) => {
      if (!ref) return
      else if (ref.current) {
        ref.current = targetRef.current
      }
    })
  }, [refs])

  return targetRef
}

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
      const innerRef = React.useRef(null)
      const combinedRef = useCombinedRefs(ref, innerRef)

      useLayoutEffect(() => {
        if (combinedRef && combinedRef.current) {
          if (combinedRef.current.clientHeight > context.largestCell.height) {
            context.largestCell.height = combinedRef.current.clientHeight
            context.largestCell.cell = combinedRef.current.cellIndex
          }
        }
      }, [combinedRef, context.largestCell.cell, context.largestCell.height, ref, children])
      if (combinedRef.current && combinedRef.current.cellIndex === context.largestCell.cell) {
        combinedRef.current.style.height = `${context.largestCell.height - 16}px`
      }
      const headerContent = context.headers && context.headers[context.cellIndex]
      context.cellIndex += colSpan
      props.variant = 'card'

      return (
        <StyledCell {...props} ref={combinedRef}>
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
        <StyledHeader {...props} variant={context.variant} ref={ref}>
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
            `}
    `,
    card: css`
      && {
        display: flex;
        width: 240px;
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: flex-start;
        padding: 8px 16px;
        > div[aria-hidden='true'] + div {
          align-self: flex-end;
        }
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
    ${(p): ColorStyle => p.theme.colorStyles.base};
  }
  ${headerVariants}
`

const table = css`
  display: table;
  ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'small')};
  border-spacing: 0;

  td,
  th {
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
    min-width: 272px;
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
