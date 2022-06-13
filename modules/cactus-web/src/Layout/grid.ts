import { gte, isEqual, lte, noop } from 'lodash'
import React from 'react'
import { css } from 'styled-components'

import { useValue } from '../helpers/react'

const gridKeyOrder = ['header', 'left', 'component', 'right', 'footer'] as const
type GridPositionKey = typeof gridKeyOrder[number]

// This order is important to the logic in `gridFromFixed`.
const fixedKeyOrder = ['top', 'left', 'bottom', 'right'] as const
type FixedKey = typeof fixedKeyOrder[number]

type Length = string | number
// Same type constraint, but make two types for readability since they mean different things.
type Dimension = Length | undefined
type GridLine = string | number | undefined
type GridDimension = Dimension | Dimension[]
type ZIndex = { zIndex?: number }

interface FixedPosition extends ZIndex {
  fixed: FixedKey
  size: number
}

interface GridPosition {
  grid?: GridPositionKey
  width?: GridDimension
  height?: GridDimension
  row?: GridLine
  rowSpan?: GridLine
  rowEnd?: GridLine
  col?: GridLine
  colSpan?: GridLine
  colEnd?: GridLine
}

export type Position = FixedPosition | GridPosition
type CSSPosition = { [K in FixedKey]: number }

type Sizes = {
  width?: Length
  height?: Length
}
type FixedBox = { [K in FixedKey]?: Length } & Sizes & ZIndex

interface GridArea {
  row: GridLine
  rowSpan: GridLine
  rowEnd: GridLine
  column: GridLine
  columnSpan: GridLine
  columnEnd: GridLine
}
type GridKey = keyof GridArea

interface GridItem extends GridArea {
  role: string
}
type GridMap = Record<string, GridItem>

type RowCol = 'row' | 'column'

interface FixedLayout extends ZIndex {
  role: string
  order: number
  type: 'fixed'
  src: FixedPosition
  index: number
  key: FixedKey
  size: number
}

interface GridLayout extends GridArea {
  role: string
  order: number
  type: 'grid'
  src: GridPosition
  index: number
  key: GridPositionKey
  height: GridDimension
  width: GridDimension
}

type ComponentLayout = GridLayout | FixedLayout

interface AddAction {
  type: 'add'
  role: string
  position: Position
  order: number
}
interface RemoveAction {
  type: 'remove'
  role: string
}
type LayoutAction = AddAction | RemoveAction

type StyleList = (string | ReturnType<typeof css> | FixedBox)[]
interface BaseContext {
  styles: StyleList
  classes: Record<string, string>
}
interface LayoutState extends BaseContext {
  components: ComponentLayout[]
}
interface LayoutCtx extends BaseContext {
  dispatch: React.Dispatch<LayoutAction>
}

const INITIAL_STATE: LayoutState = { components: [], styles: [], classes: {} }

export const LayoutContext = React.createContext<LayoutCtx>({
  dispatch: noop,
  styles: [],
  classes: {},
})

export const useLayout = (role: string, position: Position, order = 0): string => {
  const { dispatch, classes } = React.useContext(LayoutContext)
  React.useEffect(() => {
    dispatch({ type: 'add', role, position, order })
  }, [role, position, order, dispatch])
  // Reduce thrashing by removing the layout in a separate effect.
  React.useEffect(() => () => dispatch({ type: 'remove', role }), [role, dispatch])
  return classes[role]
}

const generateCSSClass = (layout: ComponentLayout) =>
  `cactus-layout-${layout.role} cactus-${layout.type}-${layout.key}`

const reduceLayout = (state: LayoutState, action: LayoutAction) => {
  let newState = state
  const role = action.role
  const index = state.components.findIndex((c) => c.role === role)
  if (action.type === 'remove') {
    if (index >= 0) {
      const components = [...state.components]
      components.splice(index, 1)
      const classes = { ...state.classes }
      delete classes[role]
      newState = { ...state, components, classes }
    }
  } else {
    const old = state.components[index]
    if (!old || !isEqual(old.src, action.position) || old.order !== action.order) {
      const components = [...state.components]
      const layout = toComponentLayout(role, action.position, action.order)
      sortInsert(components, index, layout)
      const classes = { ...state.classes, [role]: generateCSSClass(layout) }
      newState = { ...state, components, classes }
    }
  }
  if (newState !== state) {
    newState.styles = generateGridStyles(newState.components)
  }
  return newState
}

const useGridLayout = (): LayoutCtx => {
  const [{ styles, classes }, dispatch] = React.useReducer(reduceLayout, INITIAL_STATE)
  return useValue({ dispatch, styles, classes }, [styles, classes])
}

