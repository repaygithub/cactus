import {
  NavigationChevronDown,
  NavigationChevronLeft,
  NavigationChevronRight,
  NavigationChevronUp,
  NavigationHamburger,
} from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import ActionBar from '../ActionBar/ActionBar'
import { useAction } from '../ActionBar/ActionProvider'
import { keyDownAsClick, preventAction } from '../helpers/a11y'
import { AsProps, GenericComponent } from '../helpers/asProps'
import { isIE } from '../helpers/constants'
import { FocusSetter, useFocusControl } from '../helpers/focus'
import { useMergedRefs } from '../helpers/react'
import { BUTTON_WIDTH, GetScrollInfo, ScrollButton, useScroll } from '../helpers/scroll'
import { border, borderSize, boxShadow, radius, textStyle } from '../helpers/theme'
import { useLayout } from '../Layout/Layout'
import { Sidebar as LayoutSidebar } from '../Layout/Sidebar'
import { ScreenSizeContext, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'
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
}

type Variant = 'mobile' | 'sidebar' | 'top'

const useVariant = (): Variant => {
  const size = React.useContext(ScreenSizeContext)
  if (size < SIZES.small) {
    return 'mobile'
  } else if (size < SIZES.large) {
    return 'sidebar'
  }
  return 'top'
}

function MenuBarItemFunc<E, C extends GenericComponent = 'span'>(
  props: AsProps<C>,
  ref: React.Ref<E>
) {
  // The `as any` here is to enable proper use of link substition,
  // e.g. <MenuBar.Item as="a" href="go/go/power/rangers" />
  const propsCopy = { ...props } as any
  if (!propsCopy.onKeyDown) {
    propsCopy.onKeyDown = keyDownAsClick
  }
  const original = propsCopy.onKeyUp
  propsCopy.onKeyUp = !original
    ? preventAction
    : (e: React.KeyboardEvent<HTMLElement>) => {
        original(e)
        preventAction(e)
      }
  return (
    <li role="none">
      <MenuButton ref={ref as any} {...propsCopy} />
    </li>
  )
}

type MenuBarItemType = typeof MenuBarItemFunc

// Tell Typescript to treat this as a regular functional component,
// even though React knows it's a `forwardRef` component.
const MenuBarItemFR = React.forwardRef(MenuBarItemFunc) as any
const MenuBarItem = MenuBarItemFR as MenuBarItemType

MenuBarItemFR.displayName = 'MenuBarItem'

