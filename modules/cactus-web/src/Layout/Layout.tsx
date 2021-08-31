import React from 'react'
import styled, { css } from 'styled-components'
// @ts-ignore The types library doesn't have `overflowX` & `overflowY` for some reason.
import { overflow, OverflowProps, overflowX, overflowY } from 'styled-system'

import ActionProvider from '../ActionBar/ActionProvider'
import { getDataProps } from '../helpers/omit'
import ScreenSizeProvider from '../ScreenSizeProvider/ScreenSizeProvider'

export type Role = 'menubar' | 'actionbar' | 'footer' | 'brandbar'

export type Position = 'fixedLeft' | 'floatLeft' | 'fixedBottom' | 'flow'

export type LayoutProps = { [K in Position]: number }

export interface LayoutInfo {
  position: Position
  offset: number
}

type ComponentInfo = { [K in Role]?: LayoutInfo }

interface LayoutCtx extends LayoutProps {
  setLayout: (l: Partial<LayoutProps>) => void
  componentInfo: ComponentInfo
}

const DEFAULT_CTX: LayoutCtx = {
  fixedLeft: 0,
  floatLeft: 0,
  fixedBottom: 0,
  flow: 0,
  componentInfo: {},
  setLayout: () => {
    return
  },
}

const LayoutContext = React.createContext<LayoutCtx>(DEFAULT_CTX)

type UseLayout = LayoutProps & { cssClass: string }

const COLUMNS: Position[] = ['leftCol', 'fixedLeft', 'rightCol', 'fixedRight']
const getOffset = (e: HTMLElement, position: Position) => COLUMNS.includes(position) ? e.offsetWidth : e.offsetHeight

type PositionKey = 'header' | 'leftCol' | 'main' | 'rightCol' | 'footer'
type FixedPosition = { top: number } | { left: number } | { right: number } | { bottom: number }
interface GridPosition {
  row: number
  rowSpan?: number
  col: number
  colSpan?: number
}
type Position = PositionKey | FixedPosition | GridPosition

type Offset = string | number
type Dimension = Offset | undefined

interface Dimensions {
  width?: Dimension | Dimension[]
  height?: Dimension | Dimension[]
}

// TODO How do I do this with min-content?
interface LayoutProps {
  top: number
  left: number
  right: number
  bottom: number
  cssClass: string
}

interface UseLayout {
  (role: string, position: FixedPosition, order?: number): LayoutProps
  (role: string, position: PositionKey, offset: Offset, order?: number): LayoutProps
  (role: string, position: GridPosition, dimensions: Dimensions): LayoutProps
}
export const useLayout: UseLayout = (role: string, position: Position, offsetOrOrder: Dimension, order = 0): UseLayout<T> => {
  // If it's a fixed position, the `order` is the thrid argument instead of the fourth.
  if (typeof position === 'object' && !('row' in position) && typeof offsetOrOrder === 'number') {
    order = offsetOrOrder
  }
  const { setLayout, componentInfo, ...layout } = React.useContext(LayoutContext)
  React.useEffect(() => {
    let realOffset = offset
    if (realOffset === undefined && ref.current) {
      realOffset = getOffset(ref.current, position)
    }
    if (realOffset !== undefined) {
      dispatch({ type: 'add', role, position, order, offset: realOffset })
    }
  }, [role, position, order, dispatch])
  React.useEffect(() => {
    return () => dispatch({ type: 'remove', role })
  }, [role, dispatch])
  return { ...layout, cssClass: `cactus-layout-${position}` }
}

const reduceLayout = (state: LayoutCtx, { type, role, ...action }: LayoutAction) => {
  let newState = state
  const index = state.components.findIndex((c) => c.role === role)
  if (index < 0) {
    const components = [...state.components]
    components.push(action as ComponentLayout)
    newState = { ...state, components }
  } else if (type === 'remove') {
    const components = [...state.components]
    components.splice(index, 1)
    newState = { ...state, components }
  } else {
    const old = state.components[index]
    if (!isEqual(old.position, action.position) || !isEqual(old.offset, action.offset) || old.order !== action.order) {
      const components = [...state.components]
      components.splice(index, 1, action as ComponentLayout)
      newState = { ...state, components }
    }
  }
  if (newState !== state) {
    generateGrid(newState)
  }
  return newState
}

