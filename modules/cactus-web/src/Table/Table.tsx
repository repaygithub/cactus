import {
  border,
  boxShadow,
  CactusTheme,
  color,
  ColorStyle,
  mediaGTE,
  radius,
  ScreenSize,
  screenSizes,
  textStyle,
} from '@repay/cactus-theme'
import { Property } from 'csstype'
import PropTypes from 'prop-types'
import React, { createContext, useContext, useLayoutEffect } from 'react'
import styled, { css, ThemeProps } from 'styled-components'
import { margin, MarginProps, ResponsiveValue, system } from 'styled-system'

import { extractMargins } from '../helpers/omit'
import { useMergedRefs } from '../helpers/react'
import { allWidth, AllWidthProps, withStyles } from '../helpers/styled'
import variant from '../helpers/variant'
import { ScreenSizeContext, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'

type CellType = 'th' | 'td'
type BorderCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
export type FocusOption = boolean | 'mouse-only'
export type TableVariant = 'table' | 'card' | 'mini'
export type StickyColAlignment = 'right' | 'none'

interface TableContextProps {
  cellType?: CellType
  inHeader: boolean
  headers?: React.ReactNode[]
  cellIndex: number
  variant: TableVariant
  dividers?: boolean
  rowFocus: FocusOption
}

type TableAttrs = Omit<React.TableHTMLAttributes<HTMLTableElement>, 'width'>
interface TableProps extends AllWidthProps, MarginProps, TableAttrs {
  cardBreakpoint?: ScreenSize
  variant?: TableVariant
  dividers?: boolean
  sticky?: StickyColAlignment
  rowFocus?: FocusOption
  rowHover?: boolean
  noScrollWrapper?: boolean
}

interface TableHeaderProps extends React.TableHTMLAttributes<HTMLTableSectionElement> {
  variant?: TableVariant
  dividers?: boolean
  sticky?: StickyColAlignment
}

// ThHTMLAttributes is a strict subset of TdHTMLAttributes.
type CellAttrs = Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'width' | 'align'>

export interface TableCellProps extends AllWidthProps, CellAttrs {
  ref?: React.Ref<HTMLTableCellElement>
  variant?: TableVariant
  align?: ResponsiveValue<Property.TextAlign>
  as?: CellType
}

type TableRowProps = React.TableHTMLAttributes<HTMLTableRowElement>

type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>

const DEFAULT_CONTEXT: TableContextProps = {
  inHeader: false,
  cellIndex: 0,
  variant: 'table',
  dividers: false,
  rowFocus: true,
}

const TableContext = createContext<TableContextProps>(DEFAULT_CONTEXT)

const Wrapper = withStyles('div', {
  displayName: 'TableWrapper',
  styles: [margin],
})<MarginProps>`
  max-width: 100%;
  overflow-x: auto;
`

interface heightInfoProps {
  max: number
  cells: any[]
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>((initProps, ref) => {
  const { children, cardBreakpoint, sticky = 'none', rowFocus = true, ...props } = initProps
  const size = useContext(ScreenSizeContext)
  const context: TableContextProps = { ...DEFAULT_CONTEXT, headers: [], rowFocus }
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
      {props.noScrollWrapper ? (
        <StyledTable {...props} sticky={sticky} ref={mergedRef}>
          {children}
        </StyledTable>
      ) : (
        <Wrapper {...extractMargins(props)}>
          <StyledTable {...props} sticky={sticky} ref={mergedRef}>
            {children}
          </StyledTable>
        </Wrapper>
      )}
    </TableContext.Provider>
  )
})

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
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
        <CardCell {...props} ref={ref}>
          {headerContent && <HeaderBox>{headerContent}</HeaderBox>}
          <ContentBox>{children}</ContentBox>
        </CardCell>
      )
    }

    props.variant = context.variant
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
  const tabIndex = context.rowFocus === 'mouse-only' ? -1 : context.rowFocus ? 0 : undefined

  return (
    <TableContext.Provider value={{ ...context, cellIndex: 0 }}>
      <tr tabIndex={tabIndex} {...props}>
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
  Cell: ForwardRefComponent<HTMLTableCellElement, TableCellProps>
  Row: React.FC<TableRowProps>
  Body: React.ElementType<TableBodyProps>
}

const DefaultTable = Table as TableComponentType
DefaultTable.Header = TableHeader
DefaultTable.Cell = TableCell
DefaultTable.Row = TableRow
DefaultTable.Body = TableBody

TableCell.propTypes = {
  as: PropTypes.oneOf<CellType>(['th', 'td']),
}

Table.displayName = 'Table'

Table.propTypes = {
  // @ts-ignore
  rowFocus: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['mouse-only'])]),
  rowHover: PropTypes.bool,
  cardBreakpoint: PropTypes.oneOf<ScreenSize>(screenSizes),
  variant: PropTypes.oneOf<TableVariant>(['table', 'card', 'mini']),
  noScrollWrapper: PropTypes.bool,
}

Table.defaultProps = {
  cardBreakpoint: 'tiny',
  rowFocus: true,
  rowHover: true,
}

export default DefaultTable

const getShape = (location: BorderCorner) => css`border-${location}-radius: ${radius(8)};`

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
  overflow-wrap: break-word;
  word-wrap: break-word;
  min-width: 20%;
  &:only-child,
  ${HeaderBox}:empty + & {
    text-align: center;
  }
  ${HeaderBox}:not(:empty) + & {
    align-self: flex-end;
  }