const MenuBarList = React.forwardRef<HTMLSpanElement, ListProps>(
  ({ title, children, ...props }, ref) => {
    const variant = useVariant()
    const isTopbar = variant === 'top'
    const { wrapperProps, buttonProps, popupProps } = useSubmenu(props.id, isTopbar)

    return (
      <li {...wrapperProps}>
        <MenuButton {...props} {...buttonProps} ref={ref}>
          <TextWrapper>{title}</TextWrapper>
          <IconWrapper aria-hidden>
            <NavigationChevronDown />
          </IconWrapper>
        </MenuButton>
        {isTopbar ? (
          <FloatingMenu {...popupProps}>{children}</FloatingMenu>
        ) : (
          <InlineMenu {...popupProps} aria-orientation="vertical">
            {children}
          </InlineMenu>
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

const Topbar = React.forwardRef<HTMLElement, MenuBarProps>(({ children, ...props }, ref) => {
  const orientation = 'horizontal'
  const [menuRef, scroll] = useScroll<HTMLUListElement>(orientation, true, getWrappedScrollInfo)
  const [setFocus, rootRef] = useFocusControl(getOwnedMenuItems)
  const menuKeyHandler = useMenuKeyHandler(setFocus, true)
  const mergedRef = useMergedRefs(menuRef, rootRef)

  const onMenuFocus = useFocusHandler(setFocus)

  useLayout('menubar', { position: 'flow', offset: 0 })

  return (
    <Nav {...props} ref={ref} tabIndex={-1} onClick={navClickHandler} onKeyDown={menuKeyHandler}>
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
})

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
MenuBar.propTypes = { 'aria-label': PropTypes.string }
MenuBar.defaultProps = { 'aria-label': 'Main Menu' }

type ExportedMenuBarType = typeof MenuBar & {
  List: typeof MenuBarList
  Item: MenuBarItemType
}

const TypedMenuBar = MenuBar as ExportedMenuBarType
TypedMenuBar.List = MenuBarList
TypedMenuBar.Item = MenuBarItem

export { TypedMenuBar as MenuBar, MenuBarList, MenuBarItem }

export default TypedMenuBar

const Nav = styled.nav`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  position: relative;
  outline: none;
  ${(p) => textStyle(p.theme, 'small')};
  ${(p) => p.theme.colorStyles.standard};
  box-shadow: inset 0 -${(p) => border(p.theme, 'lightContrast').replace('solid', '0')};

  [role='menubar'] > li > [role='menuitem'] {
    white-space: nowrap;
    padding: 20px 8px;
    border: ${(p) => border(p.theme, 'transparent')};
    border-bottom-color: ${(p) => p.theme.colors.lightContrast};
    &:hover,
    &[aria-expanded='true'] {
      color: ${(p) => p.theme.colors.callToAction};
      border-bottom-color: ${(p) => p.theme.colors.callToAction};
    }
    &:focus {
      border: ${(p) => border(p.theme, 'callToAction')};
    }
    &[aria-current='true'] {
      font-weight: bold;
    }
  }
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

const InlineMenu = styled.ul`
  ${listStyle}
  display: block;
  &[aria-hidden='true'] {
    display: none;
  }
`

const SidebarMenu = styled.ul`
  ${(p) => p.theme.colorStyles.standard}
  ${(p) => textStyle(p.theme, 'small')};
  ${listStyle}

  [role='menuitem'] {
    padding: 18px 16px;
    border-bottom: ${(p) => border(p.theme, 'lightContrast')};
    ${NavigationChevronDown} {
      transform: rotateZ(-90deg);
    }
    &[aria-expanded='true'] ${NavigationChevronDown} {
      transform: rotateZ(90deg);
    }
    &:hover,
    &[aria-expanded='true'] {
      color: ${(p) => p.theme.colors.callToAction};
      border-bottom-color: ${(p) => p.theme.colors.callToAction};
    }
    position: relative;
    overflow: visible;
    &:focus::after {
      border: ${(p) => border(p.theme, 'callToAction')};
      background-color: transparent;
      box-sizing: border-box;
      width: 100%;
      height: calc(100% + ${borderSize});
      content: '';
      position: absolute;
      left: 0;
      top: 0;
    }
    &[aria-current='true'],
    &[aria-expanded='true'] {
      font-weight: 600;
    }
  }

  [role='menu'] {
    background-color: ${(p) => p.theme.colors.lightContrast};
    padding-left: 8px;
    [role='menu'] {
      padding-left: 14px;
    }
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
  border-radius: ${radius};
  ${(p) => boxShadow(p.theme, 1)};
  white-space: normal;
  flex-flow: column nowrap;
  align-items: stretch;
  width: auto;
  min-width: 200px;
  max-width: 320px;
  max-height: 70vh;
  z-index: 100;

  [role='menuitem'] {
    padding: 4px 8px;

    ${NavigationChevronDown} {
      transform: rotateZ(-90deg);
    }
    &[aria-expanded='true'] {
      background-color: ${(p) => p.theme.colors.lightContrast};
      ${NavigationChevronDown} {
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

  ${(p) => {
    // Fix for an IE bug with nested flex items.
    if (isIE && p['aria-orientation'] === 'vertical') {
      return `max-height: calc(70vh - ${BUTTON_WIDTH * 2}px);`
    }
  }}
`

const buttonStyles = `
  cursor: pointer;
  border: none;
  outline: none;
  background-color: transparent;
  text-decoration: none;
  text-align: left;
  color: inherit;
  font: inherit;
  display: flex;
  box-sizing: border-box;
  align-items: center;

  &:active,
  &:focus {
    outline: none;
  }

  &::-moz-focus-inner {
    border: none;
  }
`

const MenuButton = styled.span.attrs({ tabIndex: -1 as number, role: 'menuitem' as string })`
  ${buttonStyles}
  width: 100%;
  height: 100%;

  ${NavigationChevronDown} {
    width: 8px;
    height: 8px;
    margin-left: 16px;
    ${(p) => (p['aria-expanded'] ? 'transform: scaleY(-1);' : undefined)}
  }
`