const positionKeyOrder: { [K in PositionKey]: number } = {
  header: 0,
  leftCol: 1,
  main: 2,
  rightCol: 3,
  footer: 4,
}
const sortByOrder = (a: ComponentLayout, b: ComponentLayout) => {
  const proxyA = positionKeyOrder[a.position as any]
  const proxyB = positionKeyOrder[b.position as any]
  return proxyA === proxyB ? a.order - b.order : proxyA - proxyB
}
const isGridPosition = (x: any): x is GridPosition => 'row' in x && 'col' in x
const generateGrid = (state: LayoutState) => {
  const components = state.components.sort(sortByOrder)
  let row = 1
  let col = 1
  const rows: Dimension[] = []
  const columns: Dimension[] = []
  for (const layout of components) {
    const position = layout.position
    // TODO Is there a better way to interleave string & grid positioning?
    if (typeof position === 'string') {
      if (position === 'header' || position === 'footer') {
        rows[row++ - 1] = layout.offset
      } else {
        columns[col++ - 1] = layout.offset
      }
      layout.grid = { row, col }
    } else if (isGridPosition(layout.position)) {
      const { width, height } = layout.offset
      const { rowSpan = 1, colSpan = 1 } = layout.grid = { ...layout.position }
      assignSizes(rows, layout.grid.row, rowSpan, height, 'row')
      assignSizes(columns, layout.grid.col, colSpan, width, 'column')
    } else {
      continue
    }
  }
  state.rows = rows.map(toCSSValues, 'row').join(' ')
  state.columns = columns.map(toCSSValues, 'column').join(' ')
}

const assignSizes = (dim: Dimension[], start: number, span: number, src: Dimension | Dimension[], name: 'row' | 'column') => {
  start -= 1
  span += start
  for (let i = start; i < span; i++) {
    const size = Array.isArray(height) ? height[i - start] : height
    const existing = dim[i]
    if (!existing) {
      dim[i] = size
    } else if (size && existing !== size) {
      console.warn(`Mismatch on layout ${name} ${i + 1}: was ${existing}, now ${size}`)
    }
  }
}

function toCSSValues(this: string, size: Dimension, i): string {
  if (typeof size === 'number') {
    return `${size}px`
  } else if (!size) {
    console.warn(`Missing layout size for ${this} ${i + 1}`)
    return ''
  }
  return size
}

const reduceOffset = (offsetSum: number, layout: LayoutInfo, _: number, array: LayoutArray) => {
  array.grid += ` ${layout.offset}px`
  return offsetSum + layout.offset
}

const addStyles = (position: Position, array: LayoutInfo[]): LayoutArray => {
  const layouts = array as LayoutArray
  layouts.grid = ''
  layouts.totalOffset = layouts.reduce(reduceOffset, 0)
  return layouts
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children, ...rest }) => {
  const { current: componentInfo } = React.useRef<ComponentInfo>({})
  const [layout, setLayout] = React.useState<LayoutCtx>({ ...DEFAULT_CTX, componentInfo })
  layout.setLayout = React.useCallback(
    (newLayout: Partial<LayoutProps>) =>
      setLayout((existingLayout) => {
        for (const role of Object.keys(componentInfo) as Role[]) {
          const position = componentInfo[role]?.position
          if (position) {
            newLayout[position] = componentInfo[role]?.offset
          }
        }
        const keys = Object.keys(newLayout) as Position[]
        if (keys.some((k) => newLayout[k] !== existingLayout[k])) {
          return { ...existingLayout, ...newLayout }
        }
        return existingLayout
      }),
    [setLayout, componentInfo]
  )
  return (
    <ScreenSizeProvider>
      <LayoutContext.Provider value={layout}>
        <ActionProvider>
          <LayoutWrapper {...layout} {...getDataProps(rest)}>
            {children}
          </LayoutWrapper>
        </ActionProvider>
      </LayoutContext.Provider>
    </ScreenSizeProvider>
  )
}

// For some completely insane Typescript reason I can't use `OverflowProps` directly.
type MainProps = OverflowProps
const Main = styled.main<MainProps>`
  display: block;
  box-sizing: border-box;
  width: 100%;
  ${overflow};
  ${overflowX};
  ${overflowY};
`
Main.defaultProps = { role: 'main' }

type LayoutType = typeof Layout & {
  Content: typeof Main
}
const DefaultLayout = Layout as any
DefaultLayout.Content = Main
export default DefaultLayout as LayoutType

const styles: { [K in Position]?: any[] } = {}

