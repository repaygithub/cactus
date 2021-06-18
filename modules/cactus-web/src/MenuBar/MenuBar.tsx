import {
  NavigationArrowDown,
  NavigationChevronDown,
  NavigationChevronLeft,
  NavigationChevronRight,
  NavigationChevronUp,
  NavigationHamburger,
} from '@repay/cactus-icons'
import { CactusTheme } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

import ActionBar from '../ActionBar/ActionBar'
import { useAction } from '../ActionBar/ActionProvider'
import { isIE } from '../helpers/constants'
import { FocusSetter, useFocusControl } from '../helpers/focus'
import { useMergedRefs } from '../helpers/react'
import { BUTTON_WIDTH, GetScrollInfo, ScrollButton, useScroll } from '../helpers/scroll'
import { border, boxShadow, insetBorder, radius, textStyle } from '../helpers/theme'
import { useLayout } from '../Layout/Layout'
import { Sidebar as LayoutSidebar } from '../Layout/Sidebar'
import { MenuItemFunc, MenuItemType, MenuListItem } from '../MenuItem/MenuItem'
import { ScreenSizeContext, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'
import { SidebarMenu } from '../SidebarMenu/SidebarMenu'
import {
  getOwnedMenuItems,
  getVisibleMenuItems,
  useMenu,
  useMenuKeyHandler,
  useSubmenu,
} from './scroll'

interface ListProps {
  id?: string
  children: React.ReactNode
  title: React.ReactNode
  'aria-current'?: boolean
}

interface MenuBarProps {
  id?: string
  children: React.ReactNode
  'aria-label'?: string
  variant?: MenuBarVariants
}

type Variant = 'mobile' | 'sidebar' | 'top'

export type MenuBarVariants = 'light' | 'dark'

type VariantMap = { [K in MenuBarVariants]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const variantMap: VariantMap = {
  light: css`
    ${(p) => insetBorder(p.theme, 'lightContrast', 'bottom', { thin: 2, thick: 3 })};

    [role='menubar'] > li > [role='menuitem'] {
      color: ${(p) => p.theme.colors.darkestContrast};
      background-color: ${(p): string => p.theme.colors.white};

      &:hover,
      &[aria-expanded='true'] {
        border-bottom-color: ${(p) => p.theme.colors.callToAction};
        color: ${(p) => p.theme.colors.callToAction};
      }

      &:focus {
        ${(p) => insetBorder(p.theme, 'callToAction')};
      }
    }
  `,
  dark: css`
    background-color: ${(p): string => p.theme.colors.base};

    > ${ScrollButton}, [role='menubar'] > li > [role='menuitem'] {
      padding: 23px 7px 21px 7px;
      border: ${(p) => border(p.theme, 'base')};
      border-bottom: ${(p) => border(p.theme, 'base', { thin: 3, thick: 4 })};
      color: ${(p) => p.theme.colors.white};

      &:hover:not([aria-disabled]),
      &[aria-expanded='true'] {
        border-color: ${(p) => p.theme.colors.white};
      }

      &:focus {
        padding-bottom: 23px;
        border: ${(p) => border(p.theme, 'white')};
      }
    }
    ${ScrollButton} {
      padding: 0;
    }
  `,
}

const variantSelector = (
  props: MenuBarProps
): FlattenInterpolation<ThemeProps<CactusTheme>> | undefined => {
  if (props.variant !== undefined) {
    return variantMap[props.variant]
  }
}

const useVariant = (): Variant => {
  const size = React.useContext(ScreenSizeContext)
  if (size < SIZES.small) {
    return 'mobile'
  } else if (size < SIZES.large) {
    return 'sidebar'
  }
  return 'top'
}

// Tell Typescript to treat this as a regular functional component,
// even though React knows it's a `forwardRef` component.
const MenuBarItemFR = React.forwardRef(MenuItemFunc) as any
const MenuBarItem = MenuBarItemFR as MenuItemType

MenuBarItemFR.displayName = 'MenuBarItem'

const MenuBarList = React.forwardRef<HTMLSpanElement, ListProps>(
  ({ title, children, ...props }, ref) => {
    const variant = useVariant()
    const isTopbar = variant === 'top'
    const { wrapperProps, buttonProps, popupProps } = useSubmenu(props.id, isTopbar)

    return (
      <li {...wrapperProps}>
        <MenuListItem {...props} {...buttonProps} ref={ref}>
          <TextWrapper>{title}</TextWrapper>
          <IconWrapper aria-hidden>
            <NavigationArrowDown />
          </IconWrapper>
        </MenuListItem>
        {isTopbar ? (
          <FloatingMenu {...popupProps}>{children}</FloatingMenu>
        ) : (
          <SideMenu {...popupProps} aria-orientation="vertical">
            {children}
          </SideMenu>
        )}
      </li>
    )
  }
)

MenuBarList.propTypes = {
  title: PropTypes.node.isRequired,
}

const IconWrapper = styled.div`
  flex-shrink: 1;
`

const TextWrapper = styled.div`
  flex-grow: 1;
`

const getWrappedScrollInfo: GetScrollInfo = (e) => ({
  listWrapper: e.parentElement as HTMLElement,
  buttonWidth: BUTTON_WIDTH,
  listItems: getOwnedMenuItems(e),
})
const getPanelScrollInfo: GetScrollInfo = (menu) => ({
  listWrapper: menu,
  buttonWidth: 0,
  listItems: getVisibleMenuItems(menu),
})

const FloatingMenu: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  'aria-hidden': hidden,
  tabIndex,
  onKeyDown,
  ...props
}) => {
  const [menuRef, scroll] = useScroll<HTMLUListElement>('vertical', !hidden, getWrappedScrollInfo)
  return (
    <MenuWrapper aria-hidden={hidden} tabIndex={tabIndex} onKeyDown={onKeyDown}>
      <ScrollButton hidden={!scroll.showScroll} onClick={scroll.clickBack}>
        <NavigationChevronUp />
      </ScrollButton>
      <MenuList {...props} aria-orientation="vertical" ref={menuRef}>
        {children}
      </MenuList>
      <ScrollButton hidden={!scroll.showScroll} onClick={scroll.clickFore}>
        <NavigationChevronDown />
      </ScrollButton>
    </MenuWrapper>
  )
}

