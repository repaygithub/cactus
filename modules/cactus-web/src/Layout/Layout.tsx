import React from 'react'
import styled from 'styled-components'
// @ts-ignore The types library doesn't have `overflowX` & `overflowY` for some reason.
import { overflow, OverflowProps, overflowX, overflowY } from 'styled-system'

import ActionProvider from '../ActionBar/ActionProvider'
import { getDataProps, omitProps } from '../helpers/omit'
import ScreenSizeProvider from '../ScreenSizeProvider/ScreenSizeProvider'
import { classes, styledWithClass } from '../helpers/styled'
import useGridLayout, { LayoutContext, useLayout } from './grid'

export { useLayout }

type StyleList = ReturnType<typeof useGridLayout>['styles']
interface LayoutProps {
  styles: StyleList
}

const LayoutWrapper = styledWithClass('div', 'cactus-layout')<LayoutProps>((p) => p.styles)

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children, ...rest }) => {
  const layout = useGridLayout()
  return (
    <ScreenSizeProvider>
      <LayoutContext.Provider value={layout}>
        <ActionProvider>
          <LayoutWrapper styles={layout.styles} {...getDataProps(rest)}>
            {children}
          </LayoutWrapper>
        </ActionProvider>
      </LayoutContext.Provider>
    </ScreenSizeProvider>
  )
}

type MainProps = React.HTMLAttributes<HTMLElement>
const MainImpl = React.forwardRef<HTMLElement, MainProps>(
  (p, ref) => {
    const layoutClass = useLayout('main', { main: 'minmax(1px, 1fr);minmax(max-content, 1fr)' })
    return <main {...p} ref={ref} className={classes(p.className, layoutClass)} />
})

const Main = styled(MainImpl).withConfig(
  omitProps<MainProps & OverflowProps>(overflow, overflowX, overflowY)
)`
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

//const styles: { [K in Position]?: any[] } = {}
//
//const wrapperStyle = (p: LayoutProps) => css<LayoutProps>`
//  .cactus-layout-floatLeft {
//    width: ${p.floatLeft}px;
//    height: auto;
//    ${styles['floatLeft']};
//  }
//
//  .cactus-layout-fixedLeft {
//    position: fixed;
//    top: 0;
//    left: 0;
//    width: ${p.fixedLeft}px;
//    bottom: ${p.fixedBottom}px;
//    z-index: 100;
//    ${styles['fixedLeft']};
//  }
//
//  .cactus-layout-fixedBottom {
//    position: fixed;
//    left: 0;
//    right: 0;
//    bottom: 0;
//    height: ${p.fixedBottom}px;
//    z-index: 100;
//    ${styles['fixedBottom']};
//  }
//
//  .cactus-layout-flow {
//    ${styles['flow']};
//  }
//`
//
//type LayoutStyle = ReturnType<typeof wrapperStyle>
//export const addLayoutStyle = (root: Position, style: LayoutStyle): void => {
//  const styleList = styles[root] || (styles[root] = [])
//  styleList.push(style)
//}
