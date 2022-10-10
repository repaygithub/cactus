import { debounce } from 'lodash'
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
  const ref = React.useRef<HTMLDivElement>(null)
  const layout = useGridLayout()
  // By convention, make sure the last item in the array has the fixed offsets.
  const { top, bottom, left, right } = layout.styles[layout.styles.length - 1] as any

  // In most browsers, setting `top: 0; bottom: 0;` is enough, but some (Safari v14)
  // won't properly calculate nested heights unless height is explicitly set.
  React.useLayoutEffect(() => {
    const setSize = () => {
      if (ref.current) {
        ref.current.style.height = `${window.innerHeight - top - bottom}px`
        ref.current.style.width = `${window.innerWidth - left - right}px`
      }
    }
    setSize()
    const listener = debounce(setSize, 200, { maxWait: 500 })
    window.addEventListener('resize', listener)
    return () => {
      listener.cancel()
      window.removeEventListener('resize', listener)
    }
  }, [top, bottom, left, right])

  return (
    <ScreenSizeProvider>
      <LayoutContext.Provider value={layout}>
        <ActionProvider>
          <LayoutWrapper ref={ref} styles={layout.styles} {...getDataProps(rest)}>
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
