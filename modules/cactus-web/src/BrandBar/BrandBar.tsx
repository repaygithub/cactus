import { DescriptiveProfile, NavigationChevronDown } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React, { Children, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { ActionBar } from '../ActionBar/ActionBar'
import { OrderHint, useAction } from '../ActionBar/ActionProvider'
import Flex from '../Flex/Flex'
import { keyDownAsClick, preventAction } from '../helpers/a11y'
import { AsProps, GenericComponent } from '../helpers/asProps'
import { useFocusControl } from '../helpers/focus'
import { useMergedRefs } from '../helpers/react'
import { useScroll } from '../helpers/scroll'
import { border, boxShadow, insetBorder, radius, textStyle } from '../helpers/theme'
import usePopup from '../helpers/usePopup'
import { Sidebar } from '../Layout/Sidebar'
import {
  getPanelScrollInfo,
  onMenuBlur,
  SidebarMenu as ActionMenuPopup,
  useFocusHandler,
} from '../MenuBar/MenuBar'
import { getOwnedMenuItems, useMenu, useMenuKeyHandler } from '../MenuBar/scroll'
import { SIZES, useScreenSize } from '../ScreenSizeProvider/ScreenSizeProvider'

type ChildElement = React.ReactElement<any, React.ComponentType>

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string
  mobileIcon?: React.ReactElement
  orderHint?: OrderHint
}

interface UserMenuProps {
  label: React.ReactNode
  isProfilePage?: boolean
}

interface UserMenuPopupProps {
  expanded?: boolean
  $menuWidth?: number
}

interface ProfileStyleProp {
  $isProfilePage?: boolean
}

interface BrandBarProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: string | React.ReactElement
}

type MenuItemProps<C extends GenericComponent> = AsProps<C> & {
  isSelected?: boolean
  handleMouseEnter?: () => void
}

function MenuItemFunc<E, C extends GenericComponent = 'span'>(
  props: MenuItemProps<C>,
  ref: React.Ref<E>
) {
  const { isSelected } = props
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
      <MenuListItem
        data-selected={isSelected}
        tabIndex={-1}
        role="menuitem"
        ref={ref as any}
        {...propsCopy}
      />
    </li>
  )
}

type MenuItemType = typeof MenuItemFunc

// Tell Typescript to treat this as a regular functional component,
// even though React knows it's a `forwardRef` component.
const MenuItemFR = React.forwardRef(MenuItemFunc) as any
const MenuItem = MenuItemFR as MenuItemType

export const BrandBarUserMenu: React.FC<UserMenuProps> = (props) => {
  const isTiny = SIZES.tiny === useScreenSize()
  const MenuComponent = isTiny ? ActionBarUserMenu : UserMenu
  return <MenuComponent {...props} />
}

export const BrandBarItem: React.FC<ItemProps> = ({ mobileIcon, ...props }) => {
  const isTiny = SIZES.tiny === useScreenSize()
  if (isTiny && mobileIcon) {
    return <ActionBar.Panel aria-label="" {...props} icon={mobileIcon} />
  }
  return <>{props.children}</>
}

type BrandBarType = React.FC<BrandBarProps> & {
  Item: typeof BrandBarItem
  UserMenu: typeof BrandBarUserMenu
  UserMenuItem: typeof MenuItem
}

export const BrandBar: BrandBarType = ({ logo, children, ...props }) => {
  const isTiny = SIZES.tiny === useScreenSize()
  const justify = isTiny ? 'center' : 'flex-end'
  return (
    <StyledBrandBar {...props} $isTiny={isTiny}>
      <LogoWrapper>{typeof logo === 'string' ? <img alt="Logo" src={logo} /> : logo}</LogoWrapper>
      <Flex alignItems="flex-end" justifyContent={justify}>
        {children}
      </Flex>
    </StyledBrandBar>
  )
}

BrandBar.displayName = 'BrandBar'
BrandBar.Item = BrandBarItem
BrandBar.UserMenu = BrandBarUserMenu
BrandBar.UserMenuItem = MenuItem

BrandBar.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

BrandBarItem.propTypes = {
  mobileIcon: PropTypes.element,
  orderHint: ActionBar.Panel.propTypes?.orderHint,
}

BrandBarItem.defaultProps = { orderHint: 'low' }

BrandBarUserMenu.propTypes = {
  label: PropTypes.node.isRequired,
  isProfilePage: PropTypes.bool,
}

BrandBarUserMenu.defaultProps = {
  isProfilePage: false,
}

export default BrandBar

const ActionBarUserMenu: React.FC<UserMenuProps> = ({
  label,
  children,
  isProfilePage,
  ...rest
}) => {
  const actionMenuId = 'actionbar-user-menu'
  const orientation = 'vertical'
  const { expanded, wrapperProps, buttonProps, popupProps } = useMenu(actionMenuId)
  const [menuRef] = useScroll<HTMLDivElement>(orientation, expanded, getPanelScrollInfo)
  const [setFocus, rootRef] = useFocusControl(getOwnedMenuItems)
  const onMenuFocus = useFocusHandler(setFocus)
  const menuKeyHandler = useMenuKeyHandler(setFocus, false)
  const mergedRef = useMergedRefs(menuRef, rootRef)

  const button = (
    <ActionBar.PanelWrapper key="cactus-user-menu" {...wrapperProps}>
      <ActionMenuButton $isProfilePage={isProfilePage} {...buttonProps} {...rest}>
        <DescriptiveProfile />
      </ActionMenuButton>
      <ActionBar.PanelPopup
        as={ActionMenuPopup}
        ref={menuRef}
        aria-orientation={orientation}
        {...popupProps}
      >
        <PopupHeader>
          <DescriptiveProfile mr="8px" />
          {label}
        </PopupHeader>
        <ActionMenuList
          role="menubar"
          aria-orientation={orientation}
          tabIndex={0}
          ref={mergedRef}
          onFocus={onMenuFocus}
          onBlur={onMenuBlur}
          onKeyDown={menuKeyHandler}
        >
          {children}
        </ActionMenuList>
      </ActionBar.PanelPopup>
    </ActionBar.PanelWrapper>
  )
  const renderButton = useAction(button, 1000)
  return renderButton && <Sidebar layoutRole="brandbar">{renderButton}</Sidebar>
}