const SideMenu: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => {
  // You'd normally need state for this to trigger a re-render, but since these
  // are initially hidden we can guarantee at least one re-render before it's seen.
  const classRef = React.useRef<string | undefined>(undefined)
  const marginRef = React.useRef<number>(16)
  const elementId = props.id
  React.useEffect(() => {
    if (elementId) {
      const list = document.getElementById(elementId)
      let current = list,
        nestLevel = 0
      while (current && !current.matches('nav')) {
        if (current.matches('[role="menu"]')) {
          nestLevel++
        }
        current = current.parentElement
      }
      classRef.current = nestLevel % 2 ? 'nest-even' : 'nest-odd'
      marginRef.current = 8 + (nestLevel - 2) * 16
    }
  }, [elementId])
  return <InlineMenu {...props} $margin={marginRef.current} className={classRef.current} />
}

const onMenuBlur = (e: React.FocusEvent<HTMLElement>) => {
  e.currentTarget.tabIndex = 0
}
const useFocusHandler = (setFocus: FocusSetter) =>
  React.useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      e.currentTarget.tabIndex = -1
      if (e.currentTarget === e.target) {
        setFocus(0) // Set focus on the first menuitem.
      }
    },
    [setFocus]
  )

const Topbar = React.forwardRef<HTMLElement, MenuBarProps>(
  ({ children, variant = 'light', ...props }, ref) => {
    const orientation = 'horizontal'
    const [menuRef, scroll] = useScroll<HTMLUListElement>(orientation, true, getWrappedScrollInfo)
    const [setFocus, rootRef] = useFocusControl(getOwnedMenuItems)
    const menuKeyHandler = useMenuKeyHandler(setFocus, true)
    const mergedRef = useMergedRefs(menuRef, rootRef)

    const onMenuFocus = useFocusHandler(setFocus)

    useLayout('menubar', { position: 'flow', offset: 0 })

    return (
      <Nav
        {...props}
        variant={variant}
        ref={ref}
        tabIndex={-1}
        onClick={navClickHandler}
        onKeyDown={menuKeyHandler}
      >
        <ScrollButton hidden={!scroll.showScroll} onClick={scroll.clickBack}>
          <NavigationChevronLeft />
        </ScrollButton>
        <MenuList
          role="menubar"
          aria-orientation={orientation}
          ref={mergedRef}
          tabIndex={0}
          onFocus={onMenuFocus}
          onBlur={onMenuBlur}
        >
          {children}
        </MenuList>
        <ScrollButton hidden={!scroll.showScroll} onClick={scroll.clickFore}>
          <NavigationChevronRight />
        </ScrollButton>
      </Nav>
    )
  }
)

const Sidebar = React.forwardRef<HTMLElement, MenuBarProps>((props, ref) => {
  const nav = <NavPanel key="cactus-web-menubar" {...props} ref={ref} />
  const renderNav = useAction(nav, -1)
  return renderNav && <LayoutSidebar layoutRole="menubar">{renderNav}</LayoutSidebar>
})

const NavPanel = React.forwardRef<HTMLElement, MenuBarProps>(({ children, id, ...props }, ref) => {
  const orientation = 'vertical'
  const { expanded, wrapperProps, buttonProps, popupProps } = useMenu(id)
  const [menuRef] = useScroll<HTMLUListElement>(orientation, expanded, getPanelScrollInfo)

  delete wrapperProps.role
  return (
    <ActionBar.PanelWrapper
      as={SideNav}
      ref={ref}
      {...props}
      {...wrapperProps}
      onClick={navClickHandler}
    >
      <ActionBar.Button {...buttonProps}>
        <NavigationHamburger />
      </ActionBar.Button>
      <ActionBar.PanelPopup
        padding="0"
        width="350px"
        as={SidebarMenu}
        aria-orientation={orientation}
        ref={menuRef}
        {...popupProps}
      >
        {children}
      </ActionBar.PanelPopup>
    </ActionBar.PanelWrapper>
  )
})

