import React from 'react'
import styled from 'styled-components'
// @ts-ignore The types library doesn't have `overflowX` & `overflowY` for some reason.
import { overflow, OverflowProps, overflowX, overflowY } from 'styled-system'

import ActionProvider from '../ActionBar/ActionProvider'
import { getDataProps, omitProps } from '../helpers/omit'
import { classes, styledWithClass } from '../helpers/styled'
import ScreenSizeProvider from '../ScreenSizeProvider/ScreenSizeProvider'
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
const MainImpl = React.forwardRef<HTMLElement, MainProps>((p, ref) => {
  const layoutClass = useLayout('main', {
    width: 'minmax(1px, 1fr)',
    height: 'minmax(max-content, 1fr)',
  })
  return <main {...p} ref={ref} className={classes(p.className, layoutClass)} />
})

const Main = styled(MainImpl).withConfig(
  omitProps<MainProps & OverflowProps>(overflow, overflowX, overflowY)
)`
  display: block;
  position: relative;
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