const UserMenu: React.FC<UserMenuProps> = ({ label, children, isProfilePage, ...rest }) => {
  const userMenuId = 'user-menu'
  const orientation = 'vertical'
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps, expanded, popupProps, wrapperProps } = useMenu(userMenuId)
  const [menuRef] = useScroll<HTMLDivElement>(orientation, expanded, getPanelScrollInfo)
  const popupWidth = buttonRef.current?.getBoundingClientRect().width

  const [setFocus, rootRef] = useFocusControl(getOwnedMenuItems)
  const onMenuFocus = useFocusHandler(setFocus)
  const menuKeyHandler = useMenuKeyHandler(setFocus, false)
  const mergedRef = useMergedRefs(menuRef, rootRef)

  return (
    <div id={userMenuId} {...wrapperProps}>
      <MenuButton ref={buttonRef} {...buttonProps} {...rest}>
        <DescriptiveProfile aria-hidden mr="8px" />
        <span>{label}</span>
        <NavigationChevronDown aria-hidden ml="8px" />
      </MenuButton>
      <UserMenuPopup ref={menuRef} expanded={expanded} $menuWidth={popupWidth} {...popupProps}>
        <MenuList
          role="menubar"
          ref={mergedRef}
          onFocus={onMenuFocus}
          tabIndex={0}
          onKeyDown={menuKeyHandler}
        >
          {children}
        </MenuList>
      </UserMenuPopup>
    </div>
  )
}

const UserMenuPopup = styled.div<UserMenuPopupProps>`
  position: fixed;
  display: ${(p) => (p.expanded ? 'block' : 'none')};
  width: ${(p) => (p.$menuWidth ? `${p.$menuWidth}px` : 'unset')};
  outline: none;
`

const StyledBrandBar = styled.div<{ $isTiny: boolean }>`
  display: flex;
  ${(p) =>
    p.$isTiny
      ? `
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  `
      : `
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  `}
  width: 100%;
  ${(p): string => insetBorder(p.theme, 'lightContrast', 'bottom')};
`
const LogoWrapper = styled.div`
  padding: 16px;
  &,
  * {
    display: block;
    max-width: 200px;
    max-height: 80px;
  }
`

const MenuButton = styled.button<ProfileStyleProp>`
  ${(p) => textStyle(p.theme, 'body')};
  font-weight: 600;
  margin-right: 5px;
  background-color: transparent;
  border: 0;
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  margin: 0;
  border-radius: 0;
  ${(p) =>
    p.$isProfilePage &&
    `
    color: ${p.theme.colors.callToAction};
    ${insetBorder(p.theme, 'callToAction', 'bottom')};
  `}
  &:focus {
    ${(p) => insetBorder(p.theme, 'callToAction')};
    outline: none;
  }
  &[aria-expanded='true'] {
    ${(p) => insetBorder(p.theme, 'callToAction', 'bottom')};
    color: ${(p): string => p.theme.colors.callToAction};

    ${NavigationChevronDown} {
      transform: scaleY(-1);
    }
  }
  &:hover {
    color: ${(p): string => p.theme.colors.callToAction};
  }

  & svg {
    font-size: 12px;
  }
`

const MenuList = styled.ul`
  display: block;
  padding: 8px 0;
  margin-top: 8px;
  border-radius: ${radius(8)};
  ${(p) => boxShadow(p.theme, 1) || `border: ${border(p.theme, 'lightContrast')}`};
  background-color: ${(p) => p.theme.colors.white};
  list-style: none;

  [role='menuitem'] {
    z-index: 110;
    box-sizing: border-box;
    position: relative;
    display: block;
    cursor: pointer;
    text-decoration: none;
    overflow-wrap: break-word;
    ${(p) => textStyle(p.theme, 'small')};
    ${(p) => p.theme.colorStyles.standard};
    outline: none;
    padding: 4px 16px;
    text-align: center;
    &:hover {
      ${(p) => p.theme.colorStyles.callToAction};
    }
  }
`

const ActionMenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  outline: none;
`

const ActionMenuButton = styled(ActionBar.Button)<ProfileStyleProp>(
  (p) => p.$isProfilePage && `color: ${p.theme.colors.callToAction};`
)

const PopupHeader = styled.div`
  text-align: right;
  box-sizing: border-box;
  display: block;
  overflow-wrap: break-word;
  padding: 18px 16px;
  ${(p) => textStyle(p.theme, 'body')};
  font-weight: 600;
  color: ${(p) => p.theme.colors.callToAction};
  ${(p) => insetBorder(p.theme, 'callToAction', 'bottom')};
  svg {
    font-size: 12px;
  }
`

const MenuListItem = styled.span`
  align-items: center;
  background-color: transparent;
  border: none;
  box-sizing: border-box;
  color: inherit;
  cursor: pointer;
  display: flex;
  font: inherit;
  height: 100%;
  text-align: left;
  text-decoration: none;
  outline: none;
  width: 100%;

  &:active,
  &:focus {
    outline: none;
  }

  &::-moz-focus-inner {
    border: none;
  }
`