const MenuBar = React.forwardRef<HTMLElement, MenuBarProps>((props, ref) => {
  const variant = useVariant()
  const NavComponent = variant === 'top' ? Topbar : Sidebar
  return <NavComponent {...props} ref={ref} />
})

const navClickHandler = (event: React.MouseEvent<HTMLElement>) => {
  const button = event.target as HTMLElement
  if (button.matches && button.matches('[role="menuitem"]:not([aria-haspopup])')) {
    ;(document.activeElement as HTMLElement).blur()
  }
}

MenuBar.displayName = 'MenuBar'
MenuBar.propTypes = { 'aria-label': PropTypes.string, variant: PropTypes.oneOf(['light', 'dark']) }
MenuBar.defaultProps = { 'aria-label': 'Main Menu', variant: 'light' }

type ExportedMenuBarType = typeof MenuBar & {
  List: typeof MenuBarList
  Item: MenuItemType
}

const TypedMenuBar = MenuBar as ExportedMenuBarType
TypedMenuBar.List = MenuBarList
TypedMenuBar.Item = MenuBarItem

export { TypedMenuBar as MenuBar, MenuBarList, MenuBarItem }

export default TypedMenuBar

const Nav = styled.nav<MenuBarProps>`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  position: relative;
  outline: none;
  z-index: 100;
  [role='menubar'] > li > [role='menuitem'] {
    white-space: nowrap;
    padding: 24px 16px;
    border-bottom: ${(p) => border(p.theme, 'lightContrast', { thin: 2, thick: 3 })};
    ${(p) => textStyle(p.theme, 'body')};
    font-weight: 600;
    text-transform: uppercase;
  }
  [role='menubar'] > li {
    &:hover,
    &[aria-expanded='true'] {
      z-index: 100;
      ${(p) => boxShadow(p.theme, 2)}
    }
  }
  ${variantSelector}
`

// Don't need `addLayoutStyle` because there are no dynamic values in the nested style.
const SideNav = styled.nav`
  .cactus-layout-fixedBottom & {
    position: absolute;
    left: 0;
    bottom: 0;
  }
`

const listStyle = `
  list-style: none;
  padding: 0;
  margin: 0;
`

const InlineMenu = styled.ul<{ $margin: number }>`
  ${listStyle}
  display: block;
  && [role='menuitem'] {
    margin-left: ${(p) => p.$margin}px;
    width: calc(100% - ${(p) => p.$margin}px);
    border-bottom-color: transparent;
  }
  &[aria-hidden='true'] {
    display: none;
  }
  &.nest-even {
    background-color: ${(p) => p.theme.colors.white};
  }
  &.nest-odd {
    background-color: ${(p) => p.theme.colors.lightContrast};
  }
`

const MenuWrapper = styled.div`
  ${(p) => p.theme.colorStyles.standard};
  display: flex;
  &[aria-hidden='true'] {
    display: none;
  }
  position: absolute;
  top: 100%;
  left: 0;
  outline: none;
  border: ${(p) => border(p.theme, 'lightContrast')};
  border-radius: ${radius(8)};
  ${(p) => boxShadow(p.theme, 1)};
  white-space: normal;
  flex-flow: column nowrap;
  align-items: stretch;
  width: max-content;
  min-width: 200px;
  max-width: 320px;
  max-height: 70vh;
  z-index: 100;

  [role='menuitem'] {
    padding: 4px 8px;

    ${NavigationArrowDown} {
      transform: rotateZ(-90deg);
    }
    &[aria-expanded='true'] {
      background-color: ${(p) => p.theme.colors.lightContrast};
      ${NavigationArrowDown} {
        transform: rotateZ(90deg);
      }
    }
    &:hover {
      color: ${(p) => p.theme.colors.callToAction};
    }
    &:focus {
      background-color: ${(p) => p.theme.colors.lightContrast};
      color: ${(p) => p.theme.colors.callToAction};
    }
  }
`

const MenuList = styled.ul`
  ${listStyle}
  width: 100%;
  display: flex;
  flex-direction: ${(p) => (p['aria-orientation'] === 'vertical' ? 'column' : 'row')};
  justify-content: flex-start;
  flex-wrap: nowrap;
  align-items: stretch;
  overflow: hidden;
  color: ${(p) => p.theme.colors.darkestContrast};
  ${(p) => textStyle(p.theme, 'small')};
  ${(p) => {
    // Fix for an IE bug with nested flex items.
    if (isIE && p['aria-orientation'] === 'vertical') {
      return `max-height: calc(70vh - ${BUTTON_WIDTH * 2}px);`
    }
  }}
`
