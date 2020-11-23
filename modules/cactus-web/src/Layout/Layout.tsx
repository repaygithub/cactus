import React from 'react'
import styled, { css } from 'styled-components'

import ActionProvider from '../ActionBar/ActionProvider'
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

export const useLayout = (role: Role, { position, offset }: LayoutInfo): UseLayout => {
  if (position === 'flow') {
    offset = 0
  }
  const { setLayout, componentInfo, ...layout } = React.useContext(LayoutContext)
  React.useEffect(() => {
    componentInfo[role] = { position, offset }
    setLayout({})
    return () => {
      delete componentInfo[role]
      setLayout({ [position]: 0 })
    }
  }, [role, position, offset, componentInfo, setLayout])
  return { ...layout, cssClass: `cactus-layout-${position}` }
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { current: componentInfo } = React.useRef<ComponentInfo>({})
  const [layout, setLayout] = React.useState<LayoutCtx>({ ...DEFAULT_CTX, componentInfo })
  layout.setLayout = React.useCallback(
    (newLayout: Partial<LayoutProps>) =>
      setLayout((layout) => {
        for (const role of Object.keys(componentInfo) as Role[]) {
          const position = componentInfo[role]?.position
          if (position) {
            newLayout[position] = componentInfo[role]?.offset
          }
        }
        const keys = Object.keys(newLayout) as Position[]
        if (keys.some((k) => newLayout[k] !== layout[k])) {
          return { ...layout, ...newLayout }
        }
        return layout
      }),
    [setLayout, componentInfo]
  )
  return (
    <ScreenSizeProvider>
      <LayoutContext.Provider value={layout}>
        <ActionProvider>
          <LayoutWrapper {...layout}>{children}</LayoutWrapper>
        </ActionProvider>
      </LayoutContext.Provider>
    </ScreenSizeProvider>
  )
}

const Main = styled.main`
  display: block;
  box-sizing: border-box;
  width: 100%;
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
    z-index: 1000;
    ${styles['fixedLeft']};
  }

  .cactus-layout-fixedBottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: ${p.fixedBottom}px;
    z-index: 1000;
    ${styles['fixedBottom']};
  }

  .cactus-layout-flow {
    ${styles['flow']};
  }

  ${p.fixedBottom
    ? `
        display: -ms-grid;
        display: grid;
        -ms-grid-columns: 1fr;
        grid-template-columns: 1fr;
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
        display: -ms-grid;
        display: grid;
        -ms-grid-columns: ${p.floatLeft}px 1fr;
        grid-template-columns: ${p.floatLeft}px 1fr;
        -ms-grid-rows: min-content min-content minmax(max-content, 1fr) min-content;
        grid-template-rows: min-content min-content minmax(max-content, 1fr) min-content;

        & > * {
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
      `}
`

type LayoutStyle = ReturnType<typeof wrapperStyle>
export const addLayoutStyle = (root: Position, style: LayoutStyle): void => {
  const styleList = styles[root] || (styles[root] = [])
  styleList.push(style)
}

const LayoutWrapper = styled.div<LayoutProps>(wrapperStyle)
