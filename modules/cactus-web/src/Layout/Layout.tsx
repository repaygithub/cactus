import React from 'react'
// @ts-ignore The types library doesn't have `overflowX` & `overflowY` for some reason.
import { overflow, OverflowProps, overflowX, overflowY } from 'styled-system'

import ActionProvider from '../ActionBar/ActionProvider'
import { getDataProps } from '../helpers/omit'
import { classes, withStyles } from '../helpers/styled'
import ScreenSizeProvider from '../ScreenSizeProvider/ScreenSizeProvider'
import useGridLayout, { LayoutContext, useLayout } from './grid'

export { useLayout }

type StyleList = ReturnType<typeof useGridLayout>['styles']
interface LayoutProps {
  styles: StyleList
}

const LayoutWrapper = withStyles('div', {
  className: 'cactus-layout',
  transitiveProps: ['styles'],
})<LayoutProps>((p) => p.styles)

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

const useMainLayout = (p: { className?: string }) => {
  const layoutClass = useLayout('main', {
    width: 'minmax(1px, 1fr)',
    height: 'minmax(max-content, 1fr)',
  })
  return { className: classes(p.className, layoutClass) }
}

const Main = withStyles('main', {
  displayName: 'Main',
  extraAttrs: useMainLayout,
  styles: [overflow, overflowX, overflowY],
})<OverflowProps>`
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