const wrapperStyle = (p: LayoutProps) => css<LayoutProps>`
  overflow: auto;
  position: absolute;
  left: ${p.fixedLeft}px;
  right: 0;
  top: 0;
  height: calc(100vh - ${p.fixedBottom}px);

  .cactus-layout-floatLeft {
    width: ${p.floatLeft}px;
    height: auto;
    ${styles['floatLeft']};
  }

  .cactus-layout-fixedLeft {
    position: fixed;
    top: 0;
    left: 0;
    width: ${p.fixedLeft}px;
    bottom: ${p.fixedBottom}px;
    z-index: 100;
    ${styles['fixedLeft']};
  }

  .cactus-layout-fixedBottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: ${p.fixedBottom}px;
    z-index: 100;
    ${styles['fixedBottom']};
  }

  .cactus-layout-flow {
    ${styles['flow']};
  }

  display: -ms-grid;
  display: grid;
  -ms-grid-columns: ${p.leftCol.grid} minmax(1px, 1fr) ${p.rightCol.grid};
  grid-template-columns: ${p.leftCol.grid} minmax(1px, 1fr) ${p.rightCol.grid};
  -ms-grid-rows: ${p.header.grid} minmax(max-content, 1fr) ${p.footer.grid};
  grid-template-rows: ${p.header.grid} minmax(max-content, 1fr) ${p.footer.grid};

  ${p.header.map((h, i) => `
    & > .cactus-layout-${h.role} {
      -ms-grid-column: 1;
      -ms-grid-column-span: ${p.leftCol.length + 1 + p.rightCol.length};
      grid-column: 1 / span ${p.leftCol.length + 1 + p.rightCol.length};
      -ms-grid-row: ${i + 1};
      grid-row: ${i + 1};
    }
  `)}

  ${p.footer.map((h, i) => `
    & > .cactus-layout-${h.role} {
      -ms-grid-column: 1;
      -ms-grid-column-span: ${p.leftCol.length + 1 + p.rightCol.length};
      grid-column: 1 / span ${p.leftCol.length + 1 + p.rightCol.length};
      -ms-grid-row: ${i + 3 + p.header.length};
      grid-row: ${i + 3 + p.header.length};
    }
  `)}

  ${p.leftCol.map((h, i) => `
    & > .cactus-layout-${h.role} {
      -ms-grid-column: ${i + 1};
      -ms-grid-column-span: ${p.leftCol.length + 1 + p.rightCol.length};
      grid-column: 1 / span ${p.leftCol.length + 1 + p.rightCol.length};
      -ms-grid-row: ${i + 1};
      grid-row: ${i + 1};
    }
  `)}

  & >  {
    -ms-grid-column: 1;
    -ms-grid-column-span: 2;
    grid-column-start: 1;
    grid-column-end: 3;
  }
  & > *:nth-child(2) {
    -ms-grid-row: 2;
    grid-row-start: 2;
    grid-row-end: 3;
  }
  & > *:last-child {
    -ms-grid-row: 4;
    grid-row-start: 4;
    grid-row-end: 5;
  }
  & > *:first-child {
    -ms-grid-row: 1;
    grid-row-start: 1;
    grid-row-end: 2;
  }
  & > .cactus-layout-floatLeft {
    -ms-grid-column: 1;
    -ms-grid-column-span: 1;
    grid-column-start: 1;
    grid-column-end: 2;
    -ms-grid-row: 3;
    grid-row-start: 3;
    grid-row-end: 4;
  }
  & > ${Main} {
    -ms-grid-column: 2;
    -ms-grid-column-span: 1;
    grid-column-start: 2;
    grid-column-end: 3;
    -ms-grid-row: 3;
    grid-row-start: 3;
    grid-row-end: 4;
  }

  ${p.fixedBottom
    ? `
        display: -ms-grid;
        display: grid;
        -ms-grid-columns: minmax(1px, 1fr);
        grid-template-columns: minmax(1px, 1fr);
        -ms-grid-rows: min-content minmax(max-content, 1fr) min-content;
        grid-template-rows: min-content minmax(max-content, 1fr) min-content;

        & > * {
          -ms-grid-column: 1;
          grid-column-start: 1;
          grid-column-end: 2;
        }
        & > *:last-child {
          -ms-grid-row: 3;
          grid-row-start: 3;
          grid-row-end: 4;
        }
        & > *:first-child {
          -ms-grid-row: 1;
          grid-row-start: 1;
          grid-row-end: 2;
        }
        & > ${Main} {
          -ms-grid-row: 2;
          grid-row-start: 2;
          grid-row-end: 3;
        }
      `
    : `
      `}
`

type LayoutStyle = ReturnType<typeof wrapperStyle>
export const addLayoutStyle = (root: Position, style: LayoutStyle): void => {
  const styleList = styles[root] || (styles[root] = [])
  styleList.push(style)
}

const LayoutWrapper = styled.div<LayoutProps>(wrapperStyle)
