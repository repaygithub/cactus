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
import { keyPressAsClick, preventAction } from '../helpers/a11y'
import { AsProps, GenericComponent } from '../helpers/asProps'
import { border, borderSize, boxShadow, radius, textStyle } from '../helpers/theme'
import usePopup from '../helpers/usePopup'
import { useLayout } from '../Layout/Layout'
import { Sidebar as LayoutSidebar } from '../Layout/Sidebar'
import { ScreenSizeContext, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'
import {
  focusMenu,
  ITEM_SELECTOR,
  menuKeyHandler,
  useScrollButtons,
  useSubmenuHandlers,
  useSubmenuToggle,
} from './scroll'

interface ListProps {
  children: React.ReactNode
  title: React.ReactNode
  'aria-current'?: boolean
}

interface MenuProps {
  children: React.ReactNode
  expanded: boolean
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

const getMenuItems = (menu: HTMLElement) =>
  Array.from(menu.querySelectorAll(ITEM_SELECTOR)) as HTMLElement[]

function MenuBarItemFunc<E, C extends GenericComponent = 'button'>(
  props: AsProps<C>,
  ref: React.Ref<E>
) {
  // The `as any` here is to enable proper use of link substition,
  // e.g. <MenuBar.Item as="a" href="go/go/power/rangers" />
  const propsCopy = { ...props } as any
  if (!propsCopy.onKeyPress) {
    propsCopy.onKeyPress = keyPressAsClick
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

MenuBarItemFR.propTypes = {
  tabIndex: function (props: Record<string, any>): Error | null {
    if (props.tabIndex !== undefined) {
      return new Error('`tabIndex` is set programmatically, not using props')
    }
    return null
  },
  role: function (props: Record<string, any>): Error | null {
    if (props.role && props.role !== 'menuitem') {
      return new Error('`menuitem` is the only allowable ARIA role')
    }
    return null
  },
}

const MenuBarList = React.forwardRef<HTMLButtonElement, ListProps>(
  ({ title, children, ...props }, ref) => {
    const variant = useVariant()
    const isTopbar = variant === 'top'
    const [expanded, toggle] = useSubmenuToggle(isTopbar)

    const [toggleOnKey, toggleOnClick, closeOnBlur, handleSubmenu] = useSubmenuHandlers(toggle)

    return (
      <li role="none" onKeyDown={handleSubmenu} onBlur={closeOnBlur}>
        <MenuButton
          {...props}
          ref={ref}
          aria-haspopup="menu"
          aria-expanded={expanded}
          onClick={toggleOnClick}
          onKeyDown={toggleOnKey}
          onKeyUp={preventAction}
        >
          <TextWrapper>{title}</TextWrapper>
          <IconWrapper aria-hidden>
            <NavigationChevronDown />
          </IconWrapper>
        </MenuButton>
        {isTopbar ? (
          <FloatingMenu expanded={expanded}>{children}</FloatingMenu>
        ) : (
          <InlineMenu
            expanded={expanded}
            role="menu"
            aria-orientation="vertical"
            onFocus={focusMenu}
            onKeyDown={menuKeyHandler}
          >
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

const FloatingMenu: React.FC<MenuProps> = ({ children, expanded }) => {
  const [scroll, menuRef] = useScrollButtons('vertical', expanded)
  return (
    <MenuWrapper aria-hidden={!expanded || undefined} tabIndex={-1}>
      <ScrollButton show={scroll.showBack} onClick={scroll.clickBack}>
        <NavigationChevronUp />
      </ScrollButton>
      <MenuList
        role="menu"
        aria-orientation="vertical"
        ref={menuRef}
        onFocus={focusMenu}
        onKeyDown={menuKeyHandler}
      >
        {children}
      </MenuList>
      <ScrollButton show={scroll.showFore} onClick={scroll.clickFore}>
        <NavigationChevronDown />
      </ScrollButton>
    </MenuWrapper>
  )
}

const setTabIndex = (menu: HTMLElement | null, isSidebar: boolean) => {
  if (menu) {
    // There doesn't seem to be any way in React to consistently identify the
    // first descendent of a particular type, so instead we'll use this event
    // to ensure that even if elements are dynamically added or removed, the
    // first menuitem will always get tab focus for the whole component.
    const mutationCallback = () => {
      const menuItems = getMenuItems(menu)
      if (menuItems.length) {
        let i = 0
        if (!isSidebar) {
          menuItems[i++].tabIndex = 0
        }
        for (; i < menuItems.length; i++) {
          menuItems[i].tabIndex = -1
        }
      }
    }
    const observer = new MutationObserver(mutationCallback)
    observer.observe(menu, { childList: true, subtree: true })
    mutationCallback()
    return () => observer.disconnect()
  }
}

const Topbar = React.forwardRef<HTMLElement, MenuBarProps>(({ children, ...props }, ref) => {
  const orientation = 'horizontal'
  const [scroll, menuRef, menu] = useScrollButtons(orientation, true)

  React.useEffect(() => setTabIndex(menu, false), [menu])

  useLayout('menubar', { position: 'flow', offset: 0 })

  return (
    <Nav {...props} ref={ref} tabIndex={-1} onClick={navClickHandler}>
      <ScrollButton show={scroll.showBack} onClick={scroll.clickBack}>
        <NavigationChevronLeft />
      </ScrollButton>
      <MenuList
        role="menubar"
        aria-orientation={orientation}
        ref={menuRef}
        onFocus={focusMenu}
        onKeyDown={menuKeyHandler}
      >
        {children}
      </MenuList>
      <ScrollButton show={scroll.showFore} onClick={scroll.clickFore}>
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
  const { expanded, wrapperProps, buttonProps, popupProps } = usePopup('menu', {
    id,
    focusControl: getMenuItems,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, menuRef, menu] = useScrollButtons(orientation, expanded)
  React.useEffect(() => setTabIndex(menu, true), [menu])

  delete wrapperProps.role
  return (
    <ActionBar.PanelWrapper
      as={SideNav}
      ref={ref}
      {...props}
      {...wrapperProps}
      onClick={navClickHandler}
      aria-orientation={orientation}
    >
      <ActionBar.Button {...buttonProps}>
        <NavigationHamburger />
      </ActionBar.Button>
      <ActionBar.PanelPopup
        padding="0"
        width="350px"
        as={SidebarMenu}
        aria-orientation={orientation}
        onFocus={focusMenu}
        onKeyDown={menuKeyHandler}
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
  const Nav = variant === 'top' ? Topbar : Sidebar
  return <Nav {...props} ref={ref} />
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

const ScrollButton = styled.div.attrs({ 'aria-hidden': true })<{ show?: boolean }>`
  ${(p) => p.theme.colorStyles.standard};
  display: ${(p) => (p.show ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  background-color: transparent;
  text-align: center;
  outline: none;
  :hover {
    color: ${(p) => p.theme.colors.callToAction};
  }
  svg {
    width: 18px;
    height: 18px;
    margin: 8px;
  }
`

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

const InlineMenu = styled.ul<MenuProps>`
  ${listStyle}
  display: ${(p) => (p.expanded ? 'block' : 'none')};
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
  visibility: visible;
  &[aria-hidden='true'] {
    visibility: hidden;
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
  z-index: 1;

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

const MenuButton = styled.button.attrs({ role: 'menuitem' })`
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
