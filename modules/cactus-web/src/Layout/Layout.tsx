import React from 'react'
import styled from 'styled-components'

import ActionProvider from '../ActionBar/ActionProvider'
import { insetBorder } from '../helpers/theme'
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

interface SidebarProps extends LayoutProps {
  variant: SidebarVariant
}

interface LayoutSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  layoutRole: Role
}

type SidebarType = React.FC<LayoutSidebarProps> & { Button: ReturnType<typeof styled.button> }

export const Sidebar: SidebarType = ({ layoutRole, ...props }) => {
  const size = React.useContext(ScreenSizeContext)
  let variant: SidebarVariant = 'floatLeft'
  if (size < SIZES.small) {
    variant = 'fixedBottom'
  } else if (size < SIZES.large) {
    variant = 'fixedLeft'
  }
  const layout = useLayout(layoutRole, { position: variant, offset: 60 })
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

Sidebar.Button = styled.button.attrs({ role: 'button' })`
  cursor: pointer;
  border: none;
  outline: none;
  background-color: transparent;
  text-decoration: none;
  text-align: left;
  color: inherit;
  font: inherit;
  box-sizing: border-box;

  &:active,
  &:focus {
    outline: none;
  }

  &::-moz-focus-inner {
    border: none;
  }

  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  padding: 8px;

  img,
  svg {
    width: 24px;
    height: 24px;
  }

  :hover {
    color: ${(p) => p.theme.colors.callToAction};
  }

  &&&:focus {
    ${(p) => insetBorder(p.theme, 'callToAction')};
  }

  &&&[aria-expanded='true'] {
    ${(p) => p.theme.colorStyles.callToAction};
    box-shadow: none;
  }
`

const SidebarDiv = styled.div<SidebarProps>`
  ${(p) => p.theme.colorStyles.standard};
  box-sizing: border-box;
  display: flex;
  :empty {
    display: none;
  }
  ${(p) => {
    const buttonBorder = p.variant === 'fixedBottom' ? 'right' : 'bottom'
    const buttonStyle = `${Sidebar.Button} {
      ${insetBorder(p.theme, 'lightContrast', buttonBorder)};
      :hover {
        ${insetBorder(p.theme, 'callToAction', buttonBorder)};
      }
    }`
    switch (p.variant) {
      case 'fixedBottom':
        return `
          flex-direction: row;
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          height: ${p.fixedBottom}px;
          ${insetBorder(p.theme, 'lightContrast', 'top')};
          ${buttonStyle};
          ${Sidebar.Button}[aria-expanded='true']::after {
            content: '';
            z-index: 99;
            background-color: rgba(0, 0, 0, 0.5);
            position: fixed;
            top: 0;
            bottom: ${p.fixedBottom}px;
            left: 0;
            right: 0;
            cursor: default;
          }
        `
      case 'fixedLeft':
        return `
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          width: ${p.fixedLeft}px;
          bottom: ${p.fixedBottom}px;
          ${insetBorder(p.theme, 'lightContrast', 'right')};
          ${buttonStyle};
        `
      case 'floatLeft':
        return `
          flex-direction: column;
          width: ${p.floatLeft}px;
          height: auto;
          ${insetBorder(p.theme, 'lightContrast', 'right')};
          ${buttonStyle};
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
