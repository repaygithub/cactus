import React from 'react'
import styled from 'styled-components'

import { border } from '../helpers/theme'
import ScreenSizeProvider, {
  ScreenSizeContext,
  SIZES,
} from '../ScreenSizeProvider/ScreenSizeProvider'

type Role = 'menubar' | 'actionbar' | 'footer'
type SidebarVariant = 'fixedLeft' | 'floatLeft' | 'fixedBottom'
type Position = SidebarVariant | 'flow'

type LayoutProps = { [K in Position]: number }

export interface LayoutInfo {
  position: Position
  offset: number
}

type ComponentInfo = { [K in Role]?: LayoutInfo }

interface LayoutCtx extends LayoutProps {
  setLayout: (l: Partial<LayoutProps>) => void
  componentInfo: ComponentInfo
}

interface SidebarProps extends LayoutCtx {
  variant: SidebarVariant
}

export const Sidebar: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const size = React.useContext(ScreenSizeContext)
  const layout = React.useContext(LayoutContext)
  let variant: SidebarVariant = 'floatLeft'
  if (size < SIZES.small) {
    variant = 'fixedBottom'
  } else if (size < SIZES.large) {
    variant = 'fixedLeft'
  }
  return <SidebarDiv {...props} {...layout} variant={variant} />
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

export const useLayout = (role: Role, { position, offset }: LayoutInfo): LayoutProps => {
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
  return layout
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
        <LayoutWrapper {...layout}>{children}</LayoutWrapper>
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

const SidebarDiv = styled.div<SidebarProps>`
  background-color: transparent;
  box-sizing: border-box;
  ${(p) => {
    switch (p.variant) {
      case 'fixedBottom':
        return `
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          height: ${p.fixedBottom}px;
          border-top: ${border(p.theme, 'lightContrast')};
        `
      case 'fixedLeft':
        return `
          position: fixed;
          top: 0;
          left: 0;
          width: ${p.fixedLeft}px;
          bottom: ${p.fixedBottom}px;
          border-right: ${border(p.theme, 'lightContrast')};
        `
      case 'floatLeft':
        return `
          width: ${p.floatLeft}px;
          height: auto;
          border-right: ${border(p.theme, 'lightContrast')};
        `
    }
  }}
`

const LayoutWrapper = styled.div<LayoutProps>`
  overflow: auto;
  position: absolute;
  left: ${(p) => p.fixedLeft}px;
  right: 0;
  top: 0;
  bottom: ${(p) => p.fixedBottom}px;

  ${(p) =>
    !p.floatLeft
      ? 'display: block;'
      : `
        display: -ms-grid;
        display: grid;
        -ms-grid-columns: ${p.floatLeft}px 1fr;
        grid-template-columns: ${p.floatLeft}px 1fr;
        -ms-grid-rows: min-content min-content minmax(max-content, 1fr);
        grid-template-rows: min-content min-content minmax(max-content, 1fr);

        & > * {
          -ms-grid-column: 1;
          -ms-grid-column-span: 2;
          grid-column-start: 1;
          grid-column-end: 3;
        }
        & > *:first-child {
          -ms-grid-row: 1;
        }
        & > *:nth-child(2) {
          -ms-grid-row: 2;
        }
        & > ${SidebarDiv} {
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

type LayoutType = typeof Layout & {
  Content: typeof Main
  Sidebar: typeof Sidebar
}

const DefaultLayout = Layout as any
DefaultLayout.Content = Main
DefaultLayout.Sidebar = Sidebar

export default DefaultLayout as LayoutType