export default useGridLayout

const sortInsert = (components: ComponentLayout[], index: number, layout: ComponentLayout) => {
  let insertIndex = index < 0 ? components.length : index
  components[insertIndex] = layout

  const sort = (ix: number, cmp: (a: number, b: number) => boolean) => {
    const compareTo = components[ix]
    const key = componentSortKey(compareTo, layout)
    if (key !== undefined) {
      // If the items are already ordered, break.
      if (cmp(key, 0)) return false
      // Otherwise, swap them and continue sorting.
      components[insertIndex] = compareTo
      components[ix] = layout
      insertIndex = ix
    }
    return true
  }

  for (let i = insertIndex - 1; i >= 0; i--) {
    if (!sort(i, lte)) break
  }
  // Now check up the list, but only if the item is in its original position.
  if (insertIndex === index) {
    for (let i = insertIndex + 1; i < components.length; i++) {
      if (!sort(i, gte)) break
    }
  }
}
const componentSortKey = (a: ComponentLayout, b: ComponentLayout) => {
  if (a.type === b.type) {
    let key = 0
    if (a.type === 'grid' && b.type === 'grid') {
      key = a.index - b.index
      if (!key && isAbsGridLine(a.row) && isAbsGridLine(b.row)) {
        key = a.row - b.row
      }
      if (!key && isAbsGridLine(a.column) && isAbsGridLine(b.column)) {
        key = a.column - b.column
      }
    }
    return key || a.order - b.order
  }
}

// To simplify calculations, require certain values to be absolute grid lines.
// Negative values are considered relative because we don't know what they'll
// actually be until we finish processing all the component layouts.
const isAbsGridLine = (x: GridLine): x is number => typeof x === 'number' && x > 0

const toComponentLayout = (role: string, position: Position, order: number): ComponentLayout => {
  if ('fixed' in position) {
    const index = fixedKeyOrder.indexOf(position.fixed)
    return {
      role,
      order,
      type: 'fixed',
      src: position,
      index,
      key: position.fixed,
      size: position.size,
      zIndex: position.zIndex,
    }
  }
  const key = position.grid ?? 'component'
  const gridIndex = gridKeyOrder.indexOf(key)
  if (gridIndex >= 0) {
    let { row, rowSpan, col, colSpan, colEnd, width, height } = position
    const rowEnd = position.rowEnd
    if (key === 'header' || key === 'footer') {
      width = undefined
      height = height || 'min-content'
      // Default to span all columns.
      col = col || 1
      if (!colSpan && !colEnd) colEnd = -1
    } else if (key === 'left' || key === 'right') {
      height = undefined
      width = width || 'min-content'
      // Default to the same row(s) occupied by the `main` role.
      row = row || 'main'
      if (!rowSpan && !rowEnd) rowSpan = 'main'
    }
    if (!rowSpan && !rowEnd) rowSpan = 1
    if (!colSpan && !colEnd) colSpan = 1
    return {
      role,
      order,
      type: 'grid',
      src: position,
      index: gridIndex,
      key,
      width,
      height,
      // Rename column props to match the CSS property names; makes generic code easier.
      row,
      rowSpan,
      rowEnd,
      column: col,
      columnSpan: colSpan,
      columnEnd: colEnd,
    }
  }
  throw new Error('Invalid layout')
}

const ZERO_POSITION: CSSPosition = { top: 0, left: 0, bottom: 0, right: 0 }
const BASIC_GRID = `
  display: -ms-grid;
  display: grid;
  position: absolute;
  overflow: auto;
`

const generateGridStyles = (components: ComponentLayout[]): StyleList => {
  const styles: StyleList = [BASIC_GRID]

  const rows: Dimension[] = []
  const columns: Dimension[] = []
  const gridItems: GridItem[] = []
  const gridRows: GridMap = {}
  const gridCols: GridMap = {}
  const fixed: CSSPosition & Sizes = { ...ZERO_POSITION }
  for (const layout of components) {
    if (layout.type === 'fixed') {
      styles.push(css`
        .cactus-layout-${layout.role} {
          position: fixed;
          ${getFixedBox(fixed, layout)}
        }
      `)
    } else {
      const gridItem = { role: layout.role } as GridItem
      if (setGridValues(gridItem, layout, 'row', rows)) {
        gridRows[layout.role] = gridItem
      }
      if (setGridValues(gridItem, layout, 'column', columns)) {
        gridCols[layout.role] = gridItem
      }
      gridItems.push(gridItem)
    }
  }
  const rowValue = rows.map(toCSSValues).join(' ') || '1fr'
  const colValue = columns.map(toCSSValues).join(' ') || '1fr'
  styles.push(`
    -ms-grid-rows: ${rowValue};
    grid-template-rows: ${rowValue};
    -ms-grid-columns: ${colValue};
    grid-template-columns: ${colValue};
  `)
  // Some CSS engines are too dumb to figure out height/width from the fixed position offsets.
  fixed.width = `calc(100% - ${fixed.left + fixed.right}px)`
  fixed.height = `calc(100% - ${fixed.top + fixed.bottom}px)`
  styles.push(fixedKeyOrder.reduce(reduceToPx, fixed))
  // The last line is at +1, and another +1 to offset negative line numbers starting at -1.
  const lastRow = rows.length + 2
  const lastColumn = columns.length + 2
  for (const grid of gridItems) {
    styles.push(`& > .cactus-layout-${grid.role} {
      ${asStyle('row', grid, gridRows, lastRow)}
      ${asStyle('column', grid, gridCols, lastColumn)}
    }`)
  }
  return styles
}

