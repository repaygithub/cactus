import { isEqual } from 'lodash'
import React from 'react'
import { css } from 'styled-components'

import { useValue } from '../helpers/react'

interface GridLayout {
  role: string
  type: 'grid'
  grid: GridPosition
}

interface RelLayout {
  role: string
  order: number
  type: 'rel'
  key: RelKey
  offset: Length
  index: number
}

interface FixedLayout {
  role: string
  order: number
  type: 'fixed'
  key: FixedKey
  offset: number
  index: number
}

type ComponentLayout = GridLayout | RelLayout | FixedLayout

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

type Style = string | ReturnType<typeof css> | FixedBox
interface LayoutState {
  components: ComponentLayout[]
  styles: Style[]
  position: { [K in FixedKey]: number }
  classes: Record<string, string>
}

const ZERO_POSITION = { top: 0, left: 0, bottom: 0, right: 0 }
const INITIAL_STATE: LayoutState = {
  components: [],
  styles: [],
  position: ZERO_POSITION,
  classes: {},
}

interface LayoutCtx {
  dispatch: React.Dispatch<LayoutAction>
  styles: LayoutState['styles']
  position: LayoutState['position']
  classes: LayoutState['classes']
}

export const LayoutContext = React.createContext<LayoutCtx>({
  dispatch: () => undefined,
  styles: [],
  position: ZERO_POSITION,
  classes: {},
})

const relKeyOrder = ['header', 'leftCol', 'main', 'rightCol', 'footer'] as const
type RelKey = typeof relKeyOrder[number]

// This order is important to the logic in `gridFromFixed`.
const fixedKeyOrder = ['top', 'left', 'bottom', 'right'] as const
type FixedKey = typeof fixedKeyOrder[number]

type FixedBox = { [K in FixedKey]?: Length } & {
  width?: Length
  height?: Length
}

type RelPosition = { [K in RelKey]?: Length }
type FixedPosition = { [K in FixedKey]?: number }
interface GridPosition {
  row: number
  rowSpan?: number
  height?: Dimension | Dimension[]
  col: number
  colSpan?: number
  width?: Dimension | Dimension[]
}
type Position = RelPosition | FixedPosition | GridPosition

type Length = string | number
type Dimension = Length | undefined

interface UseLayout {
  (role: string, position: GridPosition): string
  (role: string, position: RelPosition, order?: number): string
  (role: string, position: FixedPosition, order?: number): string
}
export const useLayout: UseLayout = (role: string, position: Position, order = 0): string => {
  const { dispatch, classes } = React.useContext(LayoutContext)
  React.useEffect(() => {
    dispatch({ type: 'add', role, position, order })
  }, [role, position, order, dispatch])
  React.useEffect(() => {
    return () => dispatch({ type: 'remove', role })
  }, [role, dispatch])
  return classes[role]
}

const generateCSSClass = (layout: ComponentLayout) => {
  if (layout.type !== 'grid') {
    return `cactus-layout-${layout.role} cactus-${layout.type}-${layout.key}`
  }
  return `cactus-layout-${layout.role} cactus-grid-${layout.grid.row}-${layout.grid.col}`
}

const reduceLayout = (state: LayoutState, { role, ...action }: LayoutAction) => {
  let newState = state
  const index = state.components.findIndex((c) => c.role === role)
  if (index < 0) {
    if (action.type === 'add') {
      const components = [...state.components]
      const layout = toComponentLayout(role, action.position, action.order)
      components.push(layout)
      const classes = { ...state.classes, [role]: generateCSSClass(layout) }
      newState = { ...state, components, classes }
    }
  } else if (action.type === 'remove') {
    const components = [...state.components]
    components.splice(index, 1)
    const classes = { ...state.classes }
    delete classes[role]
    newState = { ...state, components, classes }
  } else {
    const oldLayout = state.components[index]
    const newLayout = toComponentLayout(role, action.position, action.order)
    if (!isEqual(oldLayout, newLayout)) {
      const components = [...state.components]
      components[index] = newLayout
      const classes = { ...state.classes, [role]: generateCSSClass(newLayout) }
      newState = { ...state, components, classes }
    }
  }
  if (newState !== state) {
    generateGrid(newState)
  }
  return newState
}

const useGridLayout = (): LayoutCtx => {
  const [state, dispatch] = React.useReducer(reduceLayout, INITIAL_STATE)
  return useValue(
    {
      dispatch,
      styles: state.styles,
      classes: state.classes,
      position: state.position,
    },
    [state]
  )
}

export default useGridLayout

const toComponentLayout = (role: string, position: any, order: number): ComponentLayout => {
  if ('row' in position) {
    return { role, type: 'grid', grid: position }
  }
  const relIndex = relKeyOrder.findIndex((k) => k in position)
  if (relIndex >= 0) {
    const key = relKeyOrder[relIndex]
    return { role, order, type: 'rel', key, index: relIndex, offset: position[key] }
  }
  const fixedIndex = fixedKeyOrder.findIndex((k) => k in position)
  if (fixedIndex >= 0) {
    const key = fixedKeyOrder[fixedIndex]
    return { role, order, type: 'fixed', key, index: fixedIndex, offset: position[key] }
  }
  throw new Error('Invalid layout')
}

const sortByIndex = (a: RelLayout | FixedLayout, b: RelLayout | FixedLayout) =>
  a.index === b.index ? a.order - b.order : a.index - b.index
const sortByGrid = (a: GridLayout, b: GridLayout) =>
  a.grid.row === b.grid.row ? a.grid.col - b.grid.col : a.grid.row - b.grid.row