`

const StyledCell: React.FC<TableCellProps> = withStyles('td', {
  displayName: 'TableCell',
  styles: [allWidth, system({ align: { property: 'textAlign' } })],
  transitiveProps: ['variant'],
})(
  variant({
    table: css<AllWidthProps>`
      text-align: left;
      padding: 16px;
      ${(p) =>
        !p.width &&
        `
          min-width: calc(160px * 0.7125);
          ${mediaGTE(p, 'large')} {
            min-width: calc(160px * 0.875);
          }
          ${mediaGTE(p, 'extraLarge')} {
            min-width: 160px;
          }
        `}
    `,
    mini: css`
      text-align: left;
      padding: 8px;
    `,
  })
) as any

// This one ignores prop styles.
const CardCell: React.FC<TableCellProps> = withStyles('td', {
  displayName: 'CardCell',
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  transitiveProps: ['align', 'variant', ...allWidth.propNames!],
})`
  display: flex;
  width: 240px;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: flex-start;
  box-sizing: border-box;
` as any

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
    border: ${border('base')};
    border-right: ${(p) => (p.dividers ? border(p.theme, 'mediumContrast') : '')};
    ${(p): ColorStyle => p.theme.colorStyles.base};
  }
  ${headerVariants}
`

const getCTABorder = (p: ThemeProps<CactusTheme>, focus?: boolean) => {
  return css`
    th,
    td {
      border-left-color: ${p.theme.colors.callToAction};
      border-top-color: ${p.theme.colors.callToAction};
      border-bottom-color: ${p.theme.colors.callToAction};
      background-color: ${focus && p.theme.colors.lightCallToAction};
    }
    td:last-child {
      border-color: ${p.theme.colors.callToAction};
    }
  `
}

const table = css<TableProps>`
  display: table;
  ${(p) => textStyle(p.theme, p.variant === 'mini' ? 'small' : 'body')};
  border-spacing: 0;
  td,
  th {
    border-right: ${(p) => (p.dividers ? border(p.theme, 'lightContrast') : '')};
    background-color: ${color('white')};
    border-top: ${border('transparent')};
    border-bottom: ${border('transparent')};
    :first-child {
      border-left: ${border('lightContrast')};
    }
    :last-child {
      border-right: ${border('lightContrast')};
      :focus-within {
        z-index: 1;
      }
      ${(p) =>
        p.sticky === 'right' ? `position: sticky; right: 0; ${boxShadow(p.theme, 0)}` : ''};
    }
  }
  tr:nth-of-type(even) {
    td,
    th {
      background-color: ${color('lightContrast')};
    }
    td:not(:last-child) {
      border-right: ${(p) => (p.dividers ? border(p.theme, 'white') : '')};
    }
  }

  &&& tr:hover {
    ${(p) => p.rowHover && getCTABorder(p)}
  }
  &&& tr:focus {
    outline: 0;
    ${(p) => getCTABorder(p, true)}
  }
  // first row
  & > tr:first-of-type,
  tbody > tr:first-child,
  thead > tr:first-child {
    th,
    td {
      border-top-color: ${color('lightContrast')};
      :first-child {
        ${getShape('top-left')};
      }
      :last-child {
        ${getShape('top-right')};
      }
    }
  }
  // first row false positives
  && > thead + tr:first-of-type,
  && > thead + tbody > tr:first-child {
    th,
    td {
      border-top-color: transparent;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
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
        border-bottom-color: ${color('lightContrast')};
        :first-child {
          ${getShape('bottom-left')};
        }
        :last-child {
          ${getShape('bottom-right')};
        }
      }
    }
  }
`

// Card carousel needs overflow regardless of wrapper; overflow doesn't normally
// work with <table> elements, but it does work when changing the `display` property.
const card = css<TableProps>`
  ${textStyle('tiny')};
  // This margin prevents the box shadow from being cut off.
  margin-bottom: 6px;
  ${(p) =>
    p.noScrollWrapper &&
    `
    overflow-x: auto;
    max-width: 100%;
  `}
  overflow-wrap: break-word;
  &,
  thead,
  tbody,
  tfoot {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
  }
  tr {
    display: flex;
    flex-flow: column nowrap;
    min-width: 240px;
    max-width: 360px;
    ${boxShadow(1)}
    background-color: ${color('white')};
    border: ${border('lightContrast')};
    border-radius: ${radius(8)};
    margin: 4px;
    outline: 0;
    :focus {
      border-color: ${color('callToAction')};
    }
  }
  th,
  td {
    text-align: center;
    max-width: 100%;
    padding: 8px 16px;
    :nth-of-type(even) {
      background-color: ${color('lightContrast')};
    }
    :last-child {
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
    }
  }
`

const StyledTable = withStyles('table', {
  displayName: 'Table',
  as: 'table',
  styles: [margin, allWidth],
  transitiveProps: ['variant', 'dividers', 'sticky', 'rowHover', 'noScrollWrapper'],
})`
  color: ${color('darkestContrast')};
  th {
    font-weight: 600;
  }
  ${variant({ table, card, mini: table })};
` as React.FC<TableProps & { ref?: React.Ref<HTMLTableElement> }>