const setGridValues = (grid: GridItem, layout: GridLayout, dim: RowCol, sizes: Dimension[]) => {
  const dimEnd = (dim + 'End') as GridKey
  const dimSpan = (dim + 'Span') as GridKey
  // If the start is undefined, automatically add & use a grid line.
  const start = (grid[dim] = layout[dim] ?? sizes.length + 1)
  const end = (grid[dimEnd] = layout[dimEnd])
  let span = (grid[dimSpan] = layout[dimSpan])
  if (isAbsGridLine(start)) {
    if (!span && isAbsGridLine(end)) {
      grid[dimEnd] = span = end - start
    }
    // If we have an absolute start & span/end, we can set row/column sizes;
    // that also allows this area to be used in other components' relative grid lines.
    if (isAbsGridLine(span)) {
      const startIndex = start - 1
      const length = startIndex + span
      const src = dim === 'row' ? layout.height : layout.width
      for (let i = startIndex; i < length; i++) {
        const size = Array.isArray(src) ? src[i - startIndex] : src
        const existing = sizes[i]
        if (!existing) {
          sizes[i] = size
        } else if (size && existing !== size) {
          console.warn(`Mismatch on layout ${dim} ${i + 1}: was ${existing}, now ${size}`)
        }
      }
      return true
    }
  }
  return false
}

// This resolves relative grid lines to absolute line numbers.
const getAbsGridLine = (
  grid: GridItem,
  key: GridKey,
  namedItems: GridMap,
  lastLine: number,
  def: number
): number => {
  let value = grid[key]
  if (typeof value === 'string') {
    value = namedItems[value]?.[key]
  }
  if (typeof value === 'number') {
    return value > 0 ? value : Math.max(def, lastLine + value)
  }
  return def
}

// Converts GridItems to CSS, resolving relative grid lines as needed.
const asStyle = (dim: RowCol, grid: GridItem, namedItems: GridMap, lastLine: number) => {
  const start = getAbsGridLine(grid, dim as GridKey, namedItems, lastLine, 1)
  // Spans shouldn't be negative, so pass 0 as the `lastLine`.
  let span = getAbsGridLine(grid, (dim + 'Span') as GridKey, namedItems, 0, 0)
  if (!span) {
    const end = getAbsGridLine(grid, (dim + 'End') as GridKey, namedItems, lastLine, 0)
    span = Math.max(end - start, 1)
  }
  if (span === 1) {
    return `-ms-grid-${dim}: ${start}; grid-${dim}: ${start};`
  }
  return `
    -ms-grid-${dim}: ${start};
    -ms-grid-${dim}-span: ${span};
    grid-${dim}: ${start} / ${start + span};
  `
}

// Converts a fixed layout to a CSS object, and adjusts the layout grid's edges
// so they don't overlap with any fixed components.
const getFixedBox = (fixed: CSSPosition, layout: FixedLayout) => {
  const box: FixedBox = { ...fixed }
  if (layout.zIndex !== undefined) box.zIndex = layout.zIndex
  // Delete the opposite: e.g. if this is top, delete bottom.
  delete box[fixedKeyOrder[(layout.index + 2) % 4]]
  // left/right are odd indexes, top/bottom are evens.
  box[layout.index % 2 ? 'width' : 'height'] = `${layout.size}px`
  fixed[layout.key] += layout.size
  return fixedKeyOrder.reduce(reduceToPx, box)
}

const reduceToPx = (styles: FixedBox, key: FixedKey) => {
  if (styles[key]) {
    styles[key] = `${styles[key]}px`
  }
  return styles
}

const toCSSValues = (size: Dimension): string => {
  if (typeof size === 'number') {
    return `${size}px`
  }
  return size || 'min-content'
}