const generateGrid = (state: LayoutState) => {
  const rel: RelLayout[] = []
  const grid: GridLayout[] = []
  const fixed: FixedLayout[] = []
  for (const layout of state.components) {
    if (layout.type === 'rel') {
      rel.push(layout)
    } else if (layout.type === 'grid') {
      grid.push(layout)
    } else {
      fixed.push(layout)
    }
  }

  const rows: Dimension[] = []
  const columns: Dimension[] = []
  const styles: Record<string, string | FixedBox> = {}
  gridFromRel(styles, rows, columns, rel.sort(sortByIndex))
  gridFromGrid(styles, rows, columns, grid.sort(sortByGrid))
  state.position = gridFromFixed(styles, rows, columns, fixed.sort(sortByIndex))

  const rowValue = rows.map(toCSSValues, 'row').join(' ')
  const colValue = columns.map(toCSSValues, 'column').join(' ')
  state.styles = [
    `
    display: -ms-grid;
    display: grid;
    -ms-grid-rows: ${rowValue};
    grid-template-rows: ${rowValue};
    -ms-grid-columns: ${colValue};
    grid-template-columns: ${colValue};
    position: absolute;
    overflow: auto;
  `,
    fixedKeyOrder.reduce(reduceToPx, state.position),
  ]

  const spanAllColumns = `
    -ms-grid-column: 1;
    -ms-grid-column-span: ${columns.length};
    grid-column: 1 / span ${columns.length};
  `
  for (const role of Object.keys(styles)) {
    const style = styles[role]
    const layoutClass = state.classes[role].split(' ')[0]
    if (typeof style === 'string') {
      state.styles.push(`& > .${layoutClass} {
        ${style.replace(SPAN_ALL_COLUMNS, spanAllColumns)}
      }`)
    } else {
      state.styles.push(css`
        .${layoutClass} {
          position: fixed;
          ${style}
        }
      `)
    }
  }
}

const assignSizes = (
  dim: Dimension[],
  start: number,
  span: number,
  src: Dimension | Dimension[],
  name: 'row' | 'column'
) => {
  const style = `
    -ms-grid-${name}: ${start};
    -ms-grid-${name}-span: ${span};
    grid-${name}: ${start} / span ${span};
  `
  start -= 1
  span += start
  for (let i = start; i < span; i++) {
    const size = Array.isArray(src) ? src[i - start] : src
    const existing = dim[i]
    if (!existing) {
      dim[i] = size
    } else if (size && existing !== size) {
      console.warn(`Mismatch on layout ${name} ${i + 1}: was ${existing}, now ${size}`)
    }
  }
  return style
}

const SPAN_ALL_COLUMNS = /SPAN_ALL_COLUMNS/g

type StyleMap = Record<string, string | FixedBox>
const gridFromRel = (
  styles: StyleMap,
  rows: Dimension[],
  columns: Dimension[],
  relLayouts: RelLayout[]
) => {
  let row = 1
  let col = 1
  let mainRow: number | undefined = undefined
  for (const layout of relLayouts) {
    let rowStyle = ''
    let colStyle = ''
    if (layout.key === 'header' || layout.key === 'footer') {
      if (row === mainRow) row++
      rowStyle = assignSizes(rows, row++, 1, layout.offset, 'row')
      colStyle = SPAN_ALL_COLUMNS.source
    } else {
      let offset = layout.offset
      if (layout.key === 'main') {
        mainRow = row
        if (typeof offset === 'string') {
          const [colOffset, rowOffset] = offset.split(';')
          offset = colOffset
          rows[row - 1] = rowOffset
        }
      }
      colStyle = assignSizes(columns, col++, 1, offset, 'column')
      rowStyle = `-ms-grid-row: ${row}; grid-row: ${row};`
    }
    styles[layout.role] = rowStyle + colStyle
  }
}

const gridFromGrid = (
  styles: StyleMap,
  rows: Dimension[],
  columns: Dimension[],
  gridLayouts: GridLayout[]
) => {
  for (const layout of gridLayouts) {
    const { width, height, row, rowSpan = 1, col, colSpan = 1 } = layout.grid
    const rowStyle = assignSizes(rows, row, rowSpan, height, 'row')
    const colStyle = assignSizes(columns, col, colSpan, width, 'column')
    styles[layout.role] = rowStyle + colStyle
  }
}

const gridFromFixed = (
  styles: StyleMap,
  rows: Dimension[],
  columns: Dimension[],
  fixedLayouts: FixedLayout[]
) => {
  const fixed = { ...ZERO_POSITION }
  for (const layout of fixedLayouts) {
    const box: FixedBox = { ...fixed }
    // Delete the opposite: e.g. if this is top, delete bottom.
    delete box[fixedKeyOrder[(layout.index + 2) % 4]]
    // left/right are odd indexes, top/bottom are evens.
    box[layout.index % 2 ? 'width' : 'height'] = `${layout.offset}px`
    fixed[layout.key] += layout.offset
    styles[layout.role] = fixedKeyOrder.reduce(reduceToPx, box)
  }
  return fixed
}

const reduceToPx = (styles: FixedBox, key: FixedKey) => {
  if (styles[key]) {
    styles[key] = `${styles[key]}px`
  }
  return styles
}

function toCSSValues(this: string, size: Dimension, i: number): string {
  if (typeof size === 'number') {
    return `${size}px`
  } else if (!size) {
    console.warn(`Missing layout size for ${this} ${i + 1}`)
    return 'min-content'
  }
  return size
}
